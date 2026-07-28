from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services import llm_service, intent_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Detect Intent using LLM
        intent = await llm_service.get_intent_from_llm(request.message)
        
        # 2. Process Intent (Calls Backend API & Formats Response)
        reply = await intent_service.process_intent(intent)
        
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred processing your request.")
