from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import generate_text
import re

router = APIRouter()

class SentimentRequest(BaseModel):
    text: str

@router.post("/analyze-sentiment")
async def analyze_sentiment(req: SentimentRequest):
    prompt = f"""
    Analyze the financial sentiment of the following news text. 
    Classify it strictly as exactly one of these words: positive, neutral, negative.
    Do not return any other text or explanation. Only the single word.
    
    Text: {req.text}
    """
    
    response = generate_text(prompt).strip().lower()
    
    # Fallback cleanup
    if 'positive' in response: return {"sentiment": "positive"}
    if 'negative' in response: return {"sentiment": "negative"}
    return {"sentiment": "neutral"}
