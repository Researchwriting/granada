from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class UserType(str, Enum):
    STUDENT = "student"
    BUSINESS = "business"
    JOB_SEEKER = "job_seeker"
    GENERAL = "general"

class OpportunityType(str, Enum):
    SCHOLARSHIP = "scholarship"
    GRANT = "grant"
    JOB = "job"
    VOLUNTEER = "volunteer"
    TRAINING = "training"

class ApplicationStatus(str, Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    OFFER = "offer"

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    user_type: UserType
    phone: Optional[str] = None
    location: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

# Profile Schemas
class StudentProfileBase(BaseModel):
    university: Optional[str] = None
    major: Optional[str] = None
    gpa: Optional[float] = None
    graduation_year: Optional[int] = None
    academic_level: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfile(StudentProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class BusinessProfileBase(BaseModel):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    employee_count: Optional[str] = None
    annual_revenue: Optional[str] = None
    duns_number: Optional[str] = None
    naics_code: Optional[str] = None
    company_description: Optional[str] = None

class BusinessProfileCreate(BusinessProfileBase):
    pass

class BusinessProfileUpdate(BusinessProfileBase):
    pass

class BusinessProfile(BusinessProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class JobSeekerProfileBase(BaseModel):
    current_title: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[str] = None  # JSON string
    professional_summary: Optional[str] = None
    desired_salary_min: Optional[int] = None
    desired_salary_max: Optional[int] = None

class JobSeekerProfileCreate(JobSeekerProfileBase):
    pass

class JobSeekerProfileUpdate(JobSeekerProfileBase):
    pass

class JobSeekerProfile(JobSeekerProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Opportunity Schemas
class OpportunityBase(BaseModel):
    title: str
    organization: str
    opportunity_type: OpportunityType
    amount: Optional[str] = None
    location: str
    deadline: datetime
    description: str
    requirements: Optional[str] = None  # JSON string
    category: str
    external_url: Optional[str] = None

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    amount: Optional[str] = None
    location: Optional[str] = None
    deadline: Optional[datetime] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    category: Optional[str] = None
    external_url: Optional[str] = None
    is_active: Optional[bool] = None

class Opportunity(OpportunityBase):
    id: int
    posted_date: datetime
    is_active: bool

    class Config:
        from_attributes = True

class OpportunityWithMatch(Opportunity):
    match_percentage: Optional[float] = None

# Application Schemas
class ApplicationBase(BaseModel):
    opportunity_id: int
    notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    next_step: Optional[str] = None
    notes: Optional[str] = None

class Application(ApplicationBase):
    id: int
    user_id: int
    status: ApplicationStatus
    submitted_date: datetime
    next_step: Optional[str] = None
    opportunity: Opportunity

    class Config:
        from_attributes = True

# Training Program Schemas
class TrainingProgramBase(BaseModel):
    title: str
    provider: str
    duration: str
    cost: str
    category: str
    description: str
    funding_available: bool = False
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class TrainingProgramCreate(TrainingProgramBase):
    pass

class TrainingProgram(TrainingProgramBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Dashboard Stats Schemas
class DashboardStats(BaseModel):
    total_applications: int
    approved_applications: int
    pending_applications: int
    total_funding: Optional[str] = None
    success_rate: Optional[float] = None

class StudentDashboardStats(DashboardStats):
    awards_won: int
    pending_reviews: int

class BusinessDashboardStats(DashboardStats):
    grants_awarded: int
    avg_review_days: Optional[int] = None

class JobSeekerDashboardStats(DashboardStats):
    interviews: int
    job_offers: int
    response_rate: Optional[float] = None

# Search and Filter Schemas
class OpportunityFilter(BaseModel):
    opportunity_type: Optional[OpportunityType] = None
    category: Optional[str] = None
    location: Optional[str] = None
    min_amount: Optional[int] = None
    max_amount: Optional[int] = None
    deadline_before: Optional[datetime] = None
    deadline_after: Optional[datetime] = None

class OpportunitySearch(BaseModel):
    query: Optional[str] = None
    filters: Optional[OpportunityFilter] = None
    limit: int = 20
    offset: int = 0

# Response Schemas
class OpportunityListResponse(BaseModel):
    opportunities: List[OpportunityWithMatch]
    total: int
    has_more: bool

class ApplicationListResponse(BaseModel):
    applications: List[Application]
    total: int

class TrainingProgramListResponse(BaseModel):
    programs: List[TrainingProgram]
    total: int

# Activity Schemas
class UserActivityCreate(BaseModel):
    activity_type: str
    activity_data: Dict[str, Any]

class UserActivity(BaseModel):
    id: int
    user_id: int
    activity_type: str
    activity_data: Dict[str, Any]
    timestamp: datetime

    class Config:
        from_attributes = True

# Saved Opportunity Schemas
class SavedOpportunityCreate(BaseModel):
    opportunity_id: int

class SavedOpportunity(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    saved_date: datetime
    opportunity: Opportunity

    class Config:
        from_attributes = True