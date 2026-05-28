from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    bio: Optional[str] = None

class CompanionTuningUpdate(BaseModel):
    temperature: Optional[str] = "0.5"
    tone: Optional[str] = "Analytical"
    cognitive_engine: Optional[str] = "aetheria-cognitive-v1"

class InterfaceUpdate(BaseModel):
    font_size: Optional[str] = "Standard"
    reduce_motion: Optional[bool] = False
