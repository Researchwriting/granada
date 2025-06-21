from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from database.connection import get_db_session
from database.models import DonorOpportunity, SearchStatistics
from services.bot_manager import bot_manager
from services.verification_service import verification_service
import uuid

router = APIRouter()

@router.get("/opportunities")
async def get_opportunities(
    query: Optional[str] = None,
    country: Optional[str] = None,
    sector: Optional[str] = None,
    min_amount: Optional[int] = None,
    max_amount: Optional[int] = None,
    verified_only: bool = False,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db_session)
):
    """Get funding opportunities with filtering"""
    try:
        # Build query
        stmt = select(DonorOpportunity).where(
            DonorOpportunity.is_active == True
        )
        
        # Apply filters
        if query:
            search_terms = [term.strip() for term in query.split() if term.strip()]
            search_conditions = []
            
            for term in search_terms:
                search_conditions.append(
                    or_(
                        DonorOpportunity.title.ilike(f"%{term}%"),
                        DonorOpportunity.description.ilike(f"%{term}%")
                    )
                )
            
            if search_conditions:
                stmt = stmt.where(and_(*search_conditions))
        
        if country:
            stmt = stmt.where(DonorOpportunity.country == country)
        
        if sector:
            stmt = stmt.where(DonorOpportunity.sector == sector)
        
        if min_amount:
            stmt = stmt.where(
                or_(
                    DonorOpportunity.amount_max >= min_amount,
                    DonorOpportunity.amount_min >= min_amount
                )
            )
        
        if max_amount:
            stmt = stmt.where(
                or_(
                    DonorOpportunity.amount_min <= max_amount,
                    DonorOpportunity.amount_max <= max_amount
                )
            )
        
        if verified_only:
            stmt = stmt.where(DonorOpportunity.is_verified == True)
        
        # Order by most recent first
        stmt = stmt.order_by(desc(DonorOpportunity.scraped_at))
        
        # Apply pagination
        stmt = stmt.offset(offset).limit(limit)
        
        # Execute query
        result = await db.execute(stmt)
        opportunities = result.scalars().all()
        
        # Get total count
        count_stmt = select(func.count()).select_from(DonorOpportunity).where(
            DonorOpportunity.is_active == True
        )
        
        if verified_only:
            count_stmt = count_stmt.where(DonorOpportunity.is_verified == True)
            
        count_result = await db.execute(count_stmt)
        total_count = count_result.scalar()
        
        # Format response
        return {
            "opportunities": [
                {
                    "id": str(opp.id),
                    "title": opp.title,
                    "description": opp.description,
                    "deadline": opp.deadline.isoformat() if opp.deadline else None,
                    "amount_min": opp.amount_min,
                    "amount_max": opp.amount_max,
                    "currency": opp.currency,
                    "source_url": opp.source_url,
                    "source_name": opp.source_name,
                    "country": opp.country,
                    "sector": opp.sector,
                    "is_verified": opp.is_verified,
                    "verification_score": opp.verification_score,
                    "scraped_at": opp.scraped_at.isoformat() if opp.scraped_at else None
                }
                for opp in opportunities
            ],
            "total": total_count,
            "limit": limit,
            "offset": offset,
            "has_more": (offset + limit) < total_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving opportunities: {str(e)}")

@router.get("/opportunity/{opportunity_id}")
async def get_opportunity_details(
    opportunity_id: str,
    db: AsyncSession = Depends(get_db_session)
):
    """Get detailed information about a specific opportunity"""
    try:
        # Convert string ID to UUID
        try:
            opp_id = uuid.UUID(opportunity_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid opportunity ID format")
        
        # Get opportunity
        result = await db.execute(
            select(DonorOpportunity).where(DonorOpportunity.id == opp_id)
        )
        
        opportunity = result.scalar_one_or_none()
        
        if not opportunity:
            raise HTTPException(status_code=404, detail="Opportunity not found")
        
        # Format response
        return {
            "id": str(opportunity.id),
            "title": opportunity.title,
            "description": opportunity.description,
            "deadline": opportunity.deadline.isoformat() if opportunity.deadline else None,
            "amount_min": opportunity.amount_min,
            "amount_max": opportunity.amount_max,
            "currency": opportunity.currency,
            "source_url": opportunity.source_url,
            "source_name": opportunity.source_name,
            "country": opportunity.country,
            "sector": opportunity.sector,
            "eligibility_criteria": opportunity.eligibility_criteria,
            "application_process": opportunity.application_process,
            "contact_email": opportunity.contact_email,
            "contact_phone": opportunity.contact_phone,
            "keywords": opportunity.keywords,
            "focus_areas": opportunity.focus_areas,
            "is_verified": opportunity.is_verified,
            "verification_score": opportunity.verification_score,
            "scraped_at": opportunity.scraped_at.isoformat() if opportunity.scraped_at else None,
            "last_verified": opportunity.last_verified.isoformat() if opportunity.last_verified else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving opportunity: {str(e)}")

@router.get("/statistics")
async def get_search_statistics(
    db: AsyncSession = Depends(get_db_session)
):
    """Get statistics about the search system"""
    try:
        # Get bot statistics
        bot_stats = await bot_manager.get_bot_statistics()
        
        # Get opportunity counts
        total_result = await db.execute(
            select(func.count()).select_from(DonorOpportunity)
        )
        total_opportunities = total_result.scalar()
        
        verified_result = await db.execute(
            select(func.count()).select_from(DonorOpportunity).where(
                DonorOpportunity.is_verified == True
            )
        )
        verified_opportunities = verified_result.scalar()
        
        # Get country statistics
        country_result = await db.execute(
            select(
                DonorOpportunity.country,
                func.count().label('count')
            )
            .group_by(DonorOpportunity.country)
            .order_by(desc('count'))
            .limit(10)
        )
        
        country_stats = [
            {"country": row[0], "count": row[1]}
            for row in country_result
        ]
        
        # Get source statistics
        source_result = await db.execute(
            select(
                DonorOpportunity.source_name,
                func.count().label('count')
            )
            .group_by(DonorOpportunity.source_name)
            .order_by(desc('count'))
            .limit(10)
        )
        
        source_stats = [
            {"source": row[0], "count": row[1]}
            for row in source_result
        ]
        
        # Get recent activity
        recent_result = await db.execute(
            select(SearchStatistics)
            .order_by(desc(SearchStatistics.date))
            .limit(10)
        )
        
        recent_activity = [
            {
                "date": stat.date.isoformat(),
                "country": stat.country,
                "source_name": stat.source_name,
                "opportunities_found": stat.opportunities_found,
                "opportunities_verified": stat.opportunities_verified,
                "success_rate": stat.success_rate
            }
            for stat in recent_result.scalars().all()
        ]
        
        # Format response
        return {
            "total_opportunities": total_opportunities,
            "verified_opportunities": verified_opportunities,
            "verification_rate": verified_opportunities / total_opportunities if total_opportunities else 0,
            "bots": bot_stats,
            "countries": country_stats,
            "sources": source_stats,
            "recent_activity": recent_activity,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving statistics: {str(e)}")

@router.post("/trigger-search")
async def trigger_search(
    country: str,
    query: Optional[str] = None
):
    """Trigger an immediate search for a specific country"""
    try:
        # Check if bot exists for country
        bot = bot_manager.bots.get(country.lower().replace(' ', '_'))
        
        if not bot:
            raise HTTPException(status_code=404, detail=f"No search bot found for {country}")
        
        # Trigger search
        if query:
            # Add search query to all targets
            for target in bot.targets:
                bot_manager.scrapingQueue.append({"target": target, "query": query})
        else:
            # Add all targets without specific query
            for target in bot.targets:
                bot_manager.scrapingQueue.append({"target": target})
        
        return {
            "status": "success",
            "message": f"Search triggered for {country}",
            "targets_queued": len(bot.targets),
            "estimated_completion_time": (datetime.utcnow() + timedelta(minutes=5)).isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error triggering search: {str(e)}")

@router.get("/bot-status")
async def get_bot_status():
    """Get status of all search bots"""
    try:
        bot_stats = await bot_manager.get_bot_statistics()
        
        return {
            "bots": bot_stats,
            "queue_length": len(bot_manager.scrapingQueue),
            "is_scraping_active": bot_manager.isScrapingActive,
            "last_scraping_run": bot_manager.lastScrapingRun.isoformat() if bot_manager.lastScrapingRun else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving bot status: {str(e)}")

@router.post("/verify-opportunity/{opportunity_id}")
async def verify_opportunity(
    opportunity_id: str,
    db: AsyncSession = Depends(get_db_session)
):
    """Manually trigger verification for an opportunity"""
    try:
        # Convert string ID to UUID
        try:
            opp_id = uuid.UUID(opportunity_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid opportunity ID format")
        
        # Get opportunity
        result = await db.execute(
            select(DonorOpportunity).where(DonorOpportunity.id == opp_id)
        )
        
        opportunity = result.scalar_one_or_none()
        
        if not opportunity:
            raise HTTPException(status_code=404, detail="Opportunity not found")
        
        # Verify opportunity
        verification_result = await verification_service.verifier.verify_opportunity(opportunity)
        
        return {
            "status": "success",
            "opportunity_id": opportunity_id,
            "verification_result": verification_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying opportunity: {str(e)}")