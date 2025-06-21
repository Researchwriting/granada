import asyncio
import logging
from celery import shared_task
from services.verification_service import verification_service
from database.models import DonorOpportunity
from database.connection import get_db_session
from sqlalchemy import select
from datetime import datetime

logger = logging.getLogger(__name__)

@shared_task
def verify_opportunities(limit: int = 50):
    """Verify a batch of unverified opportunities"""
    logger.info(f"Starting verification task for up to {limit} opportunities")
    
    # Run the async task in a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Get unverified opportunities
        async def get_and_verify():
            async with get_db_session() as session:
                # Get unverified opportunities
                result = await session.execute(
                    select(DonorOpportunity)
                    .where(
                        DonorOpportunity.is_verified == False,
                        DonorOpportunity.verification_score == 0.0
                    )
                    .limit(limit)
                )
                
                opportunities = result.scalars().all()
                logger.info(f"Found {len(opportunities)} unverified opportunities")
                
                # Verify each opportunity
                verified_count = 0
                for opp in opportunities:
                    try:
                        await verification_service.verifier.verify_opportunity(opp)
                        verified_count += 1
                        # Add small delay to avoid overwhelming resources
                        await asyncio.sleep(1)
                    except Exception as e:
                        logger.error(f"Error verifying opportunity {opp.id}: {e}")
                
                return verified_count
        
        verified_count = loop.run_until_complete(get_and_verify())
        
        return {
            "status": "success",
            "message": f"Verified {verified_count} opportunities",
            "opportunities_processed": verified_count,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in verification task: {e}")
        return {
            "status": "error",
            "message": f"Error in verification task: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        loop.close()

@shared_task
def verify_specific_opportunity(opportunity_id: str):
    """Verify a specific opportunity by ID"""
    logger.info(f"Starting verification task for opportunity: {opportunity_id}")
    
    # Run the async task in a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Get and verify the opportunity
        async def get_and_verify_one():
            async with get_db_session() as session:
                # Get the opportunity
                result = await session.execute(
                    select(DonorOpportunity).where(DonorOpportunity.id == opportunity_id)
                )
                
                opportunity = result.scalar_one_or_none()
                
                if not opportunity:
                    logger.error(f"Opportunity not found: {opportunity_id}")
                    return None
                
                # Verify the opportunity
                verification_result = await verification_service.verifier.verify_opportunity(opportunity)
                return verification_result
        
        verification_result = loop.run_until_complete(get_and_verify_one())
        
        if verification_result:
            return {
                "status": "success",
                "message": f"Verified opportunity {opportunity_id}",
                "verification_result": verification_result,
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            return {
                "status": "error",
                "message": f"Opportunity not found: {opportunity_id}",
                "timestamp": datetime.utcnow().isoformat()
            }
    except Exception as e:
        logger.error(f"Error in specific verification task: {e}")
        return {
            "status": "error",
            "message": f"Error in specific verification task: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        loop.close()