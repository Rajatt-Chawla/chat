from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.research import ResearchRequest, ResearchResponse
from app.services.research_service import research_service

router = APIRouter()

@router.post("/query", response_model=ResearchResponse)
async def query_web_research(
    req: ResearchRequest,
    current_user: User = Depends(get_current_user)
):
    results = research_service.perform_search(req.query, depth=req.depth)
    return results
