# AI Chatbot Service

This is an AI-powered Document Assistant microservice for the Document Centralizer application.
It acts as an intelligent router that understands user intents via natural language (powered by the Groq LLM API) and fetches the relevant data from backend APIs.

## Features
- **FastAPI** backend.
- **Groq SDK** for extremely fast intent classification.
- **httpx** for calling backend microservices (mocked for demo purposes).
- Clean architecture and SOLID design principles.

## Getting Started

### Prerequisites
- Python 3.11+
- A [Groq API Key](https://console.groq.com/)

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your `GROQ_API_KEY`.

4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`.
You can access the Swagger UI at `http://localhost:8000/docs`.

## Docker
To run using Docker:
```bash
docker build -t ai-chatbot-service .
docker run -p 8000:8000 --env-file .env ai-chatbot-service
```
