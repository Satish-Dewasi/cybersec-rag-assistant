from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    confidence: Optional[float]
    sources: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    id: int
    title: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatWithMessagesResponse(ChatResponse):
    messages: List[MessageResponse]