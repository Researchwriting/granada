import asyncio
import aiohttp
import json
import re
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from bs4 import BeautifulSoup
import logging

from ..models.dashboard import Opportunity, OpportunityType
from ..schemas.dashboard import OpportunityCreate

logger = logging.getLogger(__name__)

class MicroBot:
    """Base class for micro bots that scrape specific sources"""
    
    def __init__(self, name: str, base_url: str, db: Session):
        self.name = name
        self.base_url = base_url
        self.db = db
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def fetch_page(self, url: str) -> Optional[str]:
        """Fetch a web page"""
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    logger.warning(f"Failed to fetch {url}: {response.status}")
                    return None
        except Exception as e:
            logger.error(f"Error fetching {url}: {str(e)}")
            return None
    
    async def parse_opportunities(self, html: str) -> List[Dict[str, Any]]:
        """Parse opportunities from HTML - to be implemented by subclasses"""
        raise NotImplementedError
    
    async def scrape(self) -> List[Dict[str, Any]]:
        """Main scraping method"""
        opportunities = []
        try:
            html = await self.fetch_page(self.base_url)
            if html:
                opportunities = await self.parse_opportunities(html)
                logger.info(f"{self.name} found {len(opportunities)} opportunities")
        except Exception as e:
            logger.error(f"Error in {self.name} scraping: {str(e)}")
        
        return opportunities

class ScholarshipBot(MicroBot):
    """Bot for scraping scholarship opportunities"""
    
    def __init__(self, db: Session):
        super().__init__("ScholarshipBot", "https://www.scholarships.com", db)
    
    async def parse_opportunities(self, html: str) -> List[Dict[str, Any]]:
        soup = BeautifulSoup(html, 'html.parser')
        opportunities = []
        
        # Example parsing logic - adapt to actual website structure
        scholarship_cards = soup.find_all('div', class_='scholarship-card')
        
        for card in scholarship_cards[:20]:  # Limit to 20 per scrape
            try:
                title_elem = card.find('h3') or card.find('h2')
                title = title_elem.get_text(strip=True) if title_elem else "Unknown Scholarship"
                
                org_elem = card.find('span', class_='organization')
                organization = org_elem.get_text(strip=True) if org_elem else "Unknown Organization"
                
                amount_elem = card.find('span', class_='amount')
                amount = amount_elem.get_text(strip=True) if amount_elem else "Amount varies"
                
                deadline_elem = card.find('span', class_='deadline')
                deadline_str = deadline_elem.get_text(strip=True) if deadline_elem else ""
                
                # Parse deadline
                deadline = self.parse_deadline(deadline_str)
                
                desc_elem = card.find('p', class_='description')
                description = desc_elem.get_text(strip=True) if desc_elem else ""
                
                link_elem = card.find('a')
                external_url = link_elem.get('href') if link_elem else ""
                
                opportunities.append({
                    'title': title,
                    'organization': organization,
                    'opportunity_type': OpportunityType.SCHOLARSHIP,
                    'amount': amount,
                    'location': 'Nationwide',
                    'deadline': deadline,
                    'description': description,
                    'category': 'Education',
                    'external_url': external_url,
                    'requirements': json.dumps(['Academic excellence', 'Application essay'])
                })
                
            except Exception as e:
                logger.error(f"Error parsing scholarship card: {str(e)}")
                continue
        
        return opportunities
    
    def parse_deadline(self, deadline_str: str) -> datetime:
        """Parse deadline string to datetime"""
        try:
            # Common deadline formats
            if 'ongoing' in deadline_str.lower():
                return datetime.utcnow() + timedelta(days=365)
            
            # Extract date patterns
            date_patterns = [
                r'(\d{1,2})/(\d{1,2})/(\d{4})',  # MM/DD/YYYY
                r'(\d{1,2})-(\d{1,2})-(\d{4})',  # MM-DD-YYYY
                r'(\w+)\s+(\d{1,2}),?\s+(\d{4})'  # Month DD, YYYY
            ]
            
            for pattern in date_patterns:
                match = re.search(pattern, deadline_str)
                if match:
                    if pattern == date_patterns[2]:  # Month name format
                        month_name, day, year = match.groups()
                        month_map = {
                            'january': 1, 'february': 2, 'march': 3, 'april': 4,
                            'may': 5, 'june': 6, 'july': 7, 'august': 8,
                            'september': 9, 'october': 10, 'november': 11, 'december': 12
                        }
                        month = month_map.get(month_name.lower(), 12)
                        return datetime(int(year), month, int(day))
                    else:
                        month, day, year = match.groups()
                        return datetime(int(year), int(month), int(day))
            
            # Default to 6 months from now
            return datetime.utcnow() + timedelta(days=180)
            
        except Exception:
            return datetime.utcnow() + timedelta(days=180)

