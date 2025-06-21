# Granada Dashboard System

A comprehensive multi-user dashboard platform with credit-based search engine powered by micro bots for students, businesses, job seekers, and general users.

## 🚀 Features

### Multi-User Dashboards
- **Student Dashboard**: Scholarship tracking, application management, academic profile
- **Business Dashboard**: Grant opportunities, funding analytics, company profile management
- **Job Seeker Dashboard**: Job opportunities, application tracking, skill development
- **General Dashboard**: All-in-one opportunity discovery across multiple categories

### Credit-Based Search System
- **Tiered Search**: Basic (1 credit), Advanced (3 credits), Premium (5+ credits)
- **Real-time Discovery**: Live micro bot scraping for fresh opportunities
- **AI-Powered Matching**: Intelligent opportunity matching based on user profiles
- **Usage Analytics**: Detailed credit usage tracking and optimization suggestions

### Micro Bots Search Engine
- **ScholarshipBot**: Scrapes scholarship databases and university websites
- **GrantBot**: Monitors government and foundation grant opportunities
- **JobBot**: Aggregates job postings from multiple job boards
- **VolunteerBot**: Discovers volunteer and community service opportunities

### Payment & Subscription System
- **Stripe Integration**: Secure payment processing for credit purchases
- **Flexible Packages**: Starter (25 credits), Student (100 credits), Premium (250 credits)
- **Subscription Plans**: Monthly and yearly billing with automatic credit allocation
- **Payment Methods**: Credit cards, PayPal, and other payment options

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── dashboards/
│   ├── StudentDashboard.tsx
│   ├── BusinessDashboard.tsx
│   ├── JobSeekerDashboard.tsx
│   └── GeneralDashboard.tsx
├── components/
│   ├── CreditPurchaseModal.tsx
│   ├── SearchInterface.tsx
│   └── OpportunityCard.tsx
└── services/
    ├── api.ts
    ├── auth.ts
    └── credits.ts
```

### Backend (FastAPI + Python)
```
backend/
├── app/
│   ├── api/v1/
│   │   ├── dashboard.py
│   │   ├── credits.py
│   │   └── search.py
│   ├── models/
│   │   ├── dashboard.py
│   │   └── credits.py
│   ├── services/
│   │   ├── dashboard_service.py
│   │   ├── credit_service.py
│   │   └── micro_bots.py
│   └── core/
│       ├── config.py
│       ├── database.py
│       └── auth.py
└── requirements.txt
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- Redis 6+
- Stripe Account

### Frontend Setup
```bash
cd /workspace/granada
npm install
npm run dev
```

### Backend Setup
```bash
cd /workspace/granada/backend
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:password@localhost/granada_db"
export STRIPE_SECRET_KEY="sk_test_..."
export STRIPE_PUBLISHABLE_KEY="pk_test_..."
export SECRET_KEY="your-secret-key"

# Run the API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Database Setup
```sql
-- Create database
CREATE DATABASE granada_db;

-- The application will automatically create tables on startup
```

## 📊 API Endpoints

### Dashboard APIs
- `GET /api/v1/dashboard/stats/{user_type}` - Get dashboard statistics
- `GET /api/v1/dashboard/profile` - Get user profile
- `PUT /api/v1/dashboard/profile/{user_type}` - Update user profile
- `POST /api/v1/dashboard/opportunities/search` - Search opportunities
- `GET /api/v1/dashboard/opportunities/recommended` - Get recommended opportunities

### Credit System APIs
- `GET /api/v1/credits/balance` - Get credit balance
- `GET /api/v1/credits/packages` - Get available credit packages
- `POST /api/v1/credits/payment-intent` - Create payment intent
- `POST /api/v1/credits/purchase` - Complete credit purchase
- `POST /api/v1/credits/use` - Use credits for actions

### Search APIs
- `POST /api/v1/search/live-search` - Enhanced search with micro bots
- `GET /api/v1/search/real-time-opportunities` - Real-time opportunity discovery
- `GET /api/v1/search/suggestions` - Get search suggestions
- `GET /api/v1/search/trending-searches` - Get trending searches

## 🤖 Micro Bots System

### Bot Architecture
Each micro bot is designed to scrape specific sources:

```python
class MicroBot:
    async def scrape(self) -> List[Dict[str, Any]]:
        # Fetch and parse opportunities
        pass
    
    async def parse_opportunities(self, html: str) -> List[Dict[str, Any]]:
        # Extract structured data from HTML
        pass
