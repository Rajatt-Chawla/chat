from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.emotion import EmotionAnalysisRequest, EmotionAnalysisResponse
from app.services.emotion_service import emotion_service

router = APIRouter()

@router.post("/analyze", response_model=EmotionAnalysisResponse)
async def analyze_dialogue_sentiment(
    req: EmotionAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    analysis = emotion_service.analyze_text(req.text)
    return analysis
