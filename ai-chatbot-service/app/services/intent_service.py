from app.services import api_service

async def process_intent(intent: str) -> str:
    """
    Maps the detected intent to backend API calls and formats a natural language response.
    """
    if intent == "GET_ALL_DOCUMENTS":
        data = await api_service.get_documents()
        docs = ", ".join(data.get("documents", []))
        return f"Here are your documents: {docs}."
        
    elif intent == "GET_VERIFIED_DOCUMENTS":
        data = await api_service.get_verified_documents()
        docs = ", ".join(data.get("documents", []))
        return f"Here are your verified documents: {docs}."
        
    elif intent == "GET_PENDING_DOCUMENTS":
        data = await api_service.get_pending_documents()
        docs = ", ".join(data.get("documents", []))
        return f"You have the following documents pending review: {docs}."
        
    elif intent == "GET_DOCUMENT_COUNT":
        data = await api_service.get_document_count()
        count = data.get("count", 0)
        return f"You currently have {count} documents uploaded."
        
    elif intent == "GET_SUBSCRIPTION":
        data = await api_service.get_subscription()
        plan = data.get("plan", "Unknown")
        status = data.get("status", "Unknown")
        return f"You are currently on the {plan} plan (Status: {status})."
        
    elif intent == "HELP_UPLOAD":
        return "To upload a document, navigate to the 'Documents' section and click on the '+ Upload' button in the top right corner."
        
    elif intent == "REQUIRED_DOCS_PASSPORT":
        return "To apply for a passport, you typically need: 1. Proof of citizenship (e.g., birth certificate). 2. Proof of identity (e.g., driver's license). 3. A recent passport photo."
        
    else:
        return "I'm currently able to help only with document-related queries."
