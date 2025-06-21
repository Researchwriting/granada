import asyncio
import aiohttp
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import hashlib
import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import feedparser
import json
import uuid

# Try to import browser automation libraries
try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

logger = logging.getLogger(__name__)

class ScrapingService:
    def __init__(self):
        self.session = None
        self.browser = None
        self.page = None
        self.initialized = False
    
    async def initialize(self):
        """Initialize HTTP session and browser automation"""
        if self.initialized:
            return
        
        # Initialize HTTP session
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
        
        # Initialize browser automation if available
        if PLAYWRIGHT_AVAILABLE:
            try:
                self.playwright = await async_playwright().start()
                self.browser = await self.playwright.chromium.launch(headless=True)
                self.page = await self.browser.new_page()
                logger.info("Initialized Playwright for browser automation")
            except Exception as e:
                logger.error(f"Failed to initialize Playwright: {e}")
        
        self.initialized = True
        logger.info("Scraping service initialized")
    
    async def close(self):
        """Close all resources"""
        if self.session:
            await self.session.close()
        
        if self.browser:
            await self.browser.close()
            
        if hasattr(self, 'playwright') and self.playwright:
            await self.playwright.stop()
        
        self.initialized = False
        logger.info("Scraping service closed")
    
    async def scrape_url(self, url: str, scraping_type: str = "html", selectors: Dict[str, str] = None) -> Dict[str, Any]:
        """Scrape a URL using the specified method"""
        if not self.initialized:
            await self.initialize()
        
        try:
            if scraping_type == "html":
                return await self._scrape_html(url, selectors)
            elif scraping_type == "api":
                return await self._scrape_api(url)
            elif scraping_type == "rss":
                return await self._scrape_rss(url)
            elif scraping_type == "browser":
                return await self._scrape_browser(url, selectors)
            else:
                raise ValueError(f"Unsupported scraping type: {scraping_type}")
        except Exception as e:
            logger.error(f"Error scraping URL {url}: {e}")
            return {
                "success": False,
                "url": url,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def _scrape_html(self, url: str, selectors: Dict[str, str] = None) -> Dict[str, Any]:
        """Scrape HTML content using aiohttp and BeautifulSoup"""
        async with self.session.get(url) as response:
            if response.status != 200:
                return {
                    "success": False,
                    "url": url,
                    "status_code": response.status,
                    "error": f"HTTP error: {response.status}",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            html = await response.text()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Take screenshot if browser is available
            screenshot = None
            if self.page:
                try:
                    await self.page.goto(url)
                    screenshot = await self.page.screenshot(type='jpeg', quality=50)
                except Exception as e:
                    logger.error(f"Error taking screenshot: {e}")
            
            # Extract opportunities
            opportunities = self._extract_opportunities_from_html(soup, url, selectors)
            
            return {
                "success": True,
                "url": url,
                "content_type": "html",
                "opportunities": opportunities,
                "opportunity_count": len(opportunities),
                "screenshot": screenshot.decode('utf-8') if screenshot else None,
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def _scrape_api(self, url: str) -> Dict[str, Any]:
        """Scrape API endpoint"""
        async with self.session.get(url) as response:
            if response.status != 200:
                return {
                    "success": False,
                    "url": url,
                    "status_code": response.status,
                    "error": f"HTTP error: {response.status}",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            try:
                data = await response.json()
                
                # Extract opportunities from API response
                opportunities = self._extract_opportunities_from_api(data, url)
                
                return {
                    "success": True,
                    "url": url,
                    "content_type": "api",
                    "opportunities": opportunities,
                    "opportunity_count": len(opportunities),
                    "timestamp": datetime.utcnow().isoformat()
                }
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "url": url,
                    "error": "Invalid JSON response",
                    "timestamp": datetime.utcnow().isoformat()
                }
    
    async def _scrape_rss(self, url: str) -> Dict[str, Any]:
        """Scrape RSS feed"""
        async with self.session.get(url) as response:
            if response.status != 200:
                return {
                    "success": False,
                    "url": url,
                    "status_code": response.status,
                    "error": f"HTTP error: {response.status}",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            content = await response.text()
            feed = feedparser.parse(content)
            
            # Extract opportunities from RSS feed
            opportunities = self._extract_opportunities_from_rss(feed, url)
            
            return {
                "success": True,
                "url": url,
                "content_type": "rss",
                "opportunities": opportunities,
                "opportunity_count": len(opportunities),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def _scrape_browser(self, url: str, selectors: Dict[str, str] = None) -> Dict[str, Any]:
        """Scrape using browser automation for JavaScript-heavy sites"""
        if not self.page:
            return {
                "success": False,
                "url": url,
                "error": "Browser automation not available",
                "timestamp": datetime.utcnow().isoformat()
            }
        
        try:
            await self.page.goto(url, wait_until='networkidle')
            
            # Take screenshot
            screenshot = await self.page.screenshot(type='jpeg', quality=50)
            
            # Get HTML content
            html = await self.page.content()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract opportunities
            opportunities = self._extract_opportunities_from_html(soup, url, selectors)
            
            return {
                "success": True,
                "url": url,
                "content_type": "browser",
                "opportunities": opportunities,
                "opportunity_count": len(opportunities),
                "screenshot": screenshot.decode('utf-8') if screenshot else None,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error in browser scraping: {e}")
            return {
                "success": False,
                "url": url,
                "error": f"Browser scraping error: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _extract_opportunities_from_html(self, soup: BeautifulSoup, url: str, selectors: Dict[str, str] = None) -> List[Dict[str, Any]]:
        """Extract opportunities from HTML content"""
        opportunities = []
        
        # Use provided selectors if available
        if selectors:
            container_selector = selectors.get('container', '')
            title_selector = selectors.get('title', '')
            description_selector = selectors.get('description', '')
            deadline_selector = selectors.get('deadline', '')
            amount_selector = selectors.get('amount', '')
            link_selector = selectors.get('link', '')
            
            containers = soup.select(container_selector) if container_selector else []
            
            for container in containers:
                try:
                    title_elem = container.select_one(title_selector) if title_selector else None
                    description_elem = container.select_one(description_selector) if description_selector else None
                    deadline_elem = container.select_one(deadline_selector) if deadline_selector else None
                    amount_elem = container.select_one(amount_selector) if amount_selector else None
                    link_elem = container.select_one(link_selector) if link_selector else None
                    
                    title = title_elem.get_text(strip=True) if title_elem else None
                    description = description_elem.get_text(strip=True) if description_elem else None
                    deadline_text = deadline_elem.get_text(strip=True) if deadline_elem else None
                    amount_text = amount_elem.get_text(strip=True) if amount_elem else None
                    link = link_elem.get('href') if link_elem and link_elem.get('href') else None
                    
                    if title:
                        opportunity = {
                            "title": title,
                            "description": description or "",
                            "deadline": self._parse_date(deadline_text) if deadline_text else None,
                            "amount": self._parse_amount(amount_text) if amount_text else None,
                            "url": urljoin(url, link) if link else url,
                            "source_url": url,
                            "content_hash": hashlib.md5(f"{title}-{url}".encode()).hexdigest()
                        }
                        opportunities.append(opportunity)
                except Exception as e:
                    logger.error(f"Error extracting opportunity from container: {e}")
        else:
            # Use generic extraction if no selectors provided
            # Find opportunity containers
            container_selectors = [
                '.opportunity', '.grant', '.funding', '.call',
                '[class*="opportunity"]', '[class*="grant"]',
                'article', '.post', '.item', '.card',
                '.listing', '.result', '.program'
            ]
            
            containers = []
            for selector in container_selectors:
                found = soup.select(selector)
                if found:
                    containers = found
                    break
            
            # If no containers found, try to extract from headings
            if not containers:
                for heading in soup.find_all(['h1', 'h2', 'h3', 'h4']):
                    text = heading.get_text(strip=True).lower()
                    if any(keyword in text for keyword in ['grant', 'fund', 'opportunity', 'call']):
                        containers.append(heading.parent)
            
            # Process each container
            for container in containers[:50]:  # Limit to 50 opportunities
                try:
                    # Extract title
                    title_elem = container.find(['h1', 'h2', 'h3', 'h4', '.title', '.name']) or container
                    title = title_elem.get_text(strip=True)
                    
                    # Extract description
                    description_elem = container.find(['p', '.description', '.summary', '.content'])
                    description = description_elem.get_text(strip=True) if description_elem else ""
                    
                    # Extract link
                    link_elem = container.find('a', href=True)
                    link = urljoin(url, link_elem['href']) if link_elem else url
                    
                    # Create opportunity
                    if title and len(title) > 5:
                        opportunity = {
                            "title": title,
                            "description": description,
                            "url": link,
                            "source_url": url,
                            "content_hash": hashlib.md5(f"{title}-{url}".encode()).hexdigest()
                        }
                        opportunities.append(opportunity)
                except Exception as e:
                    logger.error(f"Error extracting opportunity: {e}")
        
        return opportunities
    
    def _extract_opportunities_from_api(self, data: Any, url: str) -> List[Dict[str, Any]]:
        """Extract opportunities from API response"""
        opportunities = []
        
        # Handle different API response formats
        items = []
        if isinstance(data, dict):
            # Try common field names for lists of opportunities
            for field in ['opportunities', 'grants', 'results', 'data', 'items', 'content']:
                if field in data and isinstance(data[field], list):
                    items = data[field]
                    break
            
            # If no list found, treat the entire object as a single opportunity
            if not items:
                items = [data]
        elif isinstance(data, list):
            items = data
        
        # Process each item
        for item in items:
            try:
                # Try to extract common fields
                title = self._get_field_value(item, ['title', 'name', 'subject', 'heading'])
                description = self._get_field_value(item, ['description', 'summary', 'abstract', 'content', 'text'])
                deadline = self._get_field_value(item, ['deadline', 'due_date', 'closing_date', 'end_date', 'expiry'])
                amount = self._get_field_value(item, ['amount', 'funding', 'budget', 'grant_size', 'value'])
                link = self._get_field_value(item, ['url', 'link', 'href', 'web_address'])
                
                if title:
                    opportunity = {
                        "title": title,
                        "description": description or "",
                        "deadline": self._parse_date(deadline) if deadline else None,
                        "amount": self._parse_amount(amount) if amount else None,
                        "url": link or url,
                        "source_url": url,
                        "content_hash": hashlib.md5(f"{title}-{url}".encode()).hexdigest()
                    }
                    opportunities.append(opportunity)
            except Exception as e:
                logger.error(f"Error extracting opportunity from API item: {e}")
        
        return opportunities
    
    def _extract_opportunities_from_rss(self, feed, url: str) -> List[Dict[str, Any]]:
        """Extract opportunities from RSS feed"""
        opportunities = []
        
        for entry in feed.entries:
            try:
                title = entry.get('title', '')
                description = entry.get('description', '') or entry.get('summary', '')
                link = entry.get('link', url)
                
                # Try to parse date
                published_date = None
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    published_date = datetime(*entry.published_parsed[:6])
                
                if title:
                    opportunity = {
                        "title": title,
                        "description": description,
                        "published_date": published_date.isoformat() if published_date else None,
                        "url": link,
                        "source_url": url,
                        "content_hash": hashlib.md5(f"{title}-{url}".encode()).hexdigest()
                    }
                    opportunities.append(opportunity)
            except Exception as e:
                logger.error(f"Error extracting opportunity from RSS entry: {e}")
        
        return opportunities
    
    def _get_field_value(self, item: Dict[str, Any], field_names: List[str]) -> Optional[str]:
        """Get value from item using multiple possible field names"""
        if not isinstance(item, dict):
            return None
            
        for field in field_names:
            if field in item and item[field]:
                value = item[field]
                if isinstance(value, (str, int, float)):
                    return str(value)
                elif isinstance(value, dict) and 'value' in value:
                    return str(value['value'])
                elif isinstance(value, dict) and 'text' in value:
                    return str(value['text'])
        return None
    
    def _parse_date(self, date_text: Optional[str]) -> Optional[str]:
        """Parse date from text to ISO format"""
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
                        month = month_names.index(match.group(1)[:3]) + 1 if match.group(1) in month_names else month_names.index(match.group(2)[:3]) + 1
                        day = int(match.group(2)) if match.group(1) in month_names else int(match.group(1))
                        year = int(match.group(3))
                    else:
                        parts = [int(g) for g in match.groups()]
                        if len(parts) == 3:
                            if parts[0] > 1900:  # YYYY/MM/DD
                                year, month, day = parts
                            else:  # MM/DD/YYYY or DD/MM/YYYY
                                month, day, year = parts
                    
                    return datetime(year, month, day).isoformat()
                except (ValueError, IndexError):
                    continue
        
        return None
    
    def _parse_amount(self, amount_text: Optional[str]) -> Optional[Dict[str, Any]]:
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

# Create global instance
scraping_service = ScrapingService()