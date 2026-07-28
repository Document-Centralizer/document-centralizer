import os
from groq import AsyncGroq
from app.prompts.system_prompt import SYSTEM_PROMPT

async def get_intent_from_llm(user_message: str) -> str:
    """
    Sends the user message to Groq LLM to classify the intent based on the system prompt.
    Returns the intent string.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("Warning: GROQ_API_KEY not found in environment. Mocking intent for demo.")
        # For demonstration if API key is missing
        message = user_message.lower()
        if "verified" in message: return "GET_VERIFIED_DOCUMENTS"
        if "pending" in message: return "GET_PENDING_DOCUMENTS"
        if "count" in message or "how many" in message: return "GET_DOCUMENT_COUNT"
        if "subscription" in message or "plan" in message: return "GET_SUBSCRIPTION"
        if "help" in message or "upload" in message: return "HELP_UPLOAD"
        if "passport" in message: return "REQUIRED_DOCS_PASSPORT"
        if "document" in message or "show" in message: return "GET_ALL_DOCUMENTS"
        return "UNKNOWN_INTENT"

    client = AsyncGroq(api_key=api_key)
    
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": user_message,
                }
            ],
            model="llama3-8b-8192",
            temperature=0,
            max_tokens=20,
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return "UNKNOWN_INTENT"
