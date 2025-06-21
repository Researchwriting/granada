from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.database import get_db
from ...core.auth import get_current_user
from ...services.dashboard_service import DashboardService
from ...schemas.dashboard import (
    User, StudentProfile, BusinessProfile, JobSeekerProfile,
    StudentProfileCreate, StudentProfileUpdate,
    BusinessProfileCreate, BusinessProfileUpdate,
    JobSeekerProfileCreate, JobSeekerProfileUpdate,
    OpportunitySearch, OpportunityListResponse,
    ApplicationCreate, ApplicationListResponse,
    TrainingProgramListResponse,
    SavedOpportunityCreate, SavedOpportunity,
    StudentDashboardStats, BusinessDashboardStats, JobSeekerDashboardStats,
    UserActivityCreate, UserActivity,
    OpportunityType, ApplicationStatus
)

router = APIRouter()

# Dashboard Stats Endpoints
@router.get("/stats/student", response_model=StudentDashboardStats)
async def get_student_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for students"""
    if current_user.user_type != "student":
        raise HTTPException(status_code=403, detail="Access denied")
    
    service = DashboardService(db)
    return service.get_student_dashboard_stats(current_user.id)

@router.get("/stats/business", response_model=BusinessDashboardStats)
async def get_business_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for businesses"""
    if current_user.user_type != "business":
        raise HTTPException(status_code=403, detail="Access denied")
    
    service = DashboardService(db)
    return service.get_business_dashboard_stats(current_user.id)

@router.get("/stats/job-seeker", response_model=JobSeekerDashboardStats)
async def get_job_seeker_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for job seekers"""
    if current_user.user_type != "job_seeker":
        raise HTTPException(status_code=403, detail="Access denied")
    
    service = DashboardService(db)
    return service.get_job_seeker_dashboard_stats(current_user.id)

# Profile Management Endpoints
@router.get("/profile")
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile based on user type"""
    service = DashboardService(db)
    return service.get_user_profile(current_user.id, current_user.user_type)

@router.put("/profile/student", response_model=StudentProfile)
async def update_student_profile(
    profile_data: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update student profile"""
    if current_user.user_type != "student":
        raise HTTPException(status_code=403, detail="Access denied")
    
    service = DashboardService(db)
    return service.update_student_profile(current_user.id, profile_data.dict(exclude_unset=True))

@router.put("/profile/business", response_model=BusinessProfile)
async def update_business_profile(
    profile_data: BusinessProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update business profile"""
    if current_user.user_type != "business":
        raise HTTPException(status_code=403, detail="Access denied")
    
    service = DashboardService(db)
    return service.update_business_profile(current_user.id, profile_data.dict(exclude_unset=True))

@router.put("/profile/job-seeker", response_model=JobSeekerProfile)
async def update_job_seeker_profile(
    profile_data: JobSeekerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update job seeker profile"""
    if current_user.user_type != "job_seeker":
        raise HTTPException(status_code=403, detail="Access denied")
    
    service = DashboardService(db)
    return service.update_job_seeker_profile(current_user.id, profile_data.dict(exclude_unset=True))

# Opportunity Search and Discovery
@router.post("/opportunities/search", response_model=OpportunityListResponse)
async def search_opportunities(
    search_params: OpportunitySearch,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search opportunities with filters and matching"""
    service = DashboardService(db)
    return service.search_opportunities(search_params, current_user.id)

@router.get("/opportunities/recommended")
async def get_recommended_opportunities(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recommended opportunities for user"""
    service = DashboardService(db)
    return service.get_recommended_opportunities(current_user.id, limit)

@router.get("/opportunities/scholarships", response_model=OpportunityListResponse)
async def get_scholarships(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get scholarship opportunities"""
    search_params = OpportunitySearch(
        filters={"opportunity_type": OpportunityType.SCHOLARSHIP},
        limit=limit,
        offset=offset
    )
    service = DashboardService(db)
    return service.search_opportunities(search_params, current_user.id)

@router.get("/opportunities/grants", response_model=OpportunityListResponse)
async def get_grants(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get grant opportunities"""
    search_params = OpportunitySearch(
        filters={"opportunity_type": OpportunityType.GRANT},
        limit=limit,
        offset=offset
    )
    service = DashboardService(db)
    return service.search_opportunities(search_params, current_user.id)

@router.get("/opportunities/jobs", response_model=OpportunityListResponse)
async def get_jobs(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get job opportunities"""
    search_params = OpportunitySearch(
        filters={"opportunity_type": OpportunityType.JOB},
        limit=limit,
        offset=offset
    )
    service = DashboardService(db)
    return service.search_opportunities(search_params, current_user.id)

# Application Management
@router.post("/applications")
async def create_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new application"""
    service = DashboardService(db)
    try:
        return service.create_application(
            current_user.id,
            application_data.opportunity_id,
            application_data.notes
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/applications", response_model=ApplicationListResponse)
async def get_user_applications(
    status: Optional[ApplicationStatus] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's applications"""
    service = DashboardService(db)
    applications = service.get_user_applications(current_user.id, status)
    return ApplicationListResponse(applications=applications, total=len(applications))

@router.put("/applications/{application_id}/status")
async def update_application_status(
    application_id: int,
    status: ApplicationStatus,
    next_step: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update application status (admin only)"""
    # This would typically require admin permissions
    service = DashboardService(db)
    application = service.update_application_status(application_id, status, next_step)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

# Saved Opportunities
@router.post("/saved-opportunities")
async def save_opportunity(
    save_data: SavedOpportunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save an opportunity for later"""
    service = DashboardService(db)
    return service.save_opportunity(current_user.id, save_data.opportunity_id)

@router.get("/saved-opportunities", response_model=List[SavedOpportunity])
async def get_saved_opportunities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's saved opportunities"""
    service = DashboardService(db)
    return service.get_saved_opportunities(current_user.id)

@router.delete("/saved-opportunities/{opportunity_id}")
async def remove_saved_opportunity(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove saved opportunity"""
    service = DashboardService(db)
    success = service.remove_saved_opportunity(current_user.id, opportunity_id)
    if not success:
        raise HTTPException(status_code=404, detail="Saved opportunity not found")
    return {"message": "Opportunity removed from saved list"}

# Training Programs
@router.get("/training-programs", response_model=TrainingProgramListResponse)
async def get_training_programs(
    category: Optional[str] = Query(None),
    funding_available: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get training programs"""
    service = DashboardService(db)
    programs = service.get_training_programs(category, funding_available)
    return TrainingProgramListResponse(programs=programs, total=len(programs))

# User Activity
@router.post("/activities")
async def log_user_activity(
    activity_data: UserActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log user activity"""
    service = DashboardService(db)
    service.log_user_activity(
        current_user.id,
        activity_data.activity_type,
        activity_data.activity_data
    )
    return {"message": "Activity logged successfully"}

@router.get("/activities", response_model=List[UserActivity])
async def get_user_activities(
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user activities"""
    service = DashboardService(db)
    return service.get_user_activities(current_user.id, limit)

# Match Score Calculation
@router.get("/opportunities/{opportunity_id}/match-score")
async def get_match_score(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get match score for a specific opportunity"""
    service = DashboardService(db)
    score = service.calculate_match_score(current_user.id, opportunity_id)
    return {"match_score": score}