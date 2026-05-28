from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Memory(Base):
    __tablename__ = "memories"
    __table_args__ = (
        Index("ix_memories_user_category_timestamp", "user_id", "category", "timestamp"),
        Index("ix_memories_user_importance", "user_id", "importance"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    fact = Column(Text, nullable=False)
    category = Column(String, default="Personal", nullable=False)  # "Personal" | "Technical" | "Goals" | "Preferences"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source = Column(String, default="chat", nullable=False)
    importance = Column(Integer, default=1, nullable=False)
    is_archived = Column(Boolean, default=False, nullable=False)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="memories")
