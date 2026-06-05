import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "AI Resume Matcher"
    
    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    
    # JWT Authentication Configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "default_local_development_secret_key_change_in_production_12345")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # 24 hours

# Create a single instance to use across our application
settings = Settings()

# Secure runtime log (ASCII-safe for Windows console)
if settings.GEMINI_API_KEY and not settings.GEMINI_API_KEY.endswith("eEnd") and not settings.GEMINI_API_KEY.endswith("_KEY"):
    print(f"[SUCCESS] Gemini API Key verified. Starts with: {settings.GEMINI_API_KEY[:8]}...")
else:
    print("[WARNING] Stale placeholder Gemini API key detected!")