import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.parser import PDFExtractionService
from app.services.matcher import AnalysisEngineService
from app.models.schemas import CompleteAnalysisResponse
from app.routes.auth import get_current_user, oauth2_scheme
from app.models.db_models import ResumeAnalysis, User
from app.services.auth_service import AuthService

# Initialize a clean FastAPI sub-router for analysis operations
router = APIRouter(
    prefix="/api/v1",
    tags=["Analysis Engine Layer"]
)

# Instantiate our service singleton class
ai_engine = AnalysisEngineService()

# Pydantic schema for history item response
class AnalysisHistoryItem(BaseModel):
    id: int
    candidate_name: Optional[str]
    target_company: str
    resume_filename: str
    match_score: float
    created_at: datetime

    class Config:
        from_attributes = True

async def get_optional_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    """Optional JWT auth helper that returns the User if a valid token is provided, else None."""
    if not token:
        return None
    try:
        payload = AuthService.decode_access_token(token)
        if payload is None:
            return None
        email = payload.get("sub")
        if not email:
            return None
        return db.query(User).filter(User.email == email).first()
    except Exception:
        return None

@router.post("/analyze", response_model=CompleteAnalysisResponse)
async def analyze_resume_route(
    file: UploadFile = File(..., description="The candidate's raw resume PDF document file stream"),
    job_description: str = Form(..., description="The raw textual requirements block of the target job description"),
    target_company: str = Form(..., description="The exact corporate name of the target hiring entity"),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    """
    Primary API Endpoint. Receives multi-part Form-Data from a client frontend,
    pipes it through the extraction engine and the structured AI analytics generator, 
    and transfers back a production-ready JSON package.
    
    If the request has a Bearer token in the headers, it will automatically save 
    the result to the user's matching history.
    """
    # Phase 1: Extract characters safely from the incoming binary stream
    raw_resume_text = await PDFExtractionService.extract_text_from_upload(file)
    
    # Phase 2: Orchestrate structural evaluation via Gemini parsed models
    final_analysis_str = await ai_engine.generate_complete_analysis(
        resume_text=raw_resume_text,
        job_description=job_description,
        target_company=target_company
    )
    
    # Phase 3: Parse the string to dictionary to satisfy Pydantic and save to database if user is logged in
    try:
        analysis_data_dict = json.loads(final_analysis_str)
    except Exception as e:
        print(f"🚨 Failed to parse Gemini response as JSON: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="The AI engine generated an invalid output format. Please try again."
        )

    # Extract candidate name from personal_info if present
    candidate_name = analysis_data_dict.get("personal_info", {}).get("name")
    match_score = float(analysis_data_dict.get("overall_match_percentage", 0.0))

    if user:
        # Save analysis to user's history in DB
        db_analysis = ResumeAnalysis(
            user_id=user.id,
            candidate_name=candidate_name,
            target_company=target_company,
            job_description=job_description,
            resume_filename=file.filename,
            match_score=match_score,
            analysis_data=final_analysis_str
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        print(f"[SAVED] Analysis #{db_analysis.id} stored in history for user: {user.email}")

    # Return the fully structured, Pydantic-validated payload object
    return analysis_data_dict

@router.get("/history", response_model=List[AnalysisHistoryItem])
def get_user_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve history of all past analysis jobs run by the user."""
    analyses = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).order_by(ResumeAnalysis.created_at.desc()).all()
    return analyses

@router.get("/history/{analysis_id}", response_model=CompleteAnalysisResponse)
def get_history_detail(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve details of a specific past analysis job."""
    analysis = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == analysis_id, 
        ResumeAnalysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Matching history item not found."
        )
        
    try:
        return json.loads(analysis.analysis_data)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Corrupted history data storage. Cannot parse response."
        )

@router.delete("/history/{analysis_id}")
def delete_history_item(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a past matching run from user history."""
    analysis = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == analysis_id, 
        ResumeAnalysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Matching history item not found."
        )
        
    db.delete(analysis)
    db.commit()
    return {"status": "success", "message": "History item deleted successfully."}