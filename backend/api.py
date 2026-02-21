from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from cyber_assistant import CyberThreatIntelligenceAssistant

app = FastAPI(
    title="Cyber Threat Intelligence API",
    version="1.0.0"
)

# Allow React frontend later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock this down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assistant = CyberThreatIntelligenceAssistant()


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    confidence_level: str
    confidence_score: float
    citations: list[str]
    answer: str


@app.get("/")
def health_check():
    return {"status": "API is running"}


@app.post("/ask", response_model=QueryResponse)
def ask_question(request: QueryRequest):
    return assistant.ask(request.query)