from typing import List, Dict, Any

class ResearchService:
    @staticmethod
    def perform_search(query: str, depth: str = "standard") -> Dict[str, Any]:
        lower = query.lower()
        
        # Mock search results database
        mock_db = [
            {
                "title": "Next.js 15 Client State Context Rules",
                "url": "https://nextjs.org/docs/app/building-your-application/rendering/client-components",
                "snippet": "In Next.js, context providers are client components. They allow sharing state without passing props down, keeping server modules separate."
            },
            {
                "title": "Framer Motion Advanced Exit Animations",
                "url": "https://www.framer.com/motion/animate-presence/",
                "snippet": "AnimatePresence enables components to animate out when they're removed from the React tree. Useful for popups, drawer sliders, and lists."
            },
            {
                "title": "SQLAlchemy Async Connection Pooling",
                "url": "https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html",
                "snippet": "Asyncpg handles high-throughput asynchronous execution pools, creating direct session pipelines inside FastAPI uvicorn tasks."
            }
        ]
        
        # Simple match check
        sources = []
        for doc in mock_db:
            if any(term in doc["title"].lower() or term in doc["snippet"].lower() for term in lower.split() if len(term) > 3):
                sources.append(doc)
                
        # Default fallback sources
        if not sources:
            sources = [mock_db[0]]
            
        summary = f"Synthesizing web data for '{query}' at {depth} research depth. The main industry consensus indicates wrapping logical routers in modular packages. Custom indexers optimize resource discovery by up to 30%."
        
        key_takeaways = [
            f"Consolidated 3 references under query '{query}'",
            "Recommended implementation uses modular class routers",
            "Ensures thread-safe connections in async pools"
        ]
        
        return {
            "query": query,
            "summary": summary,
            "sources": sources,
            "key_takeaways": key_takeaways
        }

research_service = ResearchService()
