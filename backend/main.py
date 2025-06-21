from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn

from core.config import settings
from core.database import engine, Base
from api.routes import auth, users, organizations, proposals, donors, projects, ai_assistant
from core.auth import get_current_user

# Create tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Granada API",
    description="Operating System for Impact - Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(organizations.router, prefix="/api/organizations", tags=["Organizations"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["Proposals"])
app.include_router(donors.router, prefix="/api/donors", tags=["Donors"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(ai_assistant.router, prefix="/api/ai", tags=["AI Assistant"])

@app.get("/")
async def root():
    return {"message": "Granada API - Operating System for Impact"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/api/dashboard/pulse")
async def get_dashboard_pulse(current_user = Depends(get_current_user)):
    """Get Granada Pulse data for dashboard"""
    # This would typically fetch real data from database
    return {
        "active_proposals": 7,
        "open_opportunities": 142,
        "funding_secured_ytd": 1800000,
        "next_deadline": {
            "donor": "UNDP",
            "call": "Climate Action",
            "days_remaining": 3
        },
        "trends": {
            "proposals": {"change": 2, "direction": "up"},
            "opportunities": {"change": 3, "direction": "up"},
            "funding": {"change": 15.4, "direction": "up"}
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )