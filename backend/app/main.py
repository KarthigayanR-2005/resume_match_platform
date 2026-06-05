from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.analyzer import router as analyzer_router
from app.routes.auth import router as auth_router
from app.database import engine, Base
from app.models import db_models

# Automatically generate database tables at app startup
Base.metadata.create_all(bind=engine)

# Initialize the main FastAPI application instance
app = FastAPI(
    title="AI Resume Matcher API",
    version="1.0.0"
)

# Enable CORS so your frontend application will be allowed to talk to the backend later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register our sub-routes directly to the live server instance
app.include_router(analyzer_router)
app.include_router(auth_router)

# Create a basic test route to ensure the server turns on smoothly
@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the AI Resume Analyzer & Job Match Platform Backend!"
    }