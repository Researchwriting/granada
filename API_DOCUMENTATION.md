# Granada Dashboard API Documentation

## Base URL
```
Development: http://localhost:8000
Production: https://api.granada-dashboard.com
```

## Authentication
All API endpoints require Bearer token authentication:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 🏠 Dashboard APIs

#### Get Dashboard Statistics
Get user-specific dashboard statistics based on user type.

**Student Statistics**
```http
GET /api/v1/dashboard/stats/student
```

**Response:**
```json
{
  "total_applications": 12,
  "approved_applications": 3,
  "pending_applications": 5,
  "awards_won": 3,
  "pending_reviews": 5,
  "total_funding": "$17,500",
  "success_rate": 25.0
}
```

**Business Statistics**
```http
GET /api/v1/dashboard/stats/business
```

**Response:**
```json
{
  "total_applications": 8,
  "approved_applications": 2,
  "pending_applications": 3,
  "grants_awarded": 2,
  "avg_review_days": 45,
  "total_funding": "$1,200,000",
  "success_rate": 25.0
}
```

**Job Seeker Statistics**
```http
GET /api/v1/dashboard/stats/job-seeker
```

**Response:**
```json
{
  "total_applications": 15,
  "approved_applications": 1,
  "pending_applications": 8,
  "interviews": 3,
  "job_offers": 1,
  "response_rate": 46.7
}
```

#### User Profile Management

**Get User Profile**
```http
GET /api/v1/dashboard/profile
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john.student@university.edu",
    "full_name": "John Student",
    "user_type": "student",
    "phone": "+1-555-123-4567",
    "location": "San Francisco, CA",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-06-21T00:00:00Z",
    "is_active": true
  },
  "profile": {
    "id": 1,
    "user_id": 1,
    "university": "State University",
    "major": "Computer Science",
    "gpa": 3.8,
    "graduation_year": 2026,
    "academic_level": "undergraduate"
  }
}
```

**Update Student Profile**
```http
PUT /api/v1/dashboard/profile/student
Content-Type: application/json

{
  "university": "State University",
  "major": "Computer Science",
  "gpa": 3.8,
  "graduation_year": 2026,
  "academic_level": "undergraduate"
}
```

**Update Business Profile**
```http
PUT /api/v1/dashboard/profile/business
Content-Type: application/json

{
  "company_name": "TechCorp Inc.",
  "industry": "Technology",
  "employee_count": "50-100",
  "annual_revenue": "$5M - $10M",
  "duns_number": "123456789",
  "naics_code": "541511",
  "company_description": "Leading technology company..."
}
```

**Update Job Seeker Profile**
```http
PUT /api/v1/dashboard/profile/job-seeker
Content-Type: application/json

{
  "current_title": "Junior Developer",
  "experience_level": "Entry Level",
  "skills": "[\"JavaScript\", \"React\", \"Node.js\", \"Python\"]",
  "professional_summary": "Passionate software developer...",
  "desired_salary_min": 60000,
  "desired_salary_max": 80000
}
```

#### Opportunity Search

**Search Opportunities**
```http
POST /api/v1/dashboard/opportunities/search
Content-Type: application/json

{
  "query": "computer science scholarship",
  "filters": {
    "opportunity_type": "scholarship",
    "category": "STEM",
    "location": "California",
    "min_amount": 1000,
    "max_amount": 10000,
    "deadline_after": "2025-07-01T00:00:00Z",
    "deadline_before": "2025-12-31T23:59:59Z"
  },
  "limit": 20,
  "offset": 0
}
```

**Response:**
```json
{
  "opportunities": [
    {
      "id": 1,
      "title": "Merit-Based Academic Scholarship",
      "organization": "University Foundation",
      "opportunity_type": "scholarship",
      "amount": "$5,000",
      "location": "Nationwide",
      "deadline": "2025-08-15T23:59:59Z",
      "description": "Scholarship for students with outstanding academic performance.",
      "category": "Education",
      "posted_date": "2025-06-01T00:00:00Z",
      "is_active": true,
      "match_percentage": 95.0
    }
  ],
  "total": 25,
  "has_more": true
}
```

**Get Recommended Opportunities**
```http
GET /api/v1/dashboard/opportunities/recommended?limit=10
```

**Get Scholarships**
```http
GET /api/v1/dashboard/opportunities/scholarships?limit=20&offset=0
```

**Get Grants**
```http
GET /api/v1/dashboard/opportunities/grants?limit=20&offset=0
```

