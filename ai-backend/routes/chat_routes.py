from fastapi import APIRouter
from pydantic import BaseModel
from rag.pipeline import run_rag_pipeline

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    user_id: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    result = run_rag_pipeline(request.question, request.user_id)
    return result
