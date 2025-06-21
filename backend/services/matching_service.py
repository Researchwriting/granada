import logging
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database.models import DonorOpportunity
from database.connection import get_db_session

logger = logging.getLogger(__name__)

class MatchingService:
    """Service for matching organizations with relevant funding opportunities"""
    
    def __init__(self):
        # Initialize any required resources
        pass
    
    async def find_matching_opportunities(
        self, 
        organization_profile: Dict[str, Any],
        filters: Dict[str, Any] = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Find donor opportunities that match the organization's profile"""
        try:
            # Get database session
            async with get_db_session() as session:
                # Build base query
                query = select(DonorOpportunity).where(
                    DonorOpportunity.is_active == True
                )
                
                # Apply filters if provided
                if filters:
                    query = self._apply_filters(query, filters)
                
                # Apply organization matching criteria
                query = self._apply_organization_matching(query, organization_profile)
                
                # Limit results
                query = query.limit(limit)
                
                # Execute query
                result = await session.execute(query)
                opportunities = result.scalars().all()
                
                # Calculate match scores and format results
                return await self._format_matches(opportunities, organization_profile)
                
        except Exception as e:
            logger.error(f"Error finding matching opportunities: {e}")
            # Return empty list on error
            return []
    
    def _apply_filters(self, query, filters: Dict[str, Any]):
        """Apply filters to the query"""
        if filters.get('country'):
            query = query.where(DonorOpportunity.country == filters['country'])
        
        if filters.get('sector'):
            query = query.where(DonorOpportunity.sector == filters['sector'])
        
        if filters.get('min_amount'):
            query = query.where(DonorOpportunity.amount_max >= filters['min_amount'])
        
        if filters.get('max_amount'):
            query = query.where(DonorOpportunity.amount_min <= filters['max_amount'])
        
        if filters.get('verified_only'):
            query = query.where(DonorOpportunity.is_verified == True)
        
        if filters.get('deadline_after'):
            query = query.where(DonorOpportunity.deadline >= filters['deadline_after'])
        
        return query
    
    def _apply_organization_matching(self, query, organization_profile: Dict[str, Any]):
        """Apply organization-specific matching criteria"""
        # Match by sector if available
        if organization_profile.get('sector'):
            # This is a simplified approach - in production, use vector similarity
            query = query.where(
                DonorOpportunity.sector.ilike(f"%{organization_profile['sector']}%")
            )
        
        # Match by country if available
        if organization_profile.get('country'):
            # Include both exact country matches and 'Global' opportunities
            query = query.where(
                or_(
                    DonorOpportunity.country == organization_profile['country'],
                    DonorOpportunity.country == 'Global'
                )
            )
        
        return query
    
    async def _format_matches(self, opportunities: List[DonorOpportunity], organization_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Format opportunities with match scores and details"""
        results = []
        
        for opp in opportunities:
            # Calculate match score
            match_score = self._calculate_match_score(opp, organization_profile)
            
            # Format opportunity data
            formatted_opp = {
                "id": str(opp.id),
                "title": opp.title,
                "description": opp.description,
                "donor": opp.source_name,
                "country": opp.country,
                "sector": opp.sector,
                "amount_min": opp.amount_min,
                "amount_max": opp.amount_max,
                "currency": opp.currency,
                "deadline": opp.deadline.isoformat() if opp.deadline else None,
                "source_url": opp.source_url,
                "is_verified": opp.is_verified,
                "verification_score": opp.verification_score,
                "match_score": match_score,
                "match_reasons": self._get_match_reasons(opp, organization_profile, match_score)
            }
            
            results.append(formatted_opp)
        
        # Sort by match score (highest first)
        results.sort(key=lambda x: x["match_score"], reverse=True)
        
        return results
    
    def _calculate_match_score(self, opportunity: DonorOpportunity, organization_profile: Dict[str, Any]) -> float:
        """Calculate match score between opportunity and organization"""
        score = 0.0
        weights = {
            "sector": 0.4,
            "country": 0.2,
            "focus_areas": 0.2,
            "amount": 0.1,
            "verification": 0.1
        }
        
        # Sector match
        if organization_profile.get('sector') and opportunity.sector:
            if organization_profile['sector'].lower() in opportunity.sector.lower():
                score += weights["sector"]
            elif opportunity.sector.lower() in organization_profile.get('sector').lower():
                score += weights["sector"] * 0.8
        
        # Country match
        if organization_profile.get('country') and opportunity.country:
            if organization_profile['country'] == opportunity.country or opportunity.country == 'Global':
                score += weights["country"]
        
        # Focus areas match
        if organization_profile.get('focus_areas') and opportunity.focus_areas:
            org_focus = set(f.lower() for f in organization_profile['focus_areas'])
            opp_focus = set(f.lower() for f in opportunity.focus_areas) if isinstance(opportunity.focus_areas, list) else set()
            
            if opp_focus:
                overlap = len(org_focus.intersection(opp_focus))
                focus_score = min(1.0, overlap / max(1, len(opp_focus)))
                score += weights["focus_areas"] * focus_score
        
        # Amount match
        if organization_profile.get('typical_budget') and opportunity.amount_max:
            org_budget = organization_profile['typical_budget']
            if opportunity.amount_min <= org_budget <= opportunity.amount_max:
                score += weights["amount"]
            elif opportunity.amount_max >= org_budget * 0.8:
                score += weights["amount"] * 0.5
        
        # Verification score
        if opportunity.is_verified:
            score += weights["verification"] * min(1.0, opportunity.verification_score)
        
        # Add some randomness for variety (±5%)
        import random
        score += random.uniform(-0.05, 0.05)
        
        # Ensure score is between 0 and 1
        return max(0.0, min(1.0, score)) * 100
    
    def _get_match_reasons(self, opportunity: DonorOpportunity, organization_profile: Dict[str, Any], match_score: float) -> List[str]:
        """Generate reasons for the match"""
        reasons = []
        
        # Sector match
        if organization_profile.get('sector') and opportunity.sector:
            if organization_profile['sector'].lower() in opportunity.sector.lower():
                reasons.append(f"Sector alignment: {opportunity.sector}")
        
        # Country match
        if organization_profile.get('country') and opportunity.country:
            if organization_profile['country'] == opportunity.country:
                reasons.append(f"Geographic focus: {opportunity.country}")
            elif opportunity.country == 'Global':
                reasons.append("Global opportunity: Available in your region")
        
        # Focus areas match
        if organization_profile.get('focus_areas') and opportunity.focus_areas:
            org_focus = set(f.lower() for f in organization_profile['focus_areas'])
            opp_focus = set(f.lower() for f in opportunity.focus_areas) if isinstance(opportunity.focus_areas, list) else set()
            
            if opp_focus and org_focus.intersection(opp_focus):
                matching_areas = org_focus.intersection(opp_focus)
                reasons.append(f"Focus area match: {', '.join(matching_areas)}")
        
        # Amount match
        if organization_profile.get('typical_budget') and opportunity.amount_max:
            org_budget = organization_profile['typical_budget']
            if opportunity.amount_min <= org_budget <= opportunity.amount_max:
                reasons.append(f"Budget range match: {opportunity.amount_min}-{opportunity.amount_max} {opportunity.currency}")
        
        # High match score
        if match_score > 85:
            reasons.append("High overall compatibility with your organization profile")
        
        # If no specific reasons, add a generic one
        if not reasons:
            reasons.append("Potential opportunity based on your organization profile")
        
        return reasons

# Create global instance
matching_service = MatchingService()