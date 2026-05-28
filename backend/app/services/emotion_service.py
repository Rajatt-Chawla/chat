import json
import httpx
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.models.emotional_history import EmotionalHistory

class EmotionService:
    @staticmethod
    async def analyze_emotion(message: str) -> Dict[str, Any]:
        """
        Analyzes the emotional tone, sentiment label, score, and intensity of a user message.
        """
        if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() == "":
            # Rule-based fallback classifier
            msg_lower = message.lower()
            if any(w in msg_lower for w in ["stressed", "anxious", "deadline", "busy", "overwhelmed", "tired", "exhausted"]):
                return {
                    "primary_emotion": "stressed",
                    "sentiment_label": "NEGATIVE",
                    "sentiment_score": 0.8,
                    "intensity": 0.85,
                    "notes": "Detected words relating to stress or exhaustion."
                }
            elif any(w in msg_lower for w in ["excited", "happy", "great", "awesome", "wonderful", "cool", "yay", "love"]):
                return {
                    "primary_emotion": "excited",
                    "sentiment_label": "POSITIVE",
                    "sentiment_score": 0.95,
                    "intensity": 0.9,
                    "notes": "Detected positive excitement indicators."
                }
            elif any(w in msg_lower for w in ["frustrated", "angry", "annoyed", "hate", "slow", "broke", "stupid", "worst"]):
                return {
                    "primary_emotion": "frustrated",
                    "sentiment_label": "NEGATIVE",
                    "sentiment_score": 0.9,
                    "intensity": 0.95,
                    "notes": "Detected irritation or anger key terms."
                }
            elif any(w in msg_lower for w in ["sad", "depressed", "lonely", "unhappy", "cry", "hurt"]):
                return {
                    "primary_emotion": "sad",
                    "sentiment_label": "NEGATIVE",
                    "sentiment_score": 0.75,
                    "intensity": 0.7,
                    "notes": "Detected sadness vocabulary."
                }
            else:
                return {
                    "primary_emotion": "neutral",
                    "sentiment_label": "NEUTRAL",
                    "sentiment_score": 0.5,
                    "intensity": 0.2,
                    "notes": "No strong emotional markers detected."
                }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        
        system_instruction = (
            "You are a sentiment and emotion analysis engine. Analyze the user text and output ONLY a JSON object in this format:\n"
            "{\n"
            "  \"primary_emotion\": \"stressed\" | \"excited\" | \"frustrated\" | \"sad\" | \"neutral\",\n"
            "  \"sentiment_label\": \"POSITIVE\" | \"NEGATIVE\" | \"NEUTRAL\",\n"
            "  \"sentiment_score\": 0.0 to 1.0,\n"
            "  \"intensity\": 0.0 to 1.0,\n"
            "  \"notes\": \"brief reasoning detailing why\"\n"
            "}"
        )
        
        payload = {
            "contents": [{
                "role": "user",
                "parts": [{"text": message}]
            }],
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json"
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        text = parts[0].get("text", "").strip() if parts else ""
                        
                        if text:
                            # Clean markdown codeblocks
                            if text.startswith("```json"):
                                text = text.split("```json")[1].split("```")[0].strip()
                            elif text.startswith("```"):
                                text = text.split("```")[1].split("```")[0].strip()
                            parsed = json.loads(text)
                            return {
                                "primary_emotion": parsed.get("primary_emotion", "neutral"),
                                "sentiment_label": parsed.get("sentiment_label", "NEUTRAL"),
                                "sentiment_score": float(parsed.get("sentiment_score", 0.5)),
                                "intensity": float(parsed.get("intensity", 0.0)),
                                "notes": parsed.get("notes", "")
                            }
        except Exception as e:
            print(f"Gemini emotion analysis error: {e}")
            
        return {
            "primary_emotion": "neutral",
            "sentiment_label": "NEUTRAL",
            "sentiment_score": 0.5,
            "intensity": 0.0,
            "notes": "Fallback default due to analysis failure."
        }

    @staticmethod
    async def record_emotion(
        user_id: int,
        message_id: Optional[int],
        analysis: Dict[str, Any],
        db: AsyncSession
    ) -> EmotionalHistory:
        """
        Saves the detected emotional analysis snap into PostgreSQL history.
        """
        record = EmotionalHistory(
            user_id=user_id,
            source_message_id=message_id,
            primary_emotion=analysis["primary_emotion"],
            sentiment_label=analysis["sentiment_label"],
            sentiment_score=analysis["sentiment_score"],
            intensity=analysis["intensity"],
            notes=analysis["notes"]
        )
        db.add(record)
        await db.commit()
        await db.refresh(record)
        return record

    @staticmethod
    def get_adaptive_prompt_modifier(primary_emotion: str) -> str:
        """
        Returns dynamic instruction modifiers to guide prompt adaptation based on detected emotion.
        """
        if primary_emotion == "stressed":
            return (
                "\n[EMOTIONAL DYNAMICS MODIFIER]: The user is currently experiencing high stress. "
                "Adopt an exceptionally calm, soothing, reassuring, and encouraging tone. Keep responses uncluttered "
                "and offer practical, supportive relief words."
            )
        elif primary_emotion == "excited":
            return (
                "\n[EMOTIONAL DYNAMICS MODIFIER]: The user is very excited or happy! "
                "Match their positive energy. Be enthusiastic, warm, and highly engaging. Celebrate their wins!"
            )
        elif primary_emotion == "frustrated":
            return (
                "\n[EMOTIONAL DYNAMICS MODIFIER]: The user is frustrated. "
                "Speak with deep empathy, active validation, and absolute patience. Do not defend, argue, or over-explain; "
                "instead, clarify, support, and align with their needs first."
            )
        elif primary_emotion == "sad":
            return (
                "\n[EMOTIONAL DYNAMICS MODIFIER]: The user is feeling down or sad. "
                "Speak in a gentle, warm, and comforting tone. Express genuine care and supportive warmth."
            )
        return ""

emotion_service = EmotionService()
