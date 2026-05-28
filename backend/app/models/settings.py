from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, JSON, String, UniqueConstraint, Integer, BigInteger
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Setting(Base):
    __tablename__ = "settings"
    __table_args__ = (
        UniqueConstraint("user_id", "setting_key", name="uq_settings_user_key"),
        Index("ix_settings_user_scope", "user_id", "scope"),
    )

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True, index=True)
    user_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    scope = Column(String, default="user", nullable=False)
    setting_key = Column(String, nullable=False)
    value = Column(JSON().with_variant(JSONB, "postgresql"), nullable=False)
    is_secret = Column(Boolean, default=False, nullable=False)
    encrypted_value = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="settings")