class GrantBot(MicroBot):
    """Bot for scraping grant opportunities"""
    
    def __init__(self, db: Session):
        super().__init__("GrantBot", "https://www.grants.gov", db)
    
    async def parse_opportunities(self, html: str) -> List[Dict[str, Any]]:
        soup = BeautifulSoup(html, 'html.parser')
        opportunities = []
        
        # Example parsing for grants.gov structure
        grant_listings = soup.find_all('div', class_='grant-listing')
        
        for listing in grant_listings[:15]:  # Limit to 15 per scrape
            try:
                title_elem = listing.find('h4') or listing.find('h3')
                title = title_elem.get_text(strip=True) if title_elem else "Unknown Grant"
                
                agency_elem = listing.find('span', class_='agency')
                organization = agency_elem.get_text(strip=True) if agency_elem else "Federal Agency"
                
                funding_elem = listing.find('span', class_='funding')
                amount = funding_elem.get_text(strip=True) if funding_elem else "Funding varies"
                
                deadline_elem = listing.find('span', class_='close-date')
                deadline_str = deadline_elem.get_text(strip=True) if deadline_elem else ""
                deadline = self.parse_deadline(deadline_str)
                
                summary_elem = listing.find('div', class_='summary')
                description = summary_elem.get_text(strip=True) if summary_elem else ""
                
                category_elem = listing.find('span', class_='category')
                category = category_elem.get_text(strip=True) if category_elem else "General"
                
                opportunities.append({
                    'title': title,
                    'organization': organization,
                    'opportunity_type': OpportunityType.GRANT,
                    'amount': amount,
                    'location': 'Nationwide',
                    'deadline': deadline,
                    'description': description,
                    'category': category,
                    'external_url': self.base_url,
                    'requirements': json.dumps(['Eligible organization', 'Detailed proposal', 'Budget plan'])
                })
                
            except Exception as e:
                logger.error(f"Error parsing grant listing: {str(e)}")
                continue
        
        return opportunities
    
    def parse_deadline(self, deadline_str: str) -> datetime:
        """Parse deadline string to datetime"""
        # Similar to ScholarshipBot but adapted for grant formats
        try:
            if not deadline_str or 'none' in deadline_str.lower():
                return datetime.utcnow() + timedelta(days=90)
            
            # Extract date from various formats
            date_match = re.search(r'(\d{1,2})/(\d{1,2})/(\d{4})', deadline_str)
            if date_match:
                month, day, year = date_match.groups()
                return datetime(int(year), int(month), int(day))
            
            return datetime.utcnow() + timedelta(days=90)
            
        except Exception:
            return datetime.utcnow() + timedelta(days=90)

