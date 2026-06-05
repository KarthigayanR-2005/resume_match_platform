from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    analyses = relationship("ResumeAnalysis", back_populates="user", cascade="all, delete-orphan")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    candidate_name = Column(String, nullable=True)
    target_company = Column(String, nullable=False)
    job_description = Column(Text, nullable=False)
    resume_filename = Column(String, nullable=False)
    match_score = Column(Float, nullable=False)
    analysis_data = Column(Text, nullable=False) # Store serialized JSON of CompleteAnalysisResponse
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="analyses")
