from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
import uvicorn
import os
from contextlib import asynccontextmanager

from .api.v1 import dashboard, credits, search
from .core.database import engine, Base
from .core.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Granada Dashboard API starting up...")
    yield
    # Shutdown
    print("📴 Granada Dashboard API shutting down...")

# Create FastAPI app
app = FastAPI(
    title="Granada Dashboard API",
    description="Comprehensive dashboard system for students, businesses, job seekers, and general users with credit-based search engine powered by micro bots",
    version="1.0.0",
    lifespan=lifespan
)

# Security
security = HTTPBearer()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Include routers
app.include_router(
    dashboard.router,
    prefix="/api/v1/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(security)]
)

app.include_router(
    credits.router,
    prefix="/api/v1/credits",
    tags=["Credits & Payments"],
    dependencies=[Depends(security)]
)

app.include_router(
    search.router,
    prefix="/api/v1/search",
    tags=["Search & Discovery"],
    dependencies=[Depends(security)]
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Granada Dashboard API",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Granada Dashboard API",
        "documentation": "/docs",
        "health": "/health",
        "version": "1.0.0",
        "features": [
            "Multi-user dashboards (Students, Business, Job Seekers, General)",
            "Credit-based search system",
            "Micro bots for real-time opportunity discovery",
            "Payment processing with Stripe",
            "Subscription management",
            "AI-powered matching",
            "Comprehensive analytics"
        ]
    }

# API Information endpoint
@app.get("/api/v1/info")
async def api_info():
    return {
        "api_version": "1.0.0",
        "endpoints": {
            "dashboard": {
                "base": "/api/v1/dashboard",
                "features": [
                    "User profiles by type",
                    "Dashboard statistics",
                    "Opportunity management",
                    "Application tracking",
                    "Activity logging"
                ]
            },
            "credits": {
                "base": "/api/v1/credits",
                "features": [
                    "Credit balance management",
                    "Package purchases",
                    "Subscription plans",
                    "Payment processing",
                    "Usage tracking"
                ]
            },
            "search": {
                "base": "/api/v1/search",
                "features": [
                    "Live micro bot search",
                    "Real-time opportunities",
                    "Search suggestions",
                    "Trending analysis",
                    "Search analytics"
                ]
            }
        },
        "authentication": "Bearer token required",
        "rate_limits": "Credit-based system",
        "supported_user_types": ["student", "business", "job_seeker", "general"]
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "error": "Not Found",
        "message": "The requested resource was not found",
        "status_code": 404
    }

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {
        "error": "Internal Server Error",
        "message": "An unexpected error occurred",
        "status_code": 500
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )