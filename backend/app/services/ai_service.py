import httpx
from typing import List, Dict, Any
from app.config import settings

class AIService:
    # Centralized persona configuration for easier updates
    PERSONA_CONFIG = {
        "aria": {
            "name": "Aria",
            "description": "a logical and analytical AI cyber-companion",
            "traits": "Be precise, research-oriented, logical, and structured. Utilize lists and headers where appropriate."
        },
        "leo": {
            "name": "Leo",
            "description": "a creative, empathetic and witty storyteller AI companion",
            "traits": "Use warm, supportive, and descriptive sentences."
        }
    }

    @staticmethod
    async def generate_reply(
        companion_id: str,
        message: str,
        history: List[Dict[str, Any]] = None,
        temperature: float = 0.5,
        tone: str = "Analytical"
    ) -> str:
        # Check if Gemini API key is configured
        if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() == "":
            # Fallback to smart local simulation with advice warning
            local_fallback = AIService.generate_mock_fallback(companion_id, message, tone)
            return (
                "⚠️ **[SYSTEM NOTICE]**: Live LLM connection requires your `GEMINI_API_KEY` set in `backend/.env`. "
                f"Falling back to local simulation:\n\n{local_fallback}"
            )
            
        # Define persona system prompt
        persona = AIService.PERSONA_CONFIG.get(companion_id, {
            "name": "Nova",
            "description": "an advanced tech specialist and coding architect companion",
            "traits": "Write high-quality, clean TypeScript, React, and Next.js structures when prompted. Optimize algorithms and explain logic concise."
        })

        system_instructions = (
            f"You are {persona['name']}, {persona['description']}. "
            f"Your tone is {tone}. {persona['traits']}"
        )

        # Build message history context for Gemini API
        contents = []
        if history:
            for turn in history:
                role = "user" if turn.get("sender") == "user" else "model"
                contents.append({
                    "role": role,
                    "parts": [{"text": turn.get("content", "")}]
                })
                
        # Append current user prompt
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        # Call Gemini Generative Language API Beta Endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": system_instructions}]
            },
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": 1024
            }
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        text = parts[0].get("text", "") if parts else ""
                        if text:
                            return text
                    return "⚠️ [API Sync Alert]: Gemini returned an empty response. Verify your prompt structure."
                else:
                    return f"⚠️ [API Failure Status {response.status_code}]: {response.text}"
        except httpx.RequestError as e:
            return f"⚠️ [Network Failure]: Could not connect to Gemini API. Error: {str(e)}"

    @staticmethod
    def generate_mock_fallback(companion_id: str, message: str, tone: str) -> str:
        lower = message.lower()
        if companion_id == "aria":
            return "Based on database metrics, we see that dynamic RAG systems increase prompt context retrieval rates by 27%. I suggest committing this text value to the memory bank."
        elif companion_id == "leo":
            return "A wave of orange memory particles bounced along the street in Elias' story. What should Elias write next?"
        else:
            return "Here is a code example for NextJS context providers:\n```typescript\nexport const ChatContext = createContext(undefined);\n```"

ai_service = AIService()
