from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    mission_statement = Column(Text)
    vision_statement = Column(Text)
    sector = Column(String)  # Education, Health, Environment, etc.
    country = Column(String)
    website = Column(String)
    registration_number = Column(String)
    
    # Brand Kit Data
    brand_colors = Column(JSON)  # {"primary": "#0ea5e9", "secondary": "#f97316"}
    logo_url = Column(String)
    brand_guidelines_url = Column(String)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="organization")
    proposals = relationship("Proposal", back_populates="organization")
    projects = relationship("Project", back_populates="organization")
    donor_interactions = relationship("DonorInteraction", back_populates="organization")