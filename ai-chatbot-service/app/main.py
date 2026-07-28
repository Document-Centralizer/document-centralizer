# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.routes import chat

app = FastAPI(
    title="AI Chatbot Service",
    description="Document Assistant Microservice for Document Centralizer",
    version="1.0.0"
)

# Allow CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"status": "AI Chatbot Service is running"}
