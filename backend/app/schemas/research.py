from pydantic import BaseModel, Field
from typing import List, Optional

class ResearchRequest(BaseModel):
    query: str = Field(..., min_length=2)
    depth: Optional[str] = "standard"  # "standard" | "deep"

class WebSource(BaseModel):
    title: str
    url: str
    snippet: str

class ResearchResponse(BaseModel):
    query: str
    summary: str
    sources: List[WebSource]
    key_takeaways: List[str]
