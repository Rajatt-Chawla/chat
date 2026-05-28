from sqlalchemy import Column, DateTime, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class EmotionalHistory(Base):
    __tablename__ = "emotional_history"
    __table_args__ = (
        Index("ix_emotional_history_user_recorded", "user_id", "recorded_at"),
        Index("ix_emotional_history_user_emotion", "user_id", "primary_emotion"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source_message_id = Column(Integer, ForeignKey("chat_history.id", ondelete="SET NULL"), nullable=True)
    primary_emotion = Column(String, nullable=False)
    sentiment_label = Column(String, nullable=False)
    sentiment_score = Column(Float, nullable=False)
    intensity = Column(Float, default=0.0, nullable=False)
    notes = Column(Text, nullable=True)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="emotional_history")
    source_message = relationship("ChatMessage", back_populates="emotional_snapshots")