**Get Jobs**
```http
GET /api/v1/dashboard/opportunities/jobs?limit=20&offset=0
```

#### Application Management

**Create Application**
```http
POST /api/v1/dashboard/applications
Content-Type: application/json

{
  "opportunity_id": 1,
  "notes": "Very interested in this opportunity. My research aligns perfectly."
}
```

**Get User Applications**
```http
GET /api/v1/dashboard/applications?status=pending
```

**Response:**
```json
{
  "applications": [
    {
      "id": 1,
      "user_id": 1,
      "opportunity_id": 1,
      "status": "under_review",
      "submitted_date": "2025-06-01T00:00:00Z",
      "next_step": "Interview scheduled for June 30th",
      "notes": "Very interested in this opportunity.",
      "opportunity": {
        "id": 1,
        "title": "STEM Excellence Grant",
        "organization": "Tech Innovation Fund",
        "opportunity_type": "grant",
        "amount": "$10,000"
      }
    }
  ],
  "total": 3
}
```

#### Saved Opportunities

**Save Opportunity**
```http
POST /api/v1/dashboard/saved-opportunities
Content-Type: application/json

{
  "opportunity_id": 1
}
```

**Get Saved Opportunities**
```http
GET /api/v1/dashboard/saved-opportunities
```

**Remove Saved Opportunity**
```http
DELETE /api/v1/dashboard/saved-opportunities/1
```

#### Training Programs

**Get Training Programs**
```http
GET /api/v1/dashboard/training-programs?category=Technology&funding_available=true
```

**Response:**
```json
{
  "programs": [
    {
      "id": 1,
      "title": "Full Stack Web Development Bootcamp",
      "provider": "CodeAcademy",
      "duration": "12 weeks",
      "cost": "$8,000",
      "category": "Technology",
      "description": "Comprehensive program covering front-end and back-end development.",
      "funding_available": true,
      "location": "Online",
      "start_date": "2025-09-01T00:00:00Z",
      "end_date": "2025-11-24T00:00:00Z",
      "is_active": true
    }
  ],
  "total": 5
}
```

### 💳 Credit System APIs

#### Credit Balance

**Get Credit Balance**
```http
GET /api/v1/credits/balance
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "total_credits": 100,
  "used_credits": 25,
  "remaining_credits": 75,
  "last_updated": "2025-06-21T12:00:00Z"
}
```

**Get Credit Statistics**
```http
GET /api/v1/credits/stats
```

**Response:**
```json
{
  "total_credits": 100,
  "used_credits": 25,
  "remaining_credits": 75,
  "monthly_usage": 15,
  "top_usage_types": [
    {
      "type": "search",
      "credits_used": 10,
      "usage_count": 5
    },
    {
      "type": "ai_assistance",
      "credits_used": 5,
      "usage_count": 1
    }
  ],
  "recent_purchases": [
    {
      "id": 1,
      "credits_purchased": 100,
      "amount_paid": 29.99,
      "status": "completed",
      "purchase_date": "2025-06-01T00:00:00Z"
    }
  ]
}
```

#### Credit Packages

**Get Credit Packages**
```http
GET /api/v1/credits/packages?package_type=basic
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Starter Pack",
    "package_type": "basic",
    "credits": 25,
    "price": 9.99,
    "description": "Perfect for getting started with basic searches",
    "features": "[\"Basic search\", \"Email support\"]",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Student Pack",
    "package_type": "premium",
    "credits": 100,
    "price": 29.99,
    "description": "Ideal for students with regular search needs",
    "features": "[\"Advanced search\", \"AI assistance\", \"Priority support\"]",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

#### Payment Processing

**Create Payment Intent**
```http
POST /api/v1/credits/payment-intent
Content-Type: application/json

{
  "package_id": 2,
  "payment_method_id": "pm_1234567890"
}
```

**Response:**
```json
{
  "client_secret": "pi_1234567890_secret_abcdef",
  "amount": 29.99,
  "currency": "usd"
}
```

**Complete Credit Purchase**
```http
POST /api/v1/credits/purchase?transaction_id=pi_1234567890
Content-Type: application/json

{
  "package_id": 2,
  "payment_method": "stripe"
}
```

**Response:**
```json
{
  "id": 1,
  "credits_purchased": 100,
  "amount_paid": 29.99,
  "status": "completed",
  "purchase_date": "2025-06-21T12:00:00Z",
  "package": {
    "id": 2,
    "name": "Student Pack",
    "credits": 100,
    "price": 29.99
  }
}
```

#### Credit Usage

**Use Credits**
```http
POST /api/v1/credits/use
Content-Type: application/json

