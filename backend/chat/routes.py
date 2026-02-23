from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db import get_db
from chat import models, schemas
from auth.security import get_current_user
from auth import models as auth_models
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/chats", tags=["Chats"])



@router.get("/", response_model=list[schemas.ChatResponse])
def list_chats(
    limit: int = 20,
    cursor: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: auth_models.User = Depends(get_current_user)
):
    limit = min(limit, 50)

    query = (
        db.query(models.Chat)
        .filter(models.Chat.user_id == current_user.id)
    )

    if cursor:
        query = query.filter(models.Chat.updated_at < cursor)

    chats = (
        query
        .order_by(models.Chat.updated_at.desc())
        .limit(limit)
        .all()
    )

    return chats


@router.get("/{chat_id}", response_model=schemas.ChatWithMessagesResponse)
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: auth_models.User = Depends(get_current_user)
):
    chat = (
        db.query(models.Chat)
        .filter(models.Chat.id == chat_id)
        .first()
    )

    if not chat or chat.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    return chat


@router.delete("/{chat_id}")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: auth_models.User = Depends(get_current_user)
):
    chat = (
        db.query(models.Chat)
        .filter(models.Chat.id == chat_id)
        .first()
    )

    if not chat or chat.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    db.delete(chat)
    db.commit()

    return {"detail": "Chat deleted"}