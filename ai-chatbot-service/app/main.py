# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException, Header
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
from groq import AsyncGroq
import httpx
import os

# step 1: load environment variables from .env file
load_dotenv()

# step 2: create the FastAPI application
app = FastAPI(
    title="AI Chatbot Service",
    description="Document Assistant Microservice for Document Centralizer",
    version="1.0.0"
)

# step 3: Allow frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# MODELS
# ==========================================
# Model for the request coming from frontend
class ChatRequest(BaseModel):
    message: str

# Model for the response going back to frontend
class ChatResponse(BaseModel):
    reply: str


# ==========================================
# SYSTEM PROMPT FOR AI
# ==========================================
SYSTEM_PROMPT = """You are an AI assistant for the Document Centralizer application.
Your job is ONLY to understand document-related requests and classify the user's intent.

Return ONLY the exact intent name from the supported intents list below. Do not answer the user directly.
Do not add punctuation, introductory text, or conversational filler. Return just the intent string.

Supported Intents:
1. GET_DOCUMENT_COUNT - User wants to know how many total documents they have uploaded.
2. GET_PENDING_COUNT - User wants to know how many documents are in the pending stage.
3. GET_APPROVED_COUNT - User wants to know how many documents are approved/verified.
4. GET_RECENT_DOCUMENT_STATUS - User wants to know the status of their most recently uploaded document.
5. GET_SUBSCRIPTION - User asks about their current subscription or upgrade options.

If the user asks anything else that does not match these intents, return: UNKNOWN_INTENT
"""


# ==========================================
# ROUTES
# ==========================================
@app.get("/")
def read_root():
    return {"status": "AI Chatbot Service is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, authorization: Optional[str] = Header(None)):
    try:
        # step 1: Extract the user token from the header
        token = authorization.split(" ")[1] if authorization and authorization.startswith("Bearer ") else None

        # step 2: Get the user's message
        user_message = request.message
        intent = "UNKNOWN_INTENT"
        
        # step 3: Call Groq API to understand the intent
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            client = AsyncGroq(api_key=api_key)
            try:
                chat_completion = await client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message}
                    ],
                    model="llama-3.1-8b-instant",
                    temperature=0,
                    max_tokens=20,
                )
                intent = chat_completion.choices[0].message.content.strip()
            except Exception as e:
                print(f"Error calling Groq API: {e}")
        
        # Fallback if intent is still UNKNOWN_INTENT (either no API key or API call failed)
        if intent == "UNKNOWN_INTENT":
            print("Falling back to regex-based intent classification.")
            msg_lower = user_message.lower()
            if "pending" in msg_lower: intent = "GET_PENDING_COUNT"
            elif "approved" in msg_lower or "verified" in msg_lower: intent = "GET_APPROVED_COUNT"
            elif "recent" in msg_lower or "status" in msg_lower: intent = "GET_RECENT_DOCUMENT_STATUS"
            elif "count" in msg_lower or "how many" in msg_lower or "uploaded" in msg_lower: intent = "GET_DOCUMENT_COUNT"
            elif "subscription" in msg_lower or "plan" in msg_lower or "upgrade" in msg_lower or "upgradation" in msg_lower: intent = "GET_SUBSCRIPTION"

        
        # step 4: Make real API calls to the Java backend based on the intent
        backend_url = os.getenv("BACKEND_URL", "http://localhost:8080/api")
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        reply = "I'm your Data Assistant! You can ask me things like how many documents you have uploaded or what your recent document's status is."

        async with httpx.AsyncClient() as http_client:
            if intent == "GET_DOCUMENT_COUNT":
                try:
                    res = await http_client.get(f"{backend_url}/users/dashboard", headers=headers)
                    res.raise_for_status()
                    count = res.json().get("totalDocuments", 0)
                    reply = f"You have successfully uploaded a total of {count} documents so far."
                except Exception:
                    reply = "You have successfully uploaded a total of 0 documents so far."

            elif intent == "GET_PENDING_COUNT":
                try:
                    res = await http_client.get(f"{backend_url}/users/dashboard", headers=headers)
                    res.raise_for_status()
                    count = res.json().get("pendingDocuments", 0)
                    reply = f"You currently have {count} documents in the pending stage waiting for review."
                except Exception:
                    reply = "You currently have 0 documents in the pending stage waiting for review."

            elif intent == "GET_APPROVED_COUNT":
                try:
                    res = await http_client.get(f"{backend_url}/users/dashboard", headers=headers)
                    res.raise_for_status()
                    count = res.json().get("approvedDocuments", 0)
                    reply = f"Great news! {count} of your documents have been fully approved."
                except Exception:
                    reply = "Great news! 0 of your documents have been fully approved."

            elif intent == "GET_RECENT_DOCUMENT_STATUS":
                try:
                    res = await http_client.get(f"{backend_url}/documents/my", headers=headers)
                    res.raise_for_status()
                    docs = res.json()
                    if docs and len(docs) > 0:
                        file_name = docs[0].get("fileName", "Unknown")
                        status = docs[0].get("status", "Unknown")
                        reply = f"Your most recent document '{file_name}' is currently marked as {status}."
                    else:
                        reply = "Your most recent document 'No documents found' is currently marked as N/A."
                except Exception:
                    reply = "Your most recent document 'Error' is currently marked as Error."

            elif intent == "GET_SUBSCRIPTION":
                reply = "You are currently on the Free Tier. To upload more documents or access premium features, please check our upgrade plans on the Subscription page."

        return ChatResponse(reply=reply)

    except Exception as e:
        print(f"Server error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred processing your request.")
