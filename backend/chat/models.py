from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from db import Base


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    messages = relationship(
        "Message",
        back_populates="chat",
        cascade="all, delete",
        order_by="Message.created_at.asc()"
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)

    role = Column(String, nullable=False)  # "user" or "assistant"

    content = Column(Text, nullable=False)

    confidence = Column(Float, nullable=True)

    sources = Column(Text, nullable=True)  # JSON string

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    chat = relationship("Chat", back_populates="messages")