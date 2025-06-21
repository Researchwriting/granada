import asyncio
import logging
from celery import shared_task
from services.bot_manager import bot_manager
from database.models import DonorOpportunity, SearchStatistics
from database.connection import get_db_session
from sqlalchemy import delete, func, select
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

@shared_task
def cleanup_old_opportunities(days: int = 180):
    """Remove opportunities older than specified days"""
    logger.info(f"Starting cleanup of opportunities older than {days} days")
    
    # Run the async task in a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        async def perform_cleanup():
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            async with get_db_session() as session:
                # Delete old opportunities
                result = await session.execute(
                    delete(DonorOpportunity).where(
                        DonorOpportunity.scraped_at < cutoff_date
                    )
                )
                
                deleted_count = result.rowcount
                await session.commit()
                
                logger.info(f"Deleted {deleted_count} old opportunities")
                return deleted_count
        
        deleted_count = loop.run_until_complete(perform_cleanup())
        
        return {
            "status": "success",
            "message": f"Deleted {deleted_count} old opportunities",
            "deleted_count": deleted_count,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in cleanup task: {e}")
        return {
            "status": "error",
            "message": f"Error in cleanup task: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        loop.close()

@shared_task
def generate_search_statistics():
    """Generate statistics about search performance"""
    logger.info("Starting generation of search statistics")
    
    # Run the async task in a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        async def generate_stats():
            async with get_db_session() as session:
                # Get statistics by country and source
                result = await session.execute(
                    select(
                        DonorOpportunity.country,
                        DonorOpportunity.source_name,
                        func.count().label('total_count'),
                        func.sum(
                            func.cast(DonorOpportunity.is_verified, Integer)
                        ).label('verified_count')
                    )
                    .group_by(
                        DonorOpportunity.country,
                        DonorOpportunity.source_name
                    )
                )
                
                stats_entries = []
                for row in result:
                    country, source_name, total_count, verified_count = row
                    
                    # Calculate success rate
                    success_rate = (verified_count / total_count) if total_count > 0 else 0.0
                    
                    # Create statistics entry
                    stats_entry = SearchStatistics(
                        date=datetime.utcnow(),
                        country=country,
                        source_name=source_name,
                        opportunities_found=total_count,
                        opportunities_verified=verified_count,
                        success_rate=success_rate
                    )
                    
                    stats_entries.append(stats_entry)
                
                # Save statistics
                for entry in stats_entries:
                    session.add(entry)
                
                await session.commit()
                
                return len(stats_entries)
        
        stats_count = loop.run_until_complete(generate_stats())
        
        return {
            "status": "success",
            "message": f"Generated {stats_count} statistics entries",
            "stats_count": stats_count,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in statistics generation task: {e}")
        return {
            "status": "error",
            "message": f"Error in statistics generation task: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        loop.close()

@shared_task
def update_bot_statistics():
    """Update statistics for all bots"""
    logger.info("Starting update of bot statistics")
    
    # Run the async task in a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Update bot statistics
        loop.run_until_complete(bot_manager.get_bot_statistics())
        
        return {
            "status": "success",
            "message": "Bot statistics updated",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in bot statistics update task: {e}")
        return {
            "status": "error",
            "message": f"Error in bot statistics update task: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        loop.close()