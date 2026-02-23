from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import engine, Base
from auth.models import User
from auth.routes import router as auth_router
from chat.models import Chat, Message
from chat.routes import router as chat_router

from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from db import get_db
from auth.security import get_current_user
from datetime import datetime, timezone
import json


Base.metadata.create_all(bind=engine)

from cyber_assistant import CyberThreatIntelligenceAssistant

app = FastAPI(
    title="Cyber Threat Intelligence API",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(chat_router)


# Allow React frontend later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock this down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assistant = CyberThreatIntelligenceAssistant()

from typing import Optional

class QueryRequest(BaseModel):
    query: str
    chat_id: Optional[int] = None


class QueryResponse(BaseModel):
    confidence_level: str
    confidence_score: float
    citations: list[str]
    answer: str


@app.get("/")
def health_check():
    return {"status": "API is running"}


@app.post("/ask", response_model=QueryResponse)
def ask_question(
    request: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Step 1 — Handle Chat
    if request.chat_id:
        chat = db.query(Chat).filter(Chat.id == request.chat_id).first()

        if not chat or chat.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )
    else:
        # Create new chat
        chat = Chat(
            user_id=current_user.id,
            title=request.query[:40]
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)

    # Step 2 — Save user message
    user_message = Message(
        chat_id=chat.id,
        role="user",
        content=request.query
    )
    db.add(user_message)
    db.commit()

    # Step 3 — Run RAG
    response = assistant.ask(request.query)

    # Step 4 — Save assistant message
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

    db.commit()

    return response