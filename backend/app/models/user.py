from sqlalchemy import Column, String, Text, Boolean, DateTime, Index, Integer, Float, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    # Store password hashes only. Never store raw credentials.
    hashed_password = Column(String, nullable=False)
    
    # Profile parameters
    bio = Column(Text, default="")
    avatar_acronym = Column(String, default="JD")
    
    # Custom sliders / selections synced with user settings
    cognitive_engine = Column(String, default="aetheria-cognitive-v1")
    temperature = Column(Float, default=0.5)
    tone = Column(String, default="Analytical")
    font_size = Column(String, default="Standard")
    reduce_motion = Column(Boolean, default=False)
    api_token_hash = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    threads = relationship("ChatThread", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("Memory", back_populates="user", cascade="all, delete-orphan")
    emotional_history = relationship("EmotionalHistory", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("Setting", back_populates="user", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
