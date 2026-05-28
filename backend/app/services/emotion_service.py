from typing import Dict, Any

class EmotionService:
    @staticmethod
    def analyze_text(text: str) -> Dict[str, Any]:
        lower = text.lower()
        
        # Default scores
        scores = {
            "Positive/Empathetic": 0.20,
            "Anxious/Stressed": 0.10,
            "Analytical/Logical": 0.40,
            "Creative/Witty": 0.20,
            "Neutral": 0.10
        }
        
        # Simple lexical checks for sentiment weights
        if any(w in lower for w in ["sad", "worry", "stress", "fail", "anxious", "scared", "afraid"]):
            scores["Anxious/Stressed"] = 0.75
            scores["Analytical/Logical"] = 0.10
            sentiment = "Anxious/Stressed"
            suggested_tone = "Empathetic & Calming"
        elif any(w in lower for w in ["love", "happy", "great", "awesome", "excite", "glad", "feel"]):
            scores["Positive/Empathetic"] = 0.80
            scores["Analytical/Logical"] = 0.10
            sentiment = "Positive/Empathetic"
            suggested_tone = "Warm & Supportive"
        elif any(w in lower for w in ["code", "bug", "error", "database", "api", "compile", "docker"]):
            scores["Analytical/Logical"] = 0.85
            sentiment = "Analytical/Logical"
            suggested_tone = "Technical & Structured"
        elif any(w in lower for w in ["story", "paint", "art", "music", "write", "creative", "idea"]):
            scores["Creative/Witty"] = 0.80
            scores["Analytical/Logical"] = 0.10
            sentiment = "Creative/Witty"
            suggested_tone = "Creative & Brainstorming"
        else:
            sentiment = "Neutral"
            suggested_tone = "Balanced & Informative"
            
        return {
            "sentiment": sentiment,
            "scores": scores,
            "suggested_tone": suggested_tone
        }

emotion_service = EmotionService()