```

### Supported Sources
- **Scholarships**: Scholarships.com, FastWeb, College Board
- **Grants**: Grants.gov, Foundation Directory, SBIR
- **Jobs**: Indeed, LinkedIn, Glassdoor, AngelList
- **Volunteer**: VolunteerMatch, JustServe, Idealist

### Rate Limiting & Ethics
- Respectful scraping with delays between requests
- User-Agent rotation and proxy support
- Compliance with robots.txt and terms of service
- Caching to minimize redundant requests

## 💳 Credit System

### Credit Costs
| Action | Credits | Description |
|--------|---------|-------------|
| Basic Search | 1 | Database search only |
| Advanced Search | 3 | Database + basic filters |
| Live Search | 5 | Real-time micro bot scraping |
| AI Assistance | 5 | AI-powered recommendations |
| Document Generation | 10 | Auto-generate applications |
| Premium Features | 15+ | Expert review, priority support |

### Credit Packages
| Package | Credits | Price | Savings |
|---------|---------|-------|---------|
| Starter | 25 | $9.99 | - |
| Student | 100 | $29.99 | 25% |
| Premium | 250 | $59.99 | 40% |

### Subscription Plans
| Plan | Monthly Credits | Monthly Price | Yearly Price |
|------|----------------|---------------|--------------|
| Basic | 50 | $19.99 | $199.99 |
| Pro | 200 | $49.99 | $499.99 |
| Enterprise | 1000 | $199.99 | $1999.99 |

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

### Payment Security
- PCI DSS compliant via Stripe
- Encrypted payment data
- Secure webhook handling
- Fraud detection

### Data Protection
- GDPR compliance
- Data encryption at rest
- Secure API endpoints
- Rate limiting and DDoS protection

## 📈 Analytics & Monitoring

### User Analytics
- Search patterns and preferences
- Credit usage optimization
- Opportunity match success rates
- Application conversion tracking

### System Monitoring
- Bot performance and success rates
- API response times and errors
- Database query optimization
- Credit system health

## 🚀 Deployment

### Production Environment
```bash
# Build frontend
npm run build

# Deploy backend with Docker
docker build -t granada-api .
docker run -p 8000:8000 granada-api

# Set up reverse proxy (Nginx)
# Configure SSL certificates
# Set up monitoring and logging
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost/granada_db

# Security
SECRET_KEY=your-secret-key-here
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🧪 Testing

### Frontend Testing
```bash
npm run test
npm run test:e2e
```

### Backend Testing
```bash
pytest tests/
pytest tests/ --cov=app
```

### Load Testing
```bash
# Test API endpoints
locust -f tests/load_test.py --host=http://localhost:8000
```

## 📚 Usage Examples

### Student Dashboard
```typescript
// Search for scholarships
const searchResults = await api.post('/dashboard/opportunities/search', {
  query: 'computer science scholarship',
  filters: {
    opportunity_type: 'scholarship',
    amount_min: 1000,
    deadline_after: '2025-07-01'
  }
});

// Apply for scholarship
await api.post('/dashboard/applications', {
  opportunity_id: scholarship.id,
  notes: 'Interested in this opportunity'
});
```

### Credit Purchase
```typescript
// Create payment intent
const paymentIntent = await api.post('/credits/payment-intent', {
  package_id: 2 // Student package
});

// Process payment with Stripe
const stripe = new Stripe(publishableKey);
await stripe.confirmCardPayment(paymentIntent.client_secret);
```

### Micro Bot Search
```python
# Run targeted search
orchestrator = MicroBotOrchestrator(db)
results = await orchestrator.targeted_search(
    query="AI research fellowship",
    opportunity_type=OpportunityType.SCHOLARSHIP
)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Follow TypeScript/Python best practices
- Write comprehensive tests
- Document API changes
- Respect rate limits when adding new bots

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Documentation: `/docs`
- API Reference: `/api/v1/docs`
- Issues: GitHub Issues
- Email: support@granada-dashboard.com

## 🔮 Roadmap

### Q3 2025
- [ ] Mobile app development
- [ ] Advanced AI matching algorithms
- [ ] Integration with university systems
- [ ] Bulk application features

### Q4 2025
- [ ] International opportunity sources
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Enterprise features

### 2026
- [ ] Machine learning recommendations
- [ ] Blockchain-based verification
- [ ] API marketplace for third-party bots
- [ ] White-label solutions

---

Built with ❤️ by the Granada Team