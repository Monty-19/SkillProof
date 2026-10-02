import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.database import engine, Base
from app.routers import auth, challenges, submissions, students, recruiters, admin, skills, notifications

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Proof-of-Skill platform API: Turning practical challenges into verified, AI-assisted proof of skill."
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(challenges.router, prefix="/api/challenges", tags=["Challenges"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["Submissions"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(recruiters.router, prefix="/api/recruiters", tags=["Recruiters"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])

@app.on_event("startup")
def on_startup():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    # Check if database needs auto-seeding
    from app.database.seed import seed_database
    try:
        seed_database()
    except Exception as e:
        logger.error(f"Error seeding database: {e}")

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "SkillProof API",
        "version": settings.VERSION,
        "ai_model": settings.AI_MODEL,
        "provider": settings.EVALUATION_PROVIDER
    }

@app.get("/api", tags=["Root"])
def api_root():
    return {
        "name": settings.PROJECT_NAME,
        "message": "Welcome to SkillProof API. Prove what you can do.",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
