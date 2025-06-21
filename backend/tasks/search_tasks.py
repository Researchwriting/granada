import asyncio
import logging
from celery import shared_task
from services.bot_manager import bot_manager
from datetime import datetime

logger = logging.getLogger(__name__)

@shared_task
def run_daily_search():
    """Run daily search across all bots"""
    logger.info("Starting daily search task")
    
    # Run the async task in a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Run all bots
        for bot_id, bot in bot_manager.bots.items():
            logger.info(f"Triggering search for bot: {bot_id}")
            
            # Add all targets to the queue
            for target in bot.targets:
                bot_manager.scrapingQueue.append({"target": target})
        
        logger.info(f"Daily search scheduled with {len(bot_manager.scrapingQueue)} targets")
        
        # Update last run time
        bot_manager.lastScrapingRun = datetime.utcnow()
        
        return {
            "status": "success",
            "message": "Daily search scheduled",
            "targets_queued": len(bot_manager.scrapingQueue),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in daily search task: {e}")
        return {
            "status": "error",
            "message": f"Error in daily search task: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        loop.close()

@shared_task
def search_specific_country(country: str, query: str = None):
    """Run search for a specific country"""
    logger.info(f"Starting search task for country: {country}")
    
    # Run the async task in a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Find bot for country
        country_key = country.lower().replace(' ', '_')
        bot = bot_manager.bots.get(country_key)
        
        if not bot:
            logger.error(f"No bot found for country: {country}")
            return {
                "status": "error",
                "message": f"No bot found for country: {country}",
                "timestamp": datetime.utcnow().isoformat()
            }
        
        # Add targets to queue
        targets_queued = 0
        for target in bot.targets:
            if query:
                bot_manager.scrapingQueue.append({"target": target, "query": query})
            else:
                bot_manager.scrapingQueue.append({"target": target})
            targets_queued += 1
        
        logger.info(f"Search for {country} scheduled with {targets_queued} targets")
        
        return {
            "status": "success",
            "message": f"Search for {country} scheduled",
            "targets_queued": targets_queued,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in country search task: {e}")
        return {
            "status": "error",
            "message": f"Error in country search task: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        loop.close()

@shared_task
def search_specific_url(url: str, country: str, source_name: str):
    """Run search for a specific URL"""
    logger.info(f"Starting search task for URL: {url}")
    
    # Run the async task in a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Create a temporary target
        from services.bot_manager import SearchTarget
        target = SearchTarget(
            name=source_name,
            url=url,
            country=country,
            type="scraping",
            selectors={},
            rate_limit=30,
            priority=5
        )
        
        # Add to queue
        bot_manager.scrapingQueue.append({"target": target})
        
        logger.info(f"Search for URL {url} scheduled")
        
        return {
            "status": "success",
            "message": f"Search for URL {url} scheduled",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in URL search task: {e}")
        return {
            "status": "error",
            "message": f"Error in URL search task: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        loop.close()