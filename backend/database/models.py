from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean, BigInteger, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class DonorOpportunity(Base):
    __tablename__ = "donor_opportunities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    description = Column(Text)
    deadline = Column(DateTime(timezone=True))
    amount_min = Column(BigInteger)
    amount_max = Column(BigInteger)
    currency = Column(String(10), default='USD')
    source_url = Column(Text, nullable=False)
    source_name = Column(String(200), nullable=False)
    country = Column(String(100), nullable=False)
    sector = Column(String(100))
    eligibility_criteria = Column(Text)
    application_process = Column(Text)
    contact_email = Column(String(200))
    contact_phone = Column(String(50))
    keywords = Column(JSONB)
    focus_areas = Column(JSONB)
    content_hash = Column(String(32), unique=True, nullable=False)
    scraped_at = Column(DateTime(timezone=True), default=func.now())
    last_verified = Column(DateTime(timezone=True))
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    verification_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

class SearchBot(Base):
    __tablename__ = "search_bots"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bot_id = Column(String(100), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    country = Column(String(100), nullable=False)
    status = Column(String(50), default='active')
    targets_config = Column(JSONB)
    last_run = Column(DateTime(timezone=True))
    total_opportunities_found = Column(Integer, default=0)
    total_reward_points = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    success_rate = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

class BotReward(Base):
    __tablename__ = "bot_rewards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bot_id = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    opportunities_found = Column(Integer, nullable=False)
    reward_points = Column(Integer, nullable=False)
    bonus_multiplier = Column(Float, default=1.0)
    awarded_at = Column(DateTime(timezone=True), default=func.now())
    notes = Column(Text)

class SearchTarget(Base):
    __tablename__ = "search_targets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    url = Column(Text, nullable=False)
    country = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)  # api, scraping, rss
    selectors = Column(JSONB)
    headers = Column(JSONB)
    rate_limit = Column(Integer, default=30)
    priority = Column(Integer, default=5)
    api_key = Column(String(500))
    is_active = Column(Boolean, default=True)
    success_rate = Column(Float, default=0.0)
    last_successful_run = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

class OpportunityVerification(Base):
    __tablename__ = "opportunity_verifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    opportunity_id = Column(UUID(as_uuid=True), nullable=False)
    verification_type = Column(String(50), nullable=False)  # url_check, content_analysis, deadline_validation
    status = Column(String(50), nullable=False)  # verified, failed, pending
    score = Column(Float, default=0.0)
    details = Column(JSONB)
    verified_at = Column(DateTime(timezone=True), default=func.now())
    verified_by = Column(String(100))  # bot_id or user_id

class SearchStatistics(Base):
    __tablename__ = "search_statistics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(DateTime(timezone=True), default=func.now())
    country = Column(String(100), nullable=False)
    source_name = Column(String(200), nullable=False)
    opportunities_found = Column(Integer, default=0)
    opportunities_verified = Column(Integer, default=0)
    success_rate = Column(Float, default=0.0)
    response_time_avg = Column(Float, default=0.0)
    errors_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=func.now())