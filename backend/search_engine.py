import os
import json
import time
import asyncio
import logging
from typing import List, Dict, Any, Optional, Union
import aiohttp
import numpy as np
from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("granada-search-engine")

# Initialize FastAPI app
app = FastAPI(
    title="Granada Search Engine",
    description="Micro-bot based search engine for funding opportunities",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class SearchQuery(BaseModel):
    query: str
    user_type: str = "general"
    filters: Dict[str, Any] = Field(default_factory=dict)
    page: int = 1
    page_size: int = 10
    sort_by: str = "relevance"
    credit_cost: int = 1

class SearchResult(BaseModel):
    id: str
    title: str
    description: str
    organization: str
    amount: Optional[str] = None
    deadline: Optional[str] = None
    location: Optional[str] = None
    url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    match_score: float
    type: str

class SearchResponse(BaseModel):
    results: List[SearchResult]
    total: int
    page: int
    page_size: int
    query: str
    execution_time: float
    credit_cost: int

class CreditTransaction(BaseModel):
    user_id: str
    amount: int
    transaction_type: str
    details: str
    timestamp: datetime = Field(default_factory=datetime.now)

# Micro-bot system
class SearchBot:
    """Base class for search micro-bots"""
    def __init__(self, name: str, weight: float = 1.0):
        self.name = name
        self.weight = weight
        logger.info(f"Initialized {name} bot with weight {weight}")
    
    async def search(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute search and return results"""
        raise NotImplementedError("Each bot must implement its own search method")
    
    def process_results(self, results: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        """Process and score results"""
        for result in results:
            if 'match_score' not in result:
                result['match_score'] = self._calculate_match_score(result, query)
        return results
    
    def _calculate_match_score(self, result: Dict[str, Any], query: str) -> float:
        """Calculate match score between result and query"""
        # Simple implementation - in production, use more sophisticated NLP
        query_terms = set(query.lower().split())
        title_terms = set(result.get('title', '').lower().split())
        desc_terms = set(result.get('description', '').lower().split())
        
        title_match = len(query_terms.intersection(title_terms)) / max(len(query_terms), 1)
        desc_match = len(query_terms.intersection(desc_terms)) / max(len(query_terms), 1)
        
        # Title matches are more important
        score = (title_match * 0.7) + (desc_match * 0.3)
        return min(score * self.weight, 1.0)

class GrantBot(SearchBot):
    """Bot specialized in finding grants"""
    async def search(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.5)  # Simulate API call
        
        # In production, this would call an actual grants database or API
        results = [
            {
                "id": f"grant-{i}",
                "title": f"Research Grant for {query.title()}",
                "description": f"Funding opportunity for research in {query}.",
                "organization": "National Science Foundation",
                "amount": f"${10000 + i * 5000}",
                "deadline": (datetime.now().replace(month=datetime.now().month + 1)).strftime("%Y-%m-%d"),
                "location": "United States",
                "url": "https://example.com/grants",
                "tags": ["research", query.lower(), "science"],
                "type": "grant"
            }
            for i in range(5)
        ]
        
        return self.process_results(results, query)

class ScholarshipBot(SearchBot):
    """Bot specialized in finding scholarships"""
    async def search(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.4)  # Simulate API call
        
        # In production, this would call an actual scholarship database or API
        results = [
            {
                "id": f"scholarship-{i}",
                "title": f"{query.title()} Scholarship Program",
                "description": f"Scholarship for students studying {query}.",
                "organization": "Education Foundation",
                "amount": f"${5000 + i * 1000}",
                "deadline": (datetime.now().replace(month=datetime.now().month + 2)).strftime("%Y-%m-%d"),
                "location": "Global",
                "url": "https://example.com/scholarships",
                "tags": ["education", query.lower(), "scholarship"],
                "type": "scholarship"
            }
            for i in range(3)
        ]
        
        return self.process_results(results, query)

class BusinessFundingBot(SearchBot):
    """Bot specialized in finding business funding"""
    async def search(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.6)  # Simulate API call
        
        # In production, this would call an actual business funding database or API
        results = [
            {
                "id": f"business-{i}",
                "title": f"{query.title()} Business Growth Fund",
                "description": f"Funding for businesses in the {query} sector.",
                "organization": "Economic Development Agency",
                "amount": f"${50000 + i * 25000}",
                "deadline": (datetime.now().replace(month=datetime.now().month + 3)).strftime("%Y-%m-%d"),
                "location": "North America",
                "url": "https://example.com/business-funding",
                "tags": ["business", query.lower(), "growth"],
                "type": "business_funding"
            }
            for i in range(4)
        ]
        
        return self.process_results(results, query)

class NonprofitBot(SearchBot):
    """Bot specialized in finding nonprofit funding"""
    async def search(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.5)  # Simulate API call
        
        # In production, this would call an actual nonprofit funding database or API
        results = [
            {
                "id": f"nonprofit-{i}",
                "title": f"{query.title()} Community Impact Grant",
                "description": f"Funding for nonprofit organizations working in {query}.",
                "organization": "Community Foundation",
                "amount": f"${20000 + i * 10000}",
                "deadline": (datetime.now().replace(month=datetime.now().month + 2)).strftime("%Y-%m-%d"),
                "location": "United States",
                "url": "https://example.com/nonprofit-grants",
                "tags": ["nonprofit", query.lower(), "community"],
                "type": "nonprofit_funding"
            }
            for i in range(3)
        ]
        
        return self.process_results(results, query)

# Search Engine Orchestrator
class SearchEngine:
    def __init__(self):
        self.bots = {
            "grant": GrantBot("GrantBot", 1.0),
            "scholarship": ScholarshipBot("ScholarshipBot", 1.0),
            "business": BusinessFundingBot("BusinessFundingBot", 1.0),
            "nonprofit": NonprofitBot("NonprofitBot", 1.0)
        }
        logger.info("Search Engine initialized with bots: " + ", ".join(self.bots.keys()))
    
    async def execute_search(self, search_query: SearchQuery) -> SearchResponse:
        start_time = time.time()
        query = search_query.query
        filters = search_query.filters
        user_type = search_query.user_type
        
        # Determine which bots to use based on query and user type
        active_bots = self._select_bots(query, user_type)
        logger.info(f"Selected bots for query '{query}': {[bot.name for bot in active_bots]}")
        
        # Execute searches in parallel
        tasks = [bot.search(query, filters) for bot in active_bots]
        bot_results = await asyncio.gather(*tasks)
        
        # Combine and rank results
        all_results = []
        for results in bot_results:
            all_results.extend(results)
        
        # Sort by match score
        all_results.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Apply pagination
        total_results = len(all_results)
        start_idx = (search_query.page - 1) * search_query.page_size
        end_idx = start_idx + search_query.page_size
        paginated_results = all_results[start_idx:end_idx]
        
        # Convert to SearchResult objects
        search_results = [
            SearchResult(
                id=result['id'],
                title=result['title'],
                description=result['description'],
                organization=result['organization'],
                amount=result.get('amount'),
                deadline=result.get('deadline'),
                location=result.get('location'),
                url=result.get('url'),
                tags=result.get('tags', []),
                match_score=result['match_score'],
                type=result['type']
            )
            for result in paginated_results
        ]
        
        execution_time = time.time() - start_time
        logger.info(f"Search completed in {execution_time:.2f}s with {total_results} results")
        
        # Calculate credit cost based on complexity
        credit_cost = self._calculate_credit_cost(search_query, len(active_bots))
        
        return SearchResponse(
            results=search_results,
            total=total_results,
            page=search_query.page,
            page_size=search_query.page_size,
            query=query,
            execution_time=execution_time,
            credit_cost=credit_cost
        )
    
    def _select_bots(self, query: str, user_type: str) -> List[SearchBot]:
        """Select appropriate bots based on query and user type"""
        query_lower = query.lower()
        
        # Check for specific keywords
        if "scholarship" in query_lower or "education" in query_lower:
            primary_bot = self.bots["scholarship"]
        elif "business" in query_lower or "startup" in query_lower or "entrepreneur" in query_lower:
            primary_bot = self.bots["business"]
        elif "nonprofit" in query_lower or "ngo" in query_lower or "community" in query_lower:
            primary_bot = self.bots["nonprofit"]
        else:
            primary_bot = self.bots["grant"]
        
        # Add user type specific bots
        if user_type == "student":
            return [primary_bot, self.bots["scholarship"]]
        elif user_type == "business":
            return [primary_bot, self.bots["business"]]
        elif user_type == "nonprofit":
            return [primary_bot, self.bots["nonprofit"]]
        else:
            # For general users, use all bots
            return list(self.bots.values())
    
    def _calculate_credit_cost(self, search_query: SearchQuery, num_bots: int) -> int:
        """Calculate credit cost based on search complexity"""
        base_cost = search_query.credit_cost
        
        # More bots = more complex search = higher cost
        bot_factor = max(1, num_bots / 2)
        
        # More filters = more complex search = higher cost
        filter_factor = 1 + (len(search_query.filters) * 0.2)
        
        # Calculate final cost
        cost = int(base_cost * bot_factor * filter_factor)
        return max(1, cost)  # Minimum cost is 1 credit

# Initialize search engine
search_engine = SearchEngine()

# Credit system
class CreditSystem:
    def __init__(self):
        self.transactions = []
        logger.info("Credit system initialized")
    
    async def deduct_credits(self, user_id: str, amount: int, details: str) -> bool:
        """Deduct credits from user account"""
        # In production, this would interact with a database
        transaction = CreditTransaction(
            user_id=user_id,
            amount=-amount,
            transaction_type="usage",
            details=details
        )
        self.transactions.append(transaction)
        logger.info(f"Deducted {amount} credits from user {user_id} for {details}")
        return True
    
    async def add_credits(self, user_id: str, amount: int, details: str) -> bool:
        """Add credits to user account"""
        # In production, this would interact with a database
        transaction = CreditTransaction(
            user_id=user_id,
            amount=amount,
            transaction_type="purchase",
            details=details
        )
        self.transactions.append(transaction)
        logger.info(f"Added {amount} credits to user {user_id} from {details}")
        return True
    
    async def get_balance(self, user_id: str) -> int:
        """Get current credit balance for user"""
        # In production, this would query a database
        balance = sum(t.amount for t in self.transactions if t.user_id == user_id)
        logger.info(f"User {user_id} has {balance} credits")
        return balance

# Initialize credit system
credit_system = CreditSystem()

# API Routes
@app.post("/api/search", response_model=SearchResponse)
async def search(
    search_query: SearchQuery,
    background_tasks: BackgroundTasks,
    user_id: str = Query("anonymous")
):
    try:
        # Check if user has enough credits
        user_balance = await credit_system.get_balance(user_id)
        estimated_cost = search_query.credit_cost
        
        if user_balance < estimated_cost:
            raise HTTPException(status_code=402, detail="Insufficient credits")
        
        # Execute search
        response = await search_engine.execute_search(search_query)
        
        # Deduct credits in background
        background_tasks.add_task(
            credit_system.deduct_credits,
            user_id,
            response.credit_cost,
            f"Search: {search_query.query}"
        )
        
        return response
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/credits/purchase")
async def purchase_credits(
    user_id: str,
    amount: int,
    payment_method: str,
    payment_details: Dict[str, Any]
):
    try:
        # In production, this would process payment through a payment gateway
        logger.info(f"Processing payment for {amount} credits using {payment_method}")
        
        # Simulate payment processing
        await asyncio.sleep(1)
        
        # Add credits to user account
        success = await credit_system.add_credits(
            user_id,
            amount,
            f"Purchase via {payment_method}"
        )
        
        if not success:
            raise HTTPException(status_code=400, detail="Failed to add credits")
        
        return {"success": True, "credits_added": amount}
    except Exception as e:
        logger.error(f"Credit purchase error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/credits/balance/{user_id}")
async def get_credit_balance(user_id: str):
    try:
        balance = await credit_system.get_balance(user_id)
        return {"user_id": user_id, "balance": balance}
    except Exception as e:
        logger.error(f"Balance check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/credits/history/{user_id}")
async def get_credit_history(user_id: str):
    try:
        # In production, this would query a database
        transactions = [
            {
                "id": i,
                "amount": t.amount,
                "type": t.transaction_type,
                "details": t.details,
                "timestamp": t.timestamp.isoformat()
            }
            for i, t in enumerate(credit_system.transactions)
            if t.user_id == user_id
        ]
        return {"user_id": user_id, "transactions": transactions}
    except Exception as e:
        logger.error(f"Transaction history error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)