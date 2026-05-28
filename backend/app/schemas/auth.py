from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserResponse(UserBase):
    id: int
    avatar_acronym: str
    bio: str
    cognitive_engine: str
    temperature: float
    tone: str
    font_size: str
    reduce_motion: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[int] = None
