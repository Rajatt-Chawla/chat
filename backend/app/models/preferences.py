from sqlalchemy import Column, DateTime, ForeignKey, Index, JSON, String, UniqueConstraint, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class UserPreference(Base):
    __tablename__ = "user_preferences"
    __table_args__ = (
        UniqueConstraint("user_id", "preference_key", name="uq_user_preferences_user_key"),
        Index("ix_user_preferences_user_category", "user_id", "category"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    preference_key = Column(String, nullable=False)
    category = Column(String, default="general", nullable=False)
    value = Column(JSON, nullable=False)
    confidence = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="preferences")
