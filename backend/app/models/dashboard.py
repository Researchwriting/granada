from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UserType(enum.Enum):
    STUDENT = "student"
    BUSINESS = "business"
    JOB_SEEKER = "job_seeker"
    GENERAL = "general"

class OpportunityType(enum.Enum):
    SCHOLARSHIP = "scholarship"
    GRANT = "grant"
    JOB = "job"
    VOLUNTEER = "volunteer"
    TRAINING = "training"

class ApplicationStatus(enum.Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    OFFER = "offer"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    user_type = Column(Enum(UserType))
    phone = Column(String)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    applications = relationship("Application", back_populates="user")
    saved_opportunities = relationship("SavedOpportunity", back_populates="user")
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    business_profile = relationship("BusinessProfile", back_populates="user", uselist=False)
    job_seeker_profile = relationship("JobSeekerProfile", back_populates="user", uselist=False)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    university = Column(String)
    major = Column(String)
    gpa = Column(Float)
    graduation_year = Column(Integer)
    academic_level = Column(String)  # undergraduate, graduate, phd
    
    user = relationship("User", back_populates="student_profile")

class BusinessProfile(Base):
    __tablename__ = "business_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company_name = Column(String)
    industry = Column(String)
    employee_count = Column(String)
    annual_revenue = Column(String)
    duns_number = Column(String)
    naics_code = Column(String)
    company_description = Column(Text)
    
    user = relationship("User", back_populates="business_profile")

class JobSeekerProfile(Base):
    __tablename__ = "job_seeker_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    current_title = Column(String)
    experience_level = Column(String)
    skills = Column(Text)  # JSON string of skills array
    professional_summary = Column(Text)
    desired_salary_min = Column(Integer)
    desired_salary_max = Column(Integer)
    
    user = relationship("User", back_populates="job_seeker_profile")

class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    organization = Column(String)
    opportunity_type = Column(Enum(OpportunityType))
    amount = Column(String)
    location = Column(String)
    deadline = Column(DateTime)
    description = Column(Text)
    requirements = Column(Text)  # JSON string of requirements array
    category = Column(String)
    posted_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    external_url = Column(String)
    
    # Relationships
    applications = relationship("Application", back_populates="opportunity")
    saved_by = relationship("SavedOpportunity", back_populates="opportunity")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    submitted_date = Column(DateTime, default=datetime.utcnow)
    next_step = Column(String)
    notes = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")

class SavedOpportunity(Base):
    __tablename__ = "saved_opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    saved_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="saved_opportunities")
    opportunity = relationship("Opportunity", back_populates="saved_by")

class TrainingProgram(Base):
    __tablename__ = "training_programs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    provider = Column(String)
    duration = Column(String)
    cost = Column(String)
    category = Column(String)
    description = Column(Text)
    funding_available = Column(Boolean, default=False)
    location = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=True)

class UserActivity(Base):
    __tablename__ = "user_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_type = Column(String)  # search, apply, save, view
    activity_data = Column(Text)  # JSON string with activity details
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")

class MatchScore(Base):
    __tablename__ = "match_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    score = Column(Float)  # 0-100 match percentage
    factors = Column(Text)  # JSON string with matching factors
    calculated_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    opportunity = relationship("Opportunity")