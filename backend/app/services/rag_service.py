from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.memory import Memory

class RAGService:
    @staticmethod
    async def retrieve_context(user_id: int, query: str, db: AsyncSession) -> str:
        # Query user's memory database
        stmt = select(Memory).where(Memory.user_id == user_id)
        result = await db.execute(stmt)
        memories = result.scalars().all()
        
        # Simple keyword matching search for RAG context injection
        matched_facts = []
        query_words = set(query.lower().split())
        
        for mem in memories:
            fact_lower = mem.fact.lower()
            # If query overlaps with fact keywords
            if any(word in fact_lower for word in query_words if len(word) > 3):
                matched_facts.append(f"- [{mem.category}] {mem.fact}")
                
        if matched_facts:
            return "\n[Injected User Context Memories]:\n" + "\n".join(matched_facts)
        return ""

rag_service = RAGService()
