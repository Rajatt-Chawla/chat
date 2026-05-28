from pydantic import BaseModel, Field
from typing import List, Dict

class EmotionAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=2)

class SentimentScore(BaseModel):
    label: str
    confidence: float

class EmotionAnalysisResponse(BaseModel):
    sentiment: str  # e.g., "Positive", "Empathetic", "Anxious", "Neutral"
    scores: Dict[str, float]
    suggested_tone: str
