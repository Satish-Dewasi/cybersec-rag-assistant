from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone
import json

from db import engine, Base, get_db
from auth.models import User
from auth.routes import router as auth_router
from auth.security import get_current_user
from chat.models import Chat, Message
from chat.routes import router as chat_router
from cyber_assistant import CyberThreatIntelligenceAssistant
from generation_service import LLMRateLimitException


# Create tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Cyber Threat Intelligence API",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(chat_router)


# CORS (restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# assistant = CyberThreatIntelligenceAssistant()
assistant = None  # Lazy initialization on first request


# ----------------------------
# Request / Response Schemas
# ----------------------------

class QueryRequest(BaseModel):
    query: str
    chat_id: Optional[int] = None


class QueryResponse(BaseModel):
    chat_id: int
    confidence_level: str
    confidence_score: float
    citations: list[str]
    answer: str


# ----------------------------
# Health Check
# ----------------------------

@app.get("/")
def health_check():
    return {"status": "API is running"}


# ----------------------------
# Ask Endpoint (Protected)
# ----------------------------

@app.post("/ask", response_model=QueryResponse)
def ask_question(
    request: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):  
    global assistant
    if assistant is None:
        assistant = CyberThreatIntelligenceAssistant()

    # ----------------------------
    # Step 1 — Handle Chat
    # ----------------------------
    if request.chat_id:
        chat = db.query(Chat).filter(Chat.id == request.chat_id).first()

        if not chat or chat.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )
    else:
        chat = Chat(
            user_id=current_user.id,
            title=request.query[:60].strip()
        )
        db.add(chat)
        db.flush()  # get chat.id without full commit

    # ----------------------------
    # Step 2 — Save User Message
    # ----------------------------
    user_message = Message(
        chat_id=chat.id,
        role="user",
        content=request.query
    )
    db.add(user_message)

    # ----------------------------
    # Step 3 — Run RAG
    # ----------------------------
    try:
        response = assistant.ask(request.query)

    except LLMRateLimitException as e:
        db.rollback()  # important: avoid partial DB writes
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )

    # ----------------------------
    # Step 4 — Save Assistant Message
    # ----------------------------
    assistant_message = Message(
        chat_id=chat.id,
        role="assistant",
        content=response["answer"],
        confidence=response["confidence_score"],
        sources=json.dumps(response["citations"])
    )
    db.add(assistant_message)

    # Update chat activity
    chat.updated_at = datetime.now(timezone.utc)

    # ----------------------------
    # Final Commit (Single Transaction)
    # ----------------------------
    db.commit()

    return {
        "chat_id": chat.id,
        **response
    }