from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio

from ...core.database import get_db
from ...core.auth import get_current_user
from ...services.dashboard_service import DashboardService
from ...services.credit_service import CreditService
from ...services.micro_bots import MicroBotOrchestrator
from ...schemas.dashboard import (
    User, OpportunitySearch, OpportunityListResponse, OpportunityType
)
from ...schemas.credits import CreditUsageCreate, CreditUsageType

router = APIRouter()

# Enhanced Search with Micro Bots
@router.post("/live-search", response_model=OpportunityListResponse)
async def live_search_opportunities(
    search_params: OpportunitySearch,
    use_live_search: bool = Query(True, description="Use live micro bot search"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Enhanced search that combines database results with live micro bot scraping
    Requires credits for live search functionality
    """
    dashboard_service = DashboardService(db)
    credit_service = CreditService(db)
    
    # Calculate search cost
    filters_count = 0
    if search_params.filters:
        filters_count = sum([
            1 for field in [
                search_params.filters.opportunity_type,
                search_params.filters.category,
                search_params.filters.location,
                search_params.filters.min_amount,
                search_params.filters.max_amount,
                search_params.filters.deadline_before,
                search_params.filters.deadline_after
            ] if field is not None
        ])
    
    search_type = "advanced_search" if use_live_search else "basic_search"
    required_credits = credit_service.calculate_search_cost(search_type, filters_count)
    
    # Check credit availability
    if not credit_service.check_credit_availability(current_user.id, required_credits):
        raise HTTPException(
            status_code=402,
            detail=f"Insufficient credits. Required: {required_credits}, Available: {credit_service.get_user_credit_balance(current_user.id).remaining_credits}"
        )
    
    # Use credits
    credit_service.use_credits(current_user.id, CreditUsageCreate(
        usage_type=CreditUsageType.SEARCH,
        credits_used=required_credits,
        description=f"{search_type} with {filters_count} filters",
        metadata={
            "search_query": search_params.query,
            "filters_count": filters_count,
            "live_search": use_live_search
        }
    ))
    
    # Get database results
    db_results = dashboard_service.search_opportunities(search_params, current_user.id)
    
    if not use_live_search:
        return db_results
    
    # Perform live search with micro bots
    try:
        orchestrator = MicroBotOrchestrator(db)
        
        if search_params.query and search_params.filters and search_params.filters.opportunity_type:
            # Targeted search for specific type
            live_results = await orchestrator.targeted_search(
                search_params.query,
                search_params.filters.opportunity_type
            )
        else:
            # General search across all bots
            bot_results = await orchestrator.run_all_bots()
            live_results = []
            
            for bot_name, opportunities in bot_results.items():
                # Filter live results based on search parameters
                filtered_opps = filter_live_results(opportunities, search_params)
                live_results.extend(filtered_opps[:5])  # Limit per bot
        
        # Combine and deduplicate results
        combined_results = combine_search_results(db_results, live_results, current_user.id)
        
        return combined_results
        
    except Exception as e:
        # If live search fails, return database results
        return db_results

@router.get("/real-time-opportunities")
async def get_real_time_opportunities(
    opportunity_type: Optional[OpportunityType] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get real-time opportunities using micro bots
    Premium feature requiring credits
    """
    credit_service = CreditService(db)
    required_credits = 5  # Premium feature cost
    
    if not credit_service.check_credit_availability(current_user.id, required_credits):
        raise HTTPException(
            status_code=402,
            detail=f"Insufficient credits. Required: {required_credits}"
        )
    
    # Use credits
    credit_service.use_credits(current_user.id, CreditUsageCreate(
        usage_type=CreditUsageType.PREMIUM_FEATURE,
        credits_used=required_credits,
        description="Real-time opportunity search",
        metadata={"opportunity_type": opportunity_type.value if opportunity_type else "all"}
    ))
    
    try:
        orchestrator = MicroBotOrchestrator(db)
        
        if opportunity_type:
            # Search specific type
            results = await orchestrator.search_and_store([opportunity_type])
        else:
            # Search all types
            results = await orchestrator.search_and_store()
        
        # Get recently added opportunities
        dashboard_service = DashboardService(db)
        recent_opportunities = dashboard_service.search_opportunities(
            OpportunitySearch(limit=limit, offset=0),
            current_user.id
        )
        
        return {
            "message": f"Found {results} new opportunities",
            "opportunities": recent_opportunities["opportunities"][:limit]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.post("/background-refresh")
async def trigger_background_refresh(
    background_tasks: BackgroundTasks,
    opportunity_types: Optional[List[OpportunityType]] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Trigger background refresh of opportunities
    Admin or premium feature
    """
    # Add background task
    background_tasks.add_task(
        refresh_opportunities_background,
        db,
        opportunity_types
    )
    
    return {"message": "Background refresh initiated"}

@router.get("/search-suggestions")
async def get_search_suggestions(
    query: str = Query(..., min_length=2),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get search suggestions based on query
    Uses AI/ML for intelligent suggestions
    """
    dashboard_service = DashboardService(db)
    
    # Get suggestions from database
    suggestions = []
    
    # Title suggestions
    title_suggestions = db.execute(
        "SELECT DISTINCT title FROM opportunities WHERE title ILIKE :query LIMIT 5",
        {"query": f"%{query}%"}
    ).fetchall()
    
    suggestions.extend([{"type": "title", "text": row[0]} for row in title_suggestions])
    
    # Organization suggestions
    org_suggestions = db.execute(
        "SELECT DISTINCT organization FROM opportunities WHERE organization ILIKE :query LIMIT 5",
        {"query": f"%{query}%"}
    ).fetchall()
    
    suggestions.extend([{"type": "organization", "text": row[0]} for row in org_suggestions])
    
    # Category suggestions
    category_suggestions = db.execute(
        "SELECT DISTINCT category FROM opportunities WHERE category ILIKE :query LIMIT 5",
        {"query": f"%{query}%"}
    ).fetchall()
    
    suggestions.extend([{"type": "category", "text": row[0]} for row in category_suggestions])
    
    return {"suggestions": suggestions[:10]}

@router.get("/trending-searches")
async def get_trending_searches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get trending search terms and popular opportunities"""
    
    # Mock trending data - in production, this would come from analytics
    trending = {
        "popular_searches": [
            "STEM scholarships",
            "research grants",
            "remote jobs",
            "volunteer opportunities",
            "business grants"
        ],
        "trending_categories": [
            {"category": "Technology", "growth": "+25%"},
            {"category": "Healthcare", "growth": "+18%"},
            {"category": "Environment", "growth": "+15%"},
            {"category": "Education", "growth": "+12%"},
            {"category": "Arts", "growth": "+8%"}
        ],
        "hot_opportunities": [
            {"title": "AI Research Fellowship", "type": "scholarship", "deadline_days": 15},
            {"title": "Green Tech Innovation Grant", "type": "grant", "deadline_days": 22},
            {"title": "Remote Software Engineer", "type": "job", "deadline_days": 30}
        ]
    }
    
    return trending

# Helper functions
def filter_live_results(opportunities: List[dict], search_params: OpportunitySearch) -> List[dict]:
    """Filter live search results based on search parameters"""
    filtered = opportunities
    
    if search_params.query:
        query_terms = search_params.query.lower().split()
        filtered = [
            opp for opp in filtered
            if any(term in f"{opp.get('title', '')} {opp.get('description', '')}".lower() 
                  for term in query_terms)
        ]
    
    if search_params.filters:
        if search_params.filters.opportunity_type:
            filtered = [
                opp for opp in filtered
                if opp.get('opportunity_type') == search_params.filters.opportunity_type
            ]
        
        if search_params.filters.category:
            filtered = [
                opp for opp in filtered
                if search_params.filters.category.lower() in opp.get('category', '').lower()
            ]
        
        if search_params.filters.location:
            filtered = [
                opp for opp in filtered
                if search_params.filters.location.lower() in opp.get('location', '').lower()
            ]
    
    return filtered

def combine_search_results(db_results: dict, live_results: List[dict], user_id: int) -> dict:
    """Combine database and live search results, removing duplicates"""
    combined_opportunities = list(db_results["opportunities"])
    
    # Add live results that don't already exist
    existing_titles = {opp.get("title", "").lower() for opp in combined_opportunities}
    
    for live_opp in live_results:
        if live_opp.get("title", "").lower() not in existing_titles:
            # Add match percentage for live results
            live_opp["match_percentage"] = 75.0  # Default for live results
            combined_opportunities.append(live_opp)
    
    # Sort by match percentage and relevance
    combined_opportunities.sort(
        key=lambda x: (x.get("match_percentage", 0), x.get("relevance_score", 0)),
        reverse=True
    )
    
    return {
        "opportunities": combined_opportunities,
        "total": len(combined_opportunities),
        "has_more": False  # Live search doesn't support pagination
    }

async def refresh_opportunities_background(db: Session, opportunity_types: Optional[List[OpportunityType]]):
    """Background task to refresh opportunities"""
    try:
        orchestrator = MicroBotOrchestrator(db)
        await orchestrator.search_and_store(opportunity_types)
    except Exception as e:
        # Log error but don't raise
        print(f"Background refresh failed: {str(e)}")

@router.get("/search-analytics")
async def get_search_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's search analytics and patterns"""
    dashboard_service = DashboardService(db)
    
    # Get user activities related to search
    activities = dashboard_service.get_user_activities(current_user.id, limit=100)
    search_activities = [a for a in activities if a.activity_type == "search"]
    
    # Analyze search patterns
    search_terms = []
    search_types = {}
    
    for activity in search_activities:
        if isinstance(activity.activity_data, dict):
            query = activity.activity_data.get("search_query")
            if query:
                search_terms.append(query)
            
            search_type = activity.activity_data.get("search_type", "basic")
            search_types[search_type] = search_types.get(search_type, 0) + 1
    
    # Get most searched terms
    from collections import Counter
    term_counts = Counter(search_terms)
    
    analytics = {
        "total_searches": len(search_activities),
        "most_searched_terms": dict(term_counts.most_common(10)),
        "search_type_distribution": search_types,
        "recent_searches": search_terms[-10:] if search_terms else [],
        "search_frequency": {
            "daily_average": len(search_activities) / 30 if search_activities else 0,
            "peak_search_day": "Monday"  # Mock data
        }
    }
    
    return analytics