class JobBot(MicroBot):
    """Bot for scraping job opportunities"""
    
    def __init__(self, db: Session):
        super().__init__("JobBot", "https://www.indeed.com", db)
    
    async def parse_opportunities(self, html: str) -> List[Dict[str, Any]]:
        soup = BeautifulSoup(html, 'html.parser')
        opportunities = []
        
        # Example parsing for job listings
        job_cards = soup.find_all('div', class_='job-card')
        
        for card in job_cards[:25]:  # Limit to 25 per scrape
            try:
                title_elem = card.find('h2') or card.find('a', class_='job-title')
                title = title_elem.get_text(strip=True) if title_elem else "Unknown Position"
                
                company_elem = card.find('span', class_='company')
                organization = company_elem.get_text(strip=True) if company_elem else "Unknown Company"
                
                location_elem = card.find('div', class_='location')
                location = location_elem.get_text(strip=True) if location_elem else "Location not specified"
                
                salary_elem = card.find('span', class_='salary')
                amount = salary_elem.get_text(strip=True) if salary_elem else "Salary not specified"
                
                summary_elem = card.find('div', class_='summary')
                description = summary_elem.get_text(strip=True) if summary_elem else ""
                
                # Jobs typically don't have strict deadlines
                deadline = datetime.utcnow() + timedelta(days=30)
                
                opportunities.append({
                    'title': title,
                    'organization': organization,
                    'opportunity_type': OpportunityType.JOB,
                    'amount': amount,
                    'location': location,
                    'deadline': deadline,
                    'description': description,
                    'category': 'Employment',
                    'external_url': self.base_url,
                    'requirements': json.dumps(['Resume', 'Cover letter', 'Relevant experience'])
                })
                
            except Exception as e:
                logger.error(f"Error parsing job card: {str(e)}")
                continue
        
        return opportunities

class VolunteerBot(MicroBot):
    """Bot for scraping volunteer opportunities"""
    
    def __init__(self, db: Session):
        super().__init__("VolunteerBot", "https://www.volunteermatch.org", db)
    
    async def parse_opportunities(self, html: str) -> List[Dict[str, Any]]:
        soup = BeautifulSoup(html, 'html.parser')
        opportunities = []
        
        volunteer_listings = soup.find_all('div', class_='volunteer-opportunity')
        
        for listing in volunteer_listings[:20]:
            try:
                title_elem = listing.find('h3')
                title = title_elem.get_text(strip=True) if title_elem else "Volunteer Opportunity"
                
                org_elem = listing.find('span', class_='organization')
                organization = org_elem.get_text(strip=True) if org_elem else "Community Organization"
                
                location_elem = listing.find('span', class_='location')
                location = location_elem.get_text(strip=True) if location_elem else "Local"
                
                desc_elem = listing.find('p', class_='description')
                description = desc_elem.get_text(strip=True) if desc_elem else ""
                
                category_elem = listing.find('span', class_='cause')
                category = category_elem.get_text(strip=True) if category_elem else "Community Service"
                
                # Volunteer opportunities are typically ongoing
                deadline = datetime.utcnow() + timedelta(days=365)
                
                opportunities.append({
                    'title': title,
                    'organization': organization,
                    'opportunity_type': OpportunityType.VOLUNTEER,
                    'amount': None,
                    'location': location,
                    'deadline': deadline,
                    'description': description,
                    'category': category,
                    'external_url': self.base_url,
                    'requirements': json.dumps(['Background check may be required', 'Commitment to cause'])
                })
                
            except Exception as e:
                logger.error(f"Error parsing volunteer listing: {str(e)}")
                continue
        
        return opportunities

