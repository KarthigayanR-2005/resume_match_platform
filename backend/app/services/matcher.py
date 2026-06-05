import json
from google import genai
from google.genai import types
from app.config import settings
from app.models.schemas import CompleteAnalysisResponse

# Initialize the Gemini Client cleanly using configured API key
client = genai.Client(api_key=settings.GEMINI_API_KEY)

class AnalysisEngineService:
    async def generate_complete_analysis(self, resume_text: str, job_description: str, target_company: str = "Google") -> str:
        """
        Parses the resume and job description using gemini-2.5-flash
        and returns a structured JSON string matching the frontend schema expectations.
        Uses structured outputs to guarantee schema validity.
        """
        
        prompt = f"""
        You are an elite corporate technical recruiting algorithm evaluating an engineering candidate for {target_company}.
        
        Analyze the following Resume Text against the Job Description constraints:
        
        [RESUME TEXT]
        {resume_text}
        
        [JOB DESCRIPTION MATRIX]
        {job_description}
        
        Instructions:
        Evaluate the data and return a strictly structured JSON object that matches the exact keys your frontend application expects to map into dashboards, charts, and metrics lists.
        You must fill in all fields required by the CompleteAnalysisResponse schema:
        - personal_info (name, email, phone, links)
        - skills (languages, frameworks_and_libraries, databases, cloud_and_devops, soft_skills)
        - experience (role, company, duration_months, highlights)
        - projects (title, tech_stack, description)
        - education (degree, field_of_study, institution, graduation_year)
        - overall_match_percentage (a float between 0.0 and 100.0)
        - missing_critical_skills (list of critical skills from JD missing in resume)
        - bullet_point_refinements (list of suggestions to make work experience bullet points stronger)
        - project_enhancement_suggestions (list of suggested architectural enhancements for their projects)
        - learning_roadmap (for each missing skill, provide documentation_url, github_repo link for learning, and 3 specific sequential learning steps)
        - company_specific_targeting (culture_and_values_alignment, technical_interview_focus, tailored_project_talking_points)
        
        Do not include markdown wrappers like ```json or ```. Return the raw JSON text directly.
        """
        
        import time
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Utilizing the lightning-fast flash model with strict json output configuration and response schema
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=CompleteAnalysisResponse
                    )
                )
                return response.text
                
            except Exception as e:
                print(f"[WARNING] Gemini API attempt {attempt + 1} failed: {str(e)}")
                if attempt == max_retries - 1:
                    print(f"[ERROR] Gemini Pipeline Error after {max_retries} attempts: {str(e)}")
                    raise e
                time.sleep(2)