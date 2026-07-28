import httpx
import os

# Backend URL could be fetched from env in a real scenario
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080/api")

async def get_documents():
    # Mock implementation of fetching all documents
    # In a real app: async with httpx.AsyncClient() as client: return await client.get(f"{BACKEND_URL}/documents")
    return {"documents": ["Financial_Report.pdf", "Employee_Handbook.docx", "Project_Proposal.pdf"]}

async def get_verified_documents():
    # Mock implementation
    return {"documents": ["Financial_Report.pdf", "Project_Proposal.pdf"]}

async def get_pending_documents():
    # Mock implementation
    return {"documents": ["Employee_Handbook.docx"]}

async def get_document_count():
    # Mock implementation
    return {"count": 3}

async def get_subscription():
    # Mock implementation
    return {"plan": "Pro", "status": "Active"}
