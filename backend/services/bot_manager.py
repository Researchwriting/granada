import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import json
import hashlib
from urllib.parse import urljoin, urlparse
import re
from bs4 import BeautifulSoup
import feedparser
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import models and database connection
from database.models import DonorOpportunity, SearchBot, BotReward, SearchTarget, OpportunityVerification
from database.connection import get_db_session

class BotStatus(Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    ERROR = "error"
    MAINTENANCE = "maintenance"

@dataclass
class SearchTarget:
    name: str
    url: str
    country: str
    type: str  # api, scraping, rss
    selectors: Dict[str, str]
    rate_limit: int  # requests per minute
    priority: int  # 1-10
    api_key: Optional[str] = None
    headers: Optional[Dict[str, str]] = None

class FundingBot:
    def __init__(self, bot_id: str, country: str, targets: List[SearchTarget]):
        self.bot_id = bot_id
        self.country = country
        self.targets = targets
        self.status = BotStatus.ACTIVE
        self.session: Optional[aiohttp.ClientSession] = None
        self.opportunities_found = 0
        self.last_run = None
        self.errors = []
        
    async def start_session(self):
        """Initialize HTTP session with proper headers"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        timeout = aiohttp.ClientTimeout(total=30, connect=10)
        connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
        
        self.session = aiohttp.ClientSession(
            headers=headers,
            timeout=timeout,
            connector=connector
        )
    
    async def close_session(self):
        """Close HTTP session"""
        if self.session:
            await self.session.close()
    
    async def search_target(self, target: SearchTarget) -> List[Dict[str, Any]]:
        """Search a specific target for funding opportunities"""
        try:
            logger.info(f"Bot {self.bot_id} searching {target.name} in {target.country}")
            
            if target.type == "api":
                return await self._search_api(target)
            elif target.type == "scraping":
                return await self._scrape_website(target)
            elif target.type == "rss":
                return await self._parse_rss(target)
            else:
                logger.warning(f"Unknown target type: {target.type}")
                return []
                
        except Exception as e:
            error_msg = f"Error searching {target.name}: {str(e)}"
            logger.error(error_msg)
            self.errors.append(error_msg)
            return []
    
    async def _search_api(self, target: SearchTarget) -> List[Dict[str, Any]]:
        """Search via API endpoint"""
        opportunities = []
        
        try:
            headers = target.headers or {}
            if target.api_key:
                headers['Authorization'] = f'Bearer {target.api_key}'
            
            async with self.session.get(target.url, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    opportunities = self._parse_api_response(data, target)
                else:
                    logger.warning(f"API request failed: {response.status}")
                    
        except Exception as e:
            logger.error(f"API search error for {target.name}: {e}")
        
        return opportunities
    
    async def _scrape_website(self, target: SearchTarget) -> List[Dict[str, Any]]:
        """Scrape website for funding opportunities"""
        opportunities = []
        
        try:
            async with self.session.get(target.url) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    opportunities = self._extract_opportunities(soup, target)
                else:
                    logger.warning(f"Scraping failed: {response.status}")
                    
        except Exception as e:
            logger.error(f"Scraping error for {target.name}: {e}")
        
        return opportunities
    
    async def _parse_rss(self, target: SearchTarget) -> List[Dict[str, Any]]:
        """Parse RSS feed for opportunities"""
        opportunities = []
        
        try:
            async with self.session.get(target.url) as response:
                if response.status == 200:
                    rss_content = await response.text()
                    feed = feedparser.parse(rss_content)
                    opportunities = self._parse_rss_feed(feed, target)
                    
        except Exception as e:
            logger.error(f"RSS parsing error for {target.name}: {e}")
        
        return opportunities
    
    def _parse_api_response(self, data: Dict, target: SearchTarget) -> List[Dict[str, Any]]:
        """Parse API response to extract opportunities"""
        opportunities = []
        
        # Handle different API response formats
        if isinstance(data, dict):
            if 'opportunities' in data:
                items = data['opportunities']
            elif 'grants' in data:
                items = data['grants']
            elif 'results' in data:
                items = data['results']
            elif 'data' in data:
                items = data['data']
            else:
                items = [data]  # Single opportunity
        elif isinstance(data, list):
            items = data
        else:
            return opportunities
        
        for item in items:
            try:
                opportunity = self._extract_opportunity_data(item, target)
                if opportunity:
                    opportunities.append(opportunity)
            except Exception as e:
                logger.error(f"Error parsing opportunity: {e}")
        
        return opportunities
    
    def _extract_opportunities(self, soup: BeautifulSoup, target: SearchTarget) -> List[Dict[str, Any]]:
        """Extract opportunities from HTML using selectors"""
        opportunities = []
        
        # Find opportunity containers
        container_selectors = [
            '.opportunity', '.grant', '.funding', '.call',
            '[class*="opportunity"]', '[class*="grant"]',
            'article', '.post', '.item'
        ]
        
        containers = []
        for selector in container_selectors:
            found = soup.select(selector)
            if found:
                containers = found
                break
        
        if not containers:
            # Fallback: look for common patterns
            containers = soup.find_all(['div', 'article'], class_=re.compile(r'(opportunity|grant|funding|call)', re.I))
        
        for container in containers[:50]:  # Limit to 50 opportunities per page
            try:
                opportunity = self._extract_from_container(container, target)
                if opportunity:
                    opportunities.append(opportunity)
            except Exception as e:
                logger.error(f"Error extracting from container: {e}")
        
        return opportunities
    
    def _extract_from_container(self, container, target: SearchTarget) -> Optional[Dict[str, Any]]:
        """Extract opportunity data from HTML container"""
        try:
            # Extract title
            title_selectors = ['h1', 'h2', 'h3', '.title', '.name', 'a[href*="grant"]', 'a[href*="opportunity"]']
            title = self._extract_text(container, title_selectors)
            
            if not title or len(title) < 10:
                return None
            
            # Extract description
            desc_selectors = ['.description', '.summary', '.excerpt', 'p', '.content']
            description = self._extract_text(container, desc_selectors)
            
            # Extract deadline
            deadline_selectors = ['.deadline', '.due-date', '.closing-date', '[class*="deadline"]']
            deadline = self._extract_date(container, deadline_selectors)
            
            # Extract amount
            amount_selectors = ['.amount', '.funding', '.value', '[class*="amount"]']
            amount = self._extract_amount(container, amount_selectors)
            
            # Extract link
            link_elem = container.find('a', href=True)
            link = urljoin(target.url, link_elem['href']) if link_elem else target.url
            
            opportunity = {
                'title': title,
                'description': description or title,
                'deadline': deadline,
                'amount_min': amount.get('min') if amount else None,
                'amount_max': amount.get('max') if amount else None,
                'currency': amount.get('currency', 'USD') if amount else 'USD',
                'source_url': link,
                'source_name': target.name,
                'country': target.country,
                'scraped_at': datetime.utcnow(),
                'is_verified': False
            }
            
            return opportunity
            
        except Exception as e:
            logger.error(f"Error extracting opportunity data: {e}")
            return None
    
    def _extract_text(self, container, selectors: List[str]) -> Optional[str]:
        """Extract text using multiple selectors"""
        for selector in selectors:
            elem = container.select_one(selector)
            if elem:
                text = elem.get_text(strip=True)
                if text and len(text) > 5:
                    return text[:500]  # Limit length
        return None
    
    def _extract_date(self, container, selectors: List[str]) -> Optional[datetime]:
        """Extract and parse date"""
        for selector in selectors:
            elem = container.select_one(selector)
            if elem:
                date_text = elem.get_text(strip=True)
                parsed_date = self._parse_date(date_text)
                if parsed_date:
                    return parsed_date
        return None
    
    def _extract_amount(self, container, selectors: List[str]) -> Optional[Dict[str, Any]]:
        """Extract funding amount"""
        for selector in selectors:
            elem = container.select_one(selector)
            if elem:
                amount_text = elem.get_text(strip=True)
                return self._parse_amount(amount_text)
        return None
    
    def _parse_date(self, date_text: str) -> Optional[datetime]:
        """Parse various date formats"""
        if not date_text:
            return None
        
        # Common date patterns
        patterns = [
            r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})',  # MM/DD/YYYY or DD/MM/YYYY
            r'(\d{4})[/-](\d{1,2})[/-](\d{1,2})',  # YYYY/MM/DD
            r'(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})',  # DD Mon YYYY
            r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})',  # Mon DD, YYYY
        ]
        
        for pattern in patterns:
            match = re.search(pattern, date_text, re.IGNORECASE)
            if match:
                try:
                    # Parse based on pattern
                    if 'Jan' in pattern:
                        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        month = month_names.index(match.group(1)[:3]) + 1 if match.group(1) else month_names.index(match.group(2)[:3]) + 1
                        day = int(match.group(2)) if match.group(1) in month_names else int(match.group(1))
                        year = int(match.group(3))
                    else:
                        parts = [int(g) for g in match.groups()]
                        if len(parts) == 3:
                            if parts[0] > 1900:  # YYYY/MM/DD
                                year, month, day = parts
                            else:  # MM/DD/YYYY or DD/MM/YYYY
                                month, day, year = parts
                    
                    return datetime(year, month, day)
                except (ValueError, IndexError):
                    continue
        
        return None
    
    def _parse_amount(self, amount_text: str) -> Optional[Dict[str, Any]]:
        """Parse funding amount from text"""
        if not amount_text:
            return None
        
        # Remove common prefixes/suffixes
        clean_text = re.sub(r'[^\d\.,\-\s$€£¥₹]', ' ', amount_text)
        
        # Find currency
        currency = 'USD'
        if '€' in amount_text:
            currency = 'EUR'
        elif '£' in amount_text:
            currency = 'GBP'
        elif '¥' in amount_text:
            currency = 'JPY'
        elif '₹' in amount_text:
            currency = 'INR'
        
        # Extract numbers
        numbers = re.findall(r'[\d,]+(?:\.\d+)?', clean_text)
        if not numbers:
            return None
        
        amounts = []
        for num_str in numbers:
            try:
                # Remove commas and convert
                amount = float(num_str.replace(',', ''))
                
                # Handle K, M, B suffixes
                if 'k' in amount_text.lower():
                    amount *= 1000
                elif 'm' in amount_text.lower():
                    amount *= 1000000
                elif 'b' in amount_text.lower():
                    amount *= 1000000000
                
                amounts.append(int(amount))
            except ValueError:
                continue
        
        if not amounts:
            return None
        
        if len(amounts) == 1:
            return {'min': amounts[0], 'max': amounts[0], 'currency': currency}
        else:
            return {'min': min(amounts), 'max': max(amounts), 'currency': currency}
    
    def _parse_rss_feed(self, feed, target: SearchTarget) -> List[Dict[str, Any]]:
        """Parse RSS feed entries"""
        opportunities = []
        
        for entry in feed.entries[:20]:  # Limit to 20 entries
            try:
                # Extract data from RSS entry
                title = entry.get('title', '')
                description = entry.get('description', '') or entry.get('summary', '')
                link = entry.get('link', target.url)
                
                # Parse publication date
                pub_date = None
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    pub_date = datetime(*entry.published_parsed[:6])
                
                if title and len(title) > 10:
                    opportunity = {
                        'title': title,
                        'description': description,
                        'deadline': pub_date + timedelta(days=90) if pub_date else None,  # Estimate deadline
                        'source_url': link,
                        'source_name': target.name,
                        'country': target.country,
                        'scraped_at': datetime.utcnow(),
                        'is_verified': False
                    }
                    opportunities.append(opportunity)
                    
            except Exception as e:
                logger.error(f"Error parsing RSS entry: {e}")
        
        return opportunities
    
    def _extract_opportunity_data(self, item: Dict, target: SearchTarget) -> Optional[Dict[str, Any]]:
        """Extract opportunity data from API response item"""
        try:
            # Common field mappings
            title_fields = ['title', 'name', 'opportunityTitle', 'grantTitle', 'callTitle']
            desc_fields = ['description', 'summary', 'abstract', 'overview']
            deadline_fields = ['deadline', 'closingDate', 'applicationDeadline', 'dueDate']
            amount_fields = ['amount', 'funding', 'value', 'totalFunding', 'maxAward']
            
            title = self._get_field_value(item, title_fields)
            description = self._get_field_value(item, desc_fields)
            deadline_str = self._get_field_value(item, deadline_fields)
            amount_str = self._get_field_value(item, amount_fields)
            
            if not title or len(title) < 10:
                return None
            
            # Parse deadline
            deadline = self._parse_date(str(deadline_str)) if deadline_str else None
            
            # Parse amount
            amount = self._parse_amount(str(amount_str)) if amount_str else None
            
            opportunity = {
                'title': title,
                'description': description or title,
                'deadline': deadline,
                'amount_min': amount.get('min') if amount else None,
                'amount_max': amount.get('max') if amount else None,
                'currency': amount.get('currency', 'USD') if amount else 'USD',
                'source_url': item.get('url', target.url),
                'source_name': target.name,
                'country': target.country,
                'scraped_at': datetime.utcnow(),
                'is_verified': False
            }
            
            return opportunity
            
        except Exception as e:
            logger.error(f"Error extracting API opportunity: {e}")
            return None
    
    def _get_field_value(self, item: Dict, field_names: List[str]) -> Optional[str]:
        """Get value from item using multiple possible field names"""
        for field in field_names:
            if field in item and item[field]:
                return str(item[field])[:500]  # Limit length
        return None

class BotManager:
    def __init__(self):
        self.bots: Dict[str, FundingBot] = {}
        self.running = False
        self.scrapingQueue = []
        self.isScrapingActive = False
        self.lastScrapingRun = datetime.utcnow()
        
    async def initialize_bots(self):
        """Initialize bots for different countries"""
        
        # South Sudan Bot
        south_sudan_targets = [
            SearchTarget(
                name="UNDP South Sudan",
                url="https://www.undp.org/south-sudan/funding-opportunities",
                country="South Sudan",
                type="scraping",
                selectors={},
                rate_limit=30,
                priority=10
            ),
            SearchTarget(
                name="World Bank South Sudan",
                url="https://projects.worldbank.org/en/projects-operations/projects-list?countrycode_exact=SS",
                country="South Sudan",
                type="scraping",
                selectors={},
                rate_limit=20,
                priority=9
            ),
            SearchTarget(
                name="USAID South Sudan",
                url="https://www.usaid.gov/south-sudan/partnership-opportunities",
                country="South Sudan",
                type="scraping",
                selectors={},
                rate_limit=25,
                priority=9
            ),
            SearchTarget(
                name="African Development Bank",
                url="https://www.afdb.org/en/projects-and-operations/procurement/opportunities",
                country="South Sudan",
                type="scraping",
                selectors={},
                rate_limit=20,
                priority=8
            ),
            SearchTarget(
                name="UN Women South Sudan",
                url="https://africa.unwomen.org/en/where-we-are/east-and-southern-africa/south-sudan",
                country="South Sudan",
                type="scraping",
                selectors={},
                rate_limit=15,
                priority=7
            )
        ]
        
        # Create South Sudan bot
        ss_bot = FundingBot("south_sudan_bot", "South Sudan", south_sudan_targets)
        await ss_bot.start_session()
        self.bots["south_sudan"] = ss_bot
        
        logger.info("Initialized South Sudan funding bot")
    
    async def start_continuous_search(self):
        """Start continuous searching across all bots"""
        self.running = True
        logger.info("Starting continuous funding search...")
        
        while self.running:
            try:
                # Run all bots in parallel
                tasks = []
                for bot_id, bot in self.bots.items():
                    if bot.status == BotStatus.ACTIVE:
                        tasks.append(self._run_bot_cycle(bot))
                
                if tasks:
                    await asyncio.gather(*tasks, return_exceptions=True)
                
                # Wait before next cycle (5 minutes)
                await asyncio.sleep(300)
                
            except Exception as e:
                logger.error(f"Error in continuous search: {e}")
                await asyncio.sleep(60)  # Wait 1 minute on error
    
    async def _run_bot_cycle(self, bot: FundingBot):
        """Run a single search cycle for a bot"""
        try:
            logger.info(f"Running search cycle for bot {bot.bot_id}")
            bot.last_run = datetime.utcnow()
            
            all_opportunities = []
            
            # Search each target
            for target in bot.targets:
                try:
                    opportunities = await bot.search_target(target)
                    all_opportunities.extend(opportunities)
                    
                    # Rate limiting
                    await asyncio.sleep(60 / target.rate_limit)
                    
                except Exception as e:
                    logger.error(f"Error searching target {target.name}: {e}")
            
            # Save opportunities to database
            if all_opportunities:
                saved_count = await self._save_opportunities(all_opportunities)
                bot.opportunities_found += saved_count
                
                # Award bot for successful finds
                if saved_count > 0:
                    await self._award_bot(bot, saved_count)
                
                logger.info(f"Bot {bot.bot_id} found {saved_count} new opportunities")
            
        except Exception as e:
            logger.error(f"Error in bot cycle for {bot.bot_id}: {e}")
            bot.status = BotStatus.ERROR
    
    async def _save_opportunities(self, opportunities: List[Dict[str, Any]]) -> int:
        """Save opportunities to database, avoiding duplicates"""
        saved_count = 0
        
        async with get_db_session() as session:
            for opp_data in opportunities:
                try:
                    # Create hash for duplicate detection
                    content_hash = hashlib.md5(
                        f"{opp_data['title']}{opp_data['source_name']}".encode()
                    ).hexdigest()
                    
                    # Check if already exists
                    existing = await session.execute(
                        select(DonorOpportunity).where(
                            DonorOpportunity.content_hash == content_hash
                        )
                    )
                    
                    if existing.scalar_one_or_none():
                        continue  # Skip duplicate
                    
                    # Create new opportunity
                    opportunity = DonorOpportunity(
                        title=opp_data['title'],
                        description=opp_data['description'],
                        deadline=opp_data.get('deadline'),
                        amount_min=opp_data.get('amount_min'),
                        amount_max=opp_data.get('amount_max'),
                        currency=opp_data.get('currency', 'USD'),
                        source_url=opp_data['source_url'],
                        source_name=opp_data['source_name'],
                        country=opp_data['country'],
                        content_hash=content_hash,
                        scraped_at=opp_data['scraped_at'],
                        is_verified=opp_data['is_verified']
                    )
                    
                    session.add(opportunity)
                    saved_count += 1
                    
                except Exception as e:
                    logger.error(f"Error saving opportunity: {e}")
            
            await session.commit()
        
        return saved_count
    
    async def _award_bot(self, bot: FundingBot, opportunities_found: int):
        """Award bot for successful searches"""
        try:
            # Calculate reward based on opportunities found
            base_reward = 10
            bonus = opportunities_found * 5
            total_reward = base_reward + bonus
            
            async with get_db_session() as session:
                reward = BotReward(
                    bot_id=bot.bot_id,
                    country=bot.country,
                    opportunities_found=opportunities_found,
                    reward_points=total_reward,
                    awarded_at=datetime.utcnow()
                )
                
                session.add(reward)
                await session.commit()
            
            logger.info(f"Awarded {total_reward} points to bot {bot.bot_id}")
            
        except Exception as e:
            logger.error(f"Error awarding bot: {e}")
    
    async def cleanup_old_opportunities(self):
        """Remove old opportunities from database"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=180)  # 6 months old
            
            async with get_db_session() as session:
                # Delete old opportunities
                result = await session.execute(
                    delete(DonorOpportunity).where(
                        DonorOpportunity.scraped_at < cutoff_date
                    )
                )
                
                deleted_count = result.rowcount
                await session.commit()
                
                logger.info(f"Cleaned up {deleted_count} old opportunities")
                
        except Exception as e:
            logger.error(f"Error cleaning up old opportunities: {e}")
    
    async def get_bot_statistics(self) -> Dict[str, Any]:
        """Get statistics for all bots"""
        stats = {}
        
        for bot_id, bot in self.bots.items():
            stats[bot_id] = {
                'status': bot.status.value,
                'country': bot.country,
                'opportunities_found': bot.opportunities_found,
                'last_run': bot.last_run.isoformat() if bot.last_run else None,
                'errors': len(bot.errors),
                'targets_count': len(bot.targets)
            }
        
        return stats
    
    async def stop(self):
        """Stop all bots"""
        self.running = False
        
        for bot in self.bots.values():
            await bot.close_session()
        
        logger.info("All bots stopped")

# Global bot manager instance
bot_manager = BotManager()

async def start_bot_system():
    """Start the bot system"""
    await bot_manager.initialize_bots()
    await bot_manager.start_continuous_search()

async def stop_bot_system():
    """Stop the bot system"""
    await bot_manager.stop()

if __name__ == "__main__":
    asyncio.run(start_bot_system())