class MicroBotOrchestrator:
    """Orchestrates multiple micro bots for comprehensive searching"""
    
    def __init__(self, db: Session):
        self.db = db
        self.bots = [
            ScholarshipBot(db),
            GrantBot(db),
            JobBot(db),
            VolunteerBot(db)
        ]
    
    async def run_all_bots(self) -> Dict[str, List[Dict[str, Any]]]:
        """Run all bots concurrently"""
        results = {}
        
        async def run_bot(bot):
            async with bot:
                return await bot.scrape()
        
        # Run all bots concurrently
        tasks = [run_bot(bot) for bot in self.bots]
        bot_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for bot, result in zip(self.bots, bot_results):
            if isinstance(result, Exception):
                logger.error(f"Bot {bot.name} failed: {str(result)}")
                results[bot.name] = []
            else:
                results[bot.name] = result
        
        return results
    
    async def search_and_store(self, opportunity_types: Optional[List[OpportunityType]] = None) -> int:
        """Search for opportunities and store in database"""
        results = await self.run_all_bots()
        total_stored = 0
        
        for bot_name, opportunities in results.items():
            for opp_data in opportunities:
                try:
                    # Check if opportunity already exists
                    existing = self.db.query(Opportunity).filter(
                        Opportunity.title == opp_data['title'],
                        Opportunity.organization == opp_data['organization']
                    ).first()
                    
                    if not existing:
                        # Filter by opportunity types if specified
                        if opportunity_types and opp_data['opportunity_type'] not in opportunity_types:
                            continue
                        
                        opportunity = Opportunity(**opp_data)
                        self.db.add(opportunity)
                        total_stored += 1
                
                except Exception as e:
                    logger.error(f"Error storing opportunity: {str(e)}")
                    continue
        
        try:
            self.db.commit()
            logger.info(f"Stored {total_stored} new opportunities")
        except Exception as e:
            logger.error(f"Error committing opportunities: {str(e)}")
            self.db.rollback()
            total_stored = 0
        
        return total_stored
    
    async def targeted_search(self, query: str, opportunity_type: OpportunityType) -> List[Dict[str, Any]]:
        """Perform targeted search for specific query and type"""
        # Select appropriate bot based on opportunity type
        bot_map = {
            OpportunityType.SCHOLARSHIP: ScholarshipBot,
            OpportunityType.GRANT: GrantBot,
            OpportunityType.JOB: JobBot,
            OpportunityType.VOLUNTEER: VolunteerBot
        }
        
        bot_class = bot_map.get(opportunity_type)
        if not bot_class:
            return []
        
        bot = bot_class(self.db)
        
        async with bot:
            # Modify bot's base URL to include search query
            search_url = f"{bot.base_url}/search?q={query}"
            html = await bot.fetch_page(search_url)
            
            if html:
                opportunities = await bot.parse_opportunities(html)
                # Filter results by query relevance
                filtered_opportunities = []
                query_terms = query.lower().split()
                
                for opp in opportunities:
                    relevance_score = 0
                    text_to_search = f"{opp['title']} {opp['description']} {opp['category']}".lower()
                    
                    for term in query_terms:
                        if term in text_to_search:
                            relevance_score += 1
                    
                    if relevance_score > 0:
                        opp['relevance_score'] = relevance_score
                        filtered_opportunities.append(opp)
                
                # Sort by relevance
                filtered_opportunities.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
                return filtered_opportunities[:10]  # Return top 10 most relevant
        
        return []

# Utility functions for the search engine
def clean_text(text: str) -> str:
    """Clean and normalize text"""
    if not text:
        return ""
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\-\.,!?]', '', text)
    return text

def extract_amount(amount_str: str) -> Optional[float]:
    """Extract numeric amount from string"""
    if not amount_str:
        return None
    
    # Remove currency symbols and commas
    cleaned = re.sub(r'[^\d\.]', '', amount_str)
    
    try:
        return float(cleaned)
    except ValueError:
        return None

def categorize_opportunity(title: str, description: str) -> str:
    """Automatically categorize opportunity based on content"""
    text = f"{title} {description}".lower()
    
    categories = {
        'STEM': ['science', 'technology', 'engineering', 'math', 'computer', 'data', 'research'],
        'Arts': ['art', 'music', 'creative', 'design', 'writing', 'literature'],
        'Business': ['business', 'entrepreneurship', 'marketing', 'finance', 'management'],
        'Healthcare': ['health', 'medical', 'nursing', 'medicine', 'healthcare'],
        'Education': ['education', 'teaching', 'academic', 'school', 'university'],
        'Community': ['community', 'volunteer', 'service', 'nonprofit', 'social'],
        'Environment': ['environment', 'green', 'sustainability', 'climate', 'conservation']
    }
    
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            return category
    
    return 'General'