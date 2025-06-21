from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json

from ..models.dashboard import (
    User, StudentProfile, BusinessProfile, JobSeekerProfile,
    Opportunity, Application, SavedOpportunity, TrainingProgram,
    UserActivity, MatchScore, OpportunityType, ApplicationStatus
)
from ..schemas.dashboard import (
    OpportunitySearch, OpportunityFilter, UserActivityCreate,
    StudentDashboardStats, BusinessDashboardStats, JobSeekerDashboardStats
)

class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    # User Profile Services
    def get_user_profile(self, user_id: int, user_type: str):
        """Get user profile based on user type"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
            
        profile_data = {"user": user}
        
        if user_type == "student":
            profile = self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
            profile_data["profile"] = profile
        elif user_type == "business":
            profile = self.db.query(BusinessProfile).filter(BusinessProfile.user_id == user_id).first()
            profile_data["profile"] = profile
        elif user_type == "job_seeker":
            profile = self.db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == user_id).first()
            profile_data["profile"] = profile
            
        return profile_data

    def update_student_profile(self, user_id: int, profile_data: dict):
        """Update student profile"""
        profile = self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        if not profile:
            profile = StudentProfile(user_id=user_id)
            self.db.add(profile)
        
        for key, value in profile_data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_business_profile(self, user_id: int, profile_data: dict):
        """Update business profile"""
        profile = self.db.query(BusinessProfile).filter(BusinessProfile.user_id == user_id).first()
        if not profile:
            profile = BusinessProfile(user_id=user_id)
            self.db.add(profile)
        
        for key, value in profile_data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_job_seeker_profile(self, user_id: int, profile_data: dict):
        """Update job seeker profile"""
        profile = self.db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == user_id).first()
        if not profile:
            profile = JobSeekerProfile(user_id=user_id)
            self.db.add(profile)
        
        for key, value in profile_data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        
        self.db.commit()
        self.db.refresh(profile)
        return profile

    # Opportunity Services
    def search_opportunities(self, search_params: OpportunitySearch, user_id: Optional[int] = None):
        """Search opportunities with filters and matching"""
        query = self.db.query(Opportunity).filter(Opportunity.is_active == True)
        
        # Apply text search
        if search_params.query:
            search_term = f"%{search_params.query}%"
            query = query.filter(
                or_(
                    Opportunity.title.ilike(search_term),
                    Opportunity.description.ilike(search_term),
                    Opportunity.organization.ilike(search_term),
                    Opportunity.category.ilike(search_term)
                )
            )
        
        # Apply filters
        if search_params.filters:
            filters = search_params.filters
            
            if filters.opportunity_type:
                query = query.filter(Opportunity.opportunity_type == filters.opportunity_type)
            
            if filters.category:
                query = query.filter(Opportunity.category.ilike(f"%{filters.category}%"))
            
            if filters.location:
                query = query.filter(Opportunity.location.ilike(f"%{filters.location}%"))
            
            if filters.deadline_after:
                query = query.filter(Opportunity.deadline >= filters.deadline_after)
            
            if filters.deadline_before:
                query = query.filter(Opportunity.deadline <= filters.deadline_before)
        
        # Get total count
        total = query.count()
        
        # Apply pagination and ordering
        opportunities = query.order_by(desc(Opportunity.posted_date))\
                           .offset(search_params.offset)\
                           .limit(search_params.limit)\
                           .all()
        
        # Add match scores if user is provided
        if user_id:
            opportunities_with_match = []
            for opp in opportunities:
                match_score = self.calculate_match_score(user_id, opp.id)
                opp_dict = opp.__dict__.copy()
                opp_dict['match_percentage'] = match_score
                opportunities_with_match.append(opp_dict)
            opportunities = opportunities_with_match
        
        return {
            "opportunities": opportunities,
            "total": total,
            "has_more": total > (search_params.offset + search_params.limit)
        }

    def get_recommended_opportunities(self, user_id: int, limit: int = 10):
        """Get recommended opportunities for user"""
        # Get user's match scores
        match_scores = self.db.query(MatchScore)\
                             .filter(MatchScore.user_id == user_id)\
                             .order_by(desc(MatchScore.score))\
                             .limit(limit)\
                             .all()
        
        opportunity_ids = [ms.opportunity_id for ms in match_scores]
        
        if not opportunity_ids:
            # Fallback to recent opportunities
            return self.db.query(Opportunity)\
                         .filter(Opportunity.is_active == True)\
                         .order_by(desc(Opportunity.posted_date))\
                         .limit(limit)\
                         .all()
        
        opportunities = self.db.query(Opportunity)\
                              .filter(Opportunity.id.in_(opportunity_ids))\
                              .filter(Opportunity.is_active == True)\
                              .all()
        
        # Add match scores
        for opp in opportunities:
            match = next((ms for ms in match_scores if ms.opportunity_id == opp.id), None)
            opp.match_percentage = match.score if match else 0
        
        return sorted(opportunities, key=lambda x: x.match_percentage, reverse=True)

    # Application Services
    def create_application(self, user_id: int, opportunity_id: int, notes: Optional[str] = None):
        """Create a new application"""
        # Check if application already exists
        existing = self.db.query(Application)\
                         .filter(Application.user_id == user_id)\
                         .filter(Application.opportunity_id == opportunity_id)\
                         .first()
        
        if existing:
            raise ValueError("Application already exists for this opportunity")
        
        application = Application(
            user_id=user_id,
            opportunity_id=opportunity_id,
            notes=notes,
            status=ApplicationStatus.PENDING
        )
        
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        
        # Log activity
        self.log_user_activity(user_id, "apply", {
            "opportunity_id": opportunity_id,
            "application_id": application.id
        })
        
        return application

    def get_user_applications(self, user_id: int, status: Optional[ApplicationStatus] = None):
        """Get user's applications"""
        query = self.db.query(Application).filter(Application.user_id == user_id)
        
        if status:
            query = query.filter(Application.status == status)
        
        return query.order_by(desc(Application.submitted_date)).all()

    def update_application_status(self, application_id: int, status: ApplicationStatus, next_step: Optional[str] = None):
        """Update application status"""
        application = self.db.query(Application).filter(Application.id == application_id).first()
        if not application:
            return None
        
        application.status = status
        if next_step:
            application.next_step = next_step
        
        self.db.commit()
        self.db.refresh(application)
        return application

    # Saved Opportunities Services
    def save_opportunity(self, user_id: int, opportunity_id: int):
        """Save an opportunity for later"""
        # Check if already saved
        existing = self.db.query(SavedOpportunity)\
                         .filter(SavedOpportunity.user_id == user_id)\
                         .filter(SavedOpportunity.opportunity_id == opportunity_id)\
                         .first()
        
        if existing:
            return existing
        
        saved = SavedOpportunity(user_id=user_id, opportunity_id=opportunity_id)
        self.db.add(saved)
        self.db.commit()
        self.db.refresh(saved)
        
        # Log activity
        self.log_user_activity(user_id, "save", {"opportunity_id": opportunity_id})
        
        return saved

    def get_saved_opportunities(self, user_id: int):
        """Get user's saved opportunities"""
        return self.db.query(SavedOpportunity)\
                     .filter(SavedOpportunity.user_id == user_id)\
                     .order_by(desc(SavedOpportunity.saved_date))\
                     .all()

    def remove_saved_opportunity(self, user_id: int, opportunity_id: int):
        """Remove saved opportunity"""
        saved = self.db.query(SavedOpportunity)\
                      .filter(SavedOpportunity.user_id == user_id)\
                      .filter(SavedOpportunity.opportunity_id == opportunity_id)\
                      .first()
        
        if saved:
            self.db.delete(saved)
            self.db.commit()
            return True
        return False

    # Training Programs Services
    def get_training_programs(self, category: Optional[str] = None, funding_available: Optional[bool] = None):
        """Get training programs"""
        query = self.db.query(TrainingProgram).filter(TrainingProgram.is_active == True)
        
        if category:
            query = query.filter(TrainingProgram.category.ilike(f"%{category}%"))
        
        if funding_available is not None:
            query = query.filter(TrainingProgram.funding_available == funding_available)
        
        return query.order_by(TrainingProgram.title).all()

    # Dashboard Stats Services
    def get_student_dashboard_stats(self, user_id: int) -> StudentDashboardStats:
        """Get dashboard statistics for students"""
        total_applications = self.db.query(Application)\
                                   .filter(Application.user_id == user_id)\
                                   .count()
        
        approved_applications = self.db.query(Application)\
                                      .filter(Application.user_id == user_id)\
                                      .filter(Application.status == ApplicationStatus.APPROVED)\
                                      .count()
        
        pending_applications = self.db.query(Application)\
                                     .filter(Application.user_id == user_id)\
                                     .filter(Application.status.in_([
                                         ApplicationStatus.PENDING,
                                         ApplicationStatus.UNDER_REVIEW
                                     ]))\
                                     .count()
        
        # Calculate total funding from approved applications
        approved_apps = self.db.query(Application)\
                              .join(Opportunity)\
                              .filter(Application.user_id == user_id)\
                              .filter(Application.status == ApplicationStatus.APPROVED)\
                              .all()
        
        total_funding = 0
        for app in approved_apps:
            if app.opportunity.amount:
                # Extract numeric value from amount string
                amount_str = app.opportunity.amount.replace('$', '').replace(',', '')
                try:
                    amount = float(amount_str.split('-')[0].strip())
                    total_funding += amount
                except:
                    pass
        
        success_rate = (approved_applications / total_applications * 100) if total_applications > 0 else 0
        
        return StudentDashboardStats(
            total_applications=total_applications,
            approved_applications=approved_applications,
            pending_applications=pending_applications,
            awards_won=approved_applications,
            pending_reviews=pending_applications,
            total_funding=f"${total_funding:,.0f}" if total_funding > 0 else None,
            success_rate=round(success_rate, 1)
        )

    def get_business_dashboard_stats(self, user_id: int) -> BusinessDashboardStats:
        """Get dashboard statistics for businesses"""
        total_applications = self.db.query(Application)\
                                   .filter(Application.user_id == user_id)\
                                   .count()
        
        approved_applications = self.db.query(Application)\
                                      .filter(Application.user_id == user_id)\
                                      .filter(Application.status == ApplicationStatus.APPROVED)\
                                      .count()
        
        pending_applications = self.db.query(Application)\
                                     .filter(Application.user_id == user_id)\
                                     .filter(Application.status.in_([
                                         ApplicationStatus.PENDING,
                                         ApplicationStatus.UNDER_REVIEW
                                     ]))\
                                     .count()
        
        # Calculate average review days
        completed_apps = self.db.query(Application)\
                               .filter(Application.user_id == user_id)\
                               .filter(Application.status.in_([
                                   ApplicationStatus.APPROVED,
                                   ApplicationStatus.REJECTED
                               ]))\
                               .all()
        
        if completed_apps:
            total_days = sum([(app.updated_at - app.submitted_date).days for app in completed_apps])
            avg_review_days = total_days // len(completed_apps)
        else:
            avg_review_days = None
        
        success_rate = (approved_applications / total_applications * 100) if total_applications > 0 else 0
        
        return BusinessDashboardStats(
            total_applications=total_applications,
            approved_applications=approved_applications,
            pending_applications=pending_applications,
            grants_awarded=approved_applications,
            avg_review_days=avg_review_days,
            success_rate=round(success_rate, 1)
        )

    def get_job_seeker_dashboard_stats(self, user_id: int) -> JobSeekerDashboardStats:
        """Get dashboard statistics for job seekers"""
        total_applications = self.db.query(Application)\
                                   .filter(Application.user_id == user_id)\
                                   .count()
        
        approved_applications = self.db.query(Application)\
                                      .filter(Application.user_id == user_id)\
                                      .filter(Application.status == ApplicationStatus.APPROVED)\
                                      .count()
        
        pending_applications = self.db.query(Application)\
                                     .filter(Application.user_id == user_id)\
                                     .filter(Application.status.in_([
                                         ApplicationStatus.PENDING,
                                         ApplicationStatus.UNDER_REVIEW
                                     ]))\
                                     .count()
        
        interviews = self.db.query(Application)\
                           .filter(Application.user_id == user_id)\
                           .filter(Application.status == ApplicationStatus.INTERVIEW_SCHEDULED)\
                           .count()
        
        job_offers = self.db.query(Application)\
                           .filter(Application.user_id == user_id)\
                           .filter(Application.status == ApplicationStatus.OFFER)\
                           .count()
        
        # Calculate response rate (applications that got any response)
        responded_apps = self.db.query(Application)\
                               .filter(Application.user_id == user_id)\
                               .filter(Application.status != ApplicationStatus.PENDING)\
                               .count()
        
        response_rate = (responded_apps / total_applications * 100) if total_applications > 0 else 0
        
        return JobSeekerDashboardStats(
            total_applications=total_applications,
            approved_applications=approved_applications,
            pending_applications=pending_applications,
            interviews=interviews,
            job_offers=job_offers,
            response_rate=round(response_rate, 1)
        )

    # Activity Logging
    def log_user_activity(self, user_id: int, activity_type: str, activity_data: Dict[str, Any]):
        """Log user activity"""
        activity = UserActivity(
            user_id=user_id,
            activity_type=activity_type,
            activity_data=json.dumps(activity_data)
        )
        
        self.db.add(activity)
        self.db.commit()

    def get_user_activities(self, user_id: int, limit: int = 50):
        """Get user activities"""
        activities = self.db.query(UserActivity)\
                           .filter(UserActivity.user_id == user_id)\
                           .order_by(desc(UserActivity.timestamp))\
                           .limit(limit)\
                           .all()
        
        # Parse activity_data JSON
        for activity in activities:
            try:
                activity.activity_data = json.loads(activity.activity_data)
            except:
                activity.activity_data = {}
        
        return activities

    # Match Score Calculation
    def calculate_match_score(self, user_id: int, opportunity_id: int) -> float:
        """Calculate match score between user and opportunity"""
        # Check if score already exists and is recent
        existing_score = self.db.query(MatchScore)\
                               .filter(MatchScore.user_id == user_id)\
                               .filter(MatchScore.opportunity_id == opportunity_id)\
                               .filter(MatchScore.calculated_at > datetime.utcnow() - timedelta(days=1))\
                               .first()
        
        if existing_score:
            return existing_score.score
        
        # Calculate new score
        user = self.db.query(User).filter(User.id == user_id).first()
        opportunity = self.db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
        
        if not user or not opportunity:
            return 0.0
        
        score = 50.0  # Base score
        factors = []
        
        # Location matching
        if user.location and opportunity.location:
            if user.location.lower() in opportunity.location.lower() or \
               opportunity.location.lower() in user.location.lower() or \
               opportunity.location.lower() == "remote" or \
               opportunity.location.lower() == "nationwide":
                score += 20
                factors.append("location_match")
        
        # User type specific matching
        if user.user_type == "student":
            student_profile = self.db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
            if student_profile and opportunity.opportunity_type == OpportunityType.SCHOLARSHIP:
                score += 15
                factors.append("user_type_match")
                
                # Major matching
                if student_profile.major and opportunity.category:
                    if student_profile.major.lower() in opportunity.category.lower():
                        score += 10
                        factors.append("major_match")
        
        elif user.user_type == "business":
            if opportunity.opportunity_type == OpportunityType.GRANT:
                score += 15
                factors.append("user_type_match")
        
        elif user.user_type == "job_seeker":
            if opportunity.opportunity_type == OpportunityType.JOB:
                score += 15
                factors.append("user_type_match")
                
                job_profile = self.db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == user_id).first()
                if job_profile and job_profile.skills:
                    try:
                        skills = json.loads(job_profile.skills)
                        if any(skill.lower() in opportunity.description.lower() for skill in skills):
                            score += 10
                            factors.append("skills_match")
                    except:
                        pass
        
        # Deadline urgency (closer deadlines get slightly higher scores)
        days_until_deadline = (opportunity.deadline - datetime.utcnow()).days
        if days_until_deadline <= 30:
            score += 5
            factors.append("deadline_urgency")
        
        # Cap the score at 100
        score = min(score, 100.0)
        
        # Save the calculated score
        match_score = MatchScore(
            user_id=user_id,
            opportunity_id=opportunity_id,
            score=score,
            factors=json.dumps(factors)
        )
        
        self.db.add(match_score)
        self.db.commit()
        
        return score