{
  "usage_type": "search",
  "credits_used": 3,
  "description": "Advanced scholarship search with filters",
  "metadata": {
    "search_query": "computer science scholarship",
    "filters_count": 4,
    "live_search": true
  }
}
```

**Get Usage History**
```http
GET /api/v1/credits/usage?limit=50
```

**Get Credit Costs**
```http
GET /api/v1/credits/costs
```

**Response:**
```json
{
  "basic_search": 1,
  "advanced_search": 3,
  "ai_assistance": 5,
  "document_generation": 10,
  "premium_application": 15,
  "expert_review": 25
}
```

**Calculate Search Cost**
```http
POST /api/v1/credits/calculate-search-cost
Content-Type: application/json

{
  "search_type": "advanced_search",
  "filters_count": 4
}
```

**Response:**
```json
{
  "search_type": "advanced_search",
  "filters_count": 4,
  "cost": 7
}
```

#### Subscription Management

**Get Subscription Plans**
```http
GET /api/v1/credits/subscription-plans
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Basic Plan",
    "monthly_price": 19.99,
    "yearly_price": 199.99,
    "monthly_credits": 50,
    "features": "[\"50 monthly credits\", \"Basic support\", \"Email notifications\"]",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

**Create Subscription**
```http
POST /api/v1/credits/subscribe
Content-Type: application/json

{
  "plan_id": 1,
  "billing_cycle": "monthly"
}
```

**Get User Subscription**
```http
GET /api/v1/credits/subscription
```

**Cancel Subscription**
```http
DELETE /api/v1/credits/subscription
```

#### Payment Methods

**Add Payment Method**
```http
POST /api/v1/credits/payment-methods
Content-Type: application/json

{
  "stripe_payment_method_id": "pm_1234567890",
  "card_last_four": "4242",
  "card_brand": "visa",
  "is_default": true
}
```

**Get Payment Methods**
```http
GET /api/v1/credits/payment-methods
```

**Remove Payment Method**
```http
DELETE /api/v1/credits/payment-methods/1
```

### 🔍 Enhanced Search APIs

#### Live Search with Micro Bots

**Live Search Opportunities**
```http
POST /api/v1/search/live-search?use_live_search=true
Content-Type: application/json

{
  "query": "AI research fellowship",
  "filters": {
    "opportunity_type": "scholarship",
    "category": "STEM",
    "location": "California"
  },
  "limit": 20,
  "offset": 0
}
```

**Response:**
```json
{
  "opportunities": [
    {
      "id": 1,
      "title": "AI Research Fellowship",
      "organization": "Stanford University",
      "opportunity_type": "scholarship",
      "amount": "$50,000",
      "location": "Stanford, CA",
      "deadline": "2025-09-15T23:59:59Z",
      "description": "Fellowship for AI research students...",
      "category": "STEM",
      "match_percentage": 98.5,
      "relevance_score": 95
    }
  ],
  "total": 15,
  "has_more": false
}
```

**Real-time Opportunities**
```http
GET /api/v1/search/real-time-opportunities?opportunity_type=scholarship&limit=10
```

**Response:**
```json
{
  "message": "Found 5 new opportunities",
  "opportunities": [
    {
      "id": 101,
      "title": "New Research Grant",
      "organization": "NSF",
      "opportunity_type": "grant",
      "amount": "$100,000",
      "match_percentage": 92.0
    }
  ]
}
```

#### Search Suggestions and Analytics

**Get Search Suggestions**
```http
GET /api/v1/search/search-suggestions?query=comput
```

**Response:**
```json
{
  "suggestions": [
    {
      "type": "title",
      "text": "Computer Science Scholarship"
    },
    {
      "type": "organization",
      "text": "Computer Science Foundation"
    },
    {
      "type": "category",
      "text": "Computer Science"
    }
  ]
}
```

**Get Trending Searches**
```http
GET /api/v1/search/trending-searches
```

**Response:**
```json
{
  "popular_searches": [
    "STEM scholarships",
    "research grants",
    "remote jobs",
    "volunteer opportunities",
    "business grants"
  ],
  "trending_categories": [
    {
      "category": "Technology",
      "growth": "+25%"
    },
    {
      "category": "Healthcare",
      "growth": "+18%"
    }
  ],
  "hot_opportunities": [
    {
      "title": "AI Research Fellowship",
      "type": "scholarship",
      "deadline_days": 15
    }
  ]
}
```

