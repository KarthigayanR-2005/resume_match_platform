from pydantic import BaseModel, Field
from typing import List, Optional

# ==========================================
# 1. CANDIDATE PROFILE EXTRACTION SCHEMAS
# ==========================================

class PersonalInfo(BaseModel):
    name: Optional[str] = Field(None, description="Extracted full name of the candidate")
    email: Optional[str] = Field(None, description="Extracted email address")
    phone: Optional[str] = Field(None, description="Extracted contact number")
    links: List[str] = Field(default=[], description="URLs to GitHub, LinkedIn, portfolios, etc.")

class SkillCategorization(BaseModel):
    languages: List[str] = Field(..., description="Programming languages (e.g., Python, C++, Java, JavaScript)")
    frameworks_and_libraries: List[str] = Field(..., description="Frameworks and libraries (e.g., FastAPI, Next.js, React, Node.js)")
    databases: List[str] = Field(..., description="Storage systems (e.g., PostgreSQL, Redis, MongoDB)")
    cloud_and_devops: List[str] = Field(..., description="DevOps and cloud tools (e.g., Docker, AWS, CI/CD)")
    soft_skills: List[str] = Field(..., description="Interpersonal or core soft skills")

class WorkExperience(BaseModel):
    role: str = Field(..., description="Job title or designation")
    company: str = Field(..., description="Company name")
    duration_months: int = Field(..., description="Calculated duration of employment in months")
    highlights: List[str] = Field(..., description="Key impact-driven achievements or bullet points")

class ProjectDetail(BaseModel):
    title: str = Field(..., description="Title of the project")
    tech_stack: List[str] = Field(..., description="Technologies used in this specific project")
    description: str = Field(..., description="Brief summary of what was built and its impact")

class EducationDetail(BaseModel):
    degree: str = Field(..., description="Degree type (e.g., B.E., B.Tech, B.S.)")
    field_of_study: str = Field(..., description="Major/Field (e.g., Computer Science and Engineering)")
    institution: str = Field(..., description="University or college name")
    graduation_year: Optional[int] = Field(None, description="Year of graduation")

# ==========================================
# 2. ANALYSIS & DIAGNOSTIC SCHEMAS
# ==========================================

class BulletPointRefinement(BaseModel):
    original_text: str = Field(..., description="The original weak bullet point from the resume")
    suggested_text: str = Field(..., description="The metrics-driven, high-impact alternative statement")
    reason: str = Field(..., description="Why this change makes the line stand out to technical recruiters")

class ProjectEnhancement(BaseModel):
    project_title: str = Field(..., description="Title of the project being evaluated")
    suggested_additions: str = Field(..., description="Advanced, placement-ready architectural optimizations to add")

# ==========================================
# 3. COMPANY SPECIFIC TARGETING SCHEMAS
# ==========================================

class CultureAlignment(BaseModel):
    company_core_focus: str = Field(..., description="The primary value of the company (e.g., ultra-low latency, distributed scaling)")
    resume_theme_adjustment: str = Field(..., description="Strategic advice on how to pivot the overall tone of the resume for this company")

class TechnicalInterviewFocus(BaseModel):
    expected_topics: List[str] = Field(..., description="Core computer science topics heavily tested at this company")
    probable_tech_stack_questions: List[str] = Field(..., description="Sample technical questions relevant to their tech stack vs your project stack")

class ProjectPitchAngle(BaseModel):
    project_title: str = Field(..., description="Name of the project from the resume")
    pitch_angle: str = Field(..., description="Exactly how to talk about this project to engineers at this target company to match their engineering goals")

class CompanyTargetingAnalysis(BaseModel):
    culture_and_values_alignment: CultureAlignment
    technical_interview_focus: TechnicalInterviewFocus
    tailored_project_talking_points: List[ProjectPitchAngle]

# ==========================================
# 4. MASTER COMPREHENSIVE OUTPUT SCHEMA
# ==========================================

class CompleteAnalysisResponse(BaseModel):
    """
    The final output contract. This single model encapsulates the extracted profile,
    the score analytics, and company alignment matrices back to the user interface.
    """
    personal_info: PersonalInfo
    skills: SkillCategorization
    experience: List[WorkExperience]
    projects: List[ProjectDetail]
    education: EducationDetail
    
    overall_match_percentage: float = Field(..., description="Weighted match score from 0.0 to 100.0", ge=0.0, le=100.0)
    missing_critical_skills: List[str] = Field(..., description="Crucial technologies or keywords missing based on the JD")
    bullet_point_refinements: List[BulletPointRefinement]
    project_enhancement_suggestions: List[ProjectEnhancement]
    
    company_specific_targeting: CompanyTargetingAnalysis