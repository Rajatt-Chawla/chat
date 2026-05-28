from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app import models
from app.api import auth, chat, memory, profile, emotion, research, workflow

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS for client-side frontend syncs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register v1 router prefix paths
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["AI Conversations"])
app.include_router(memory.router, prefix=f"{settings.API_V1_STR}/memory", tags=["Cognitive Vault"])
app.include_router(profile.router, prefix=f"{settings.API_V1_STR}/profile", tags=["User Profiles"])
app.include_router(emotion.router, prefix=f"{settings.API_V1_STR}/emotion", tags=["Sentiment Analytics"])
app.include_router(research.router, prefix=f"{settings.API_V1_STR}/research", tags=["Web Research Agents"])
app.include_router(workflow.router, prefix=f"{settings.API_V1_STR}/workflow", tags=["Agent Workflows"])

# Automatically spin up DB tables on startup
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # Create all tables if they do not exist
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0"
    }