**Get Search Analytics**
```http
GET /api/v1/search/search-analytics
```

**Response:**
```json
{
  "total_searches": 45,
  "most_searched_terms": {
    "scholarship": 15,
    "grant": 12,
    "fellowship": 8
  },
  "search_type_distribution": {
    "basic_search": 25,
    "advanced_search": 15,
    "live_search": 5
  },
  "recent_searches": [
    "AI scholarship",
    "research grant",
    "STEM fellowship"
  ],
  "search_frequency": {
    "daily_average": 1.5,
    "peak_search_day": "Monday"
  }
}
```

#### Background Operations

**Trigger Background Refresh**
```http
POST /api/v1/search/background-refresh?opportunity_types=scholarship,grant
```

**Response:**
```json
{
  "message": "Background refresh initiated"
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "status_code": 400,
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 402 | Payment Required | Insufficient credits |
| 403 | Forbidden | Access denied for user type |
| 404 | Not Found | Resource not found |
| 422 | Validation Error | Request validation failed |
| 429 | Rate Limited | Too many requests |
| 500 | Internal Error | Server error |

### Credit-Specific Errors

**Insufficient Credits**
```json
{
  "error": "Insufficient Credits",
  "message": "Insufficient credits. Required: 5, Available: 2",
  "status_code": 402,
  "details": {
    "required_credits": 5,
    "available_credits": 2,
    "shortfall": 3
  }
}
```

**Payment Failed**
```json
{
  "error": "Payment Failed",
  "message": "Payment processing error: Your card was declined",
  "status_code": 400,
  "details": {
    "payment_method": "stripe",
    "decline_code": "insufficient_funds"
  }
}
```

## Rate Limiting

### Credit-Based Rate Limiting
- Basic operations: 1 credit per request
- Advanced operations: 3-5 credits per request
- Premium features: 10+ credits per request

### Traditional Rate Limiting
- 60 requests per minute per user
- 1000 requests per hour per user
- Burst allowance: 10 requests per second

### Rate Limit Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640995200
X-Credits-Remaining: 75
```

## Webhooks

### Stripe Webhooks
Handle payment events from Stripe:

```http
POST /api/v1/webhooks/stripe
Content-Type: application/json
Stripe-Signature: t=1640995200,v1=signature

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "amount": 2999,
      "metadata": {
        "user_id": "1",
        "package_id": "2"
      }
    }
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { GranadaAPI } from '@granada/api-client';

const api = new GranadaAPI({
  baseURL: 'http://localhost:8000',
  token: 'your-jwt-token'
});

// Search opportunities
const results = await api.dashboard.searchOpportunities({
  query: 'computer science scholarship',
  filters: {
    opportunity_type: 'scholarship',
    amount_min: 1000
  }
});

// Purchase credits
const paymentIntent = await api.credits.createPaymentIntent({
  package_id: 2
});

// Use credits for search
await api.credits.useCredits({
  usage_type: 'search',
  credits_used: 3,
  description: 'Advanced search'
});
```

### Python
```python
from granada_api import GranadaClient

client = GranadaClient(
    base_url='http://localhost:8000',
    token='your-jwt-token'
)

# Search opportunities
results = client.dashboard.search_opportunities(
    query='computer science scholarship',
    filters={
        'opportunity_type': 'scholarship',
        'amount_min': 1000
    }
)

# Purchase credits
payment_intent = client.credits.create_payment_intent(
    package_id=2
)

# Use credits
client.credits.use_credits(
    usage_type='search',
    credits_used=3,
    description='Advanced search'
)
```

## Testing

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Granada Dashboard API",
  "version": "1.0.0"
}
```

### API Information
```http
GET /api/v1/info
```

**Response:**
```json
{
  "api_version": "1.0.0",
  "endpoints": {
    "dashboard": {
      "base": "/api/v1/dashboard",
      "features": ["User profiles", "Statistics", "Opportunities"]
    },
    "credits": {
      "base": "/api/v1/credits",
      "features": ["Balance management", "Purchases", "Subscriptions"]
    },
    "search": {
      "base": "/api/v1/search",
      "features": ["Live search", "Real-time opportunities", "Analytics"]
    }
  }
}
```

---

For more information, visit the interactive API documentation at `/docs` when running the server.