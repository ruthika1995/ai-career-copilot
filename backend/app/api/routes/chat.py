from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, ChatMessage, Profile
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.rag_service import rag_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/chat", tags=["Career Advisor Chat"])

@router.get("/history", response_model=List[ChatResponse])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.asc()).all()

    if not history:
        # Seed initial starter conversation
        initial_messages = [
            ChatMessage(
                user_id=current_user.id,
                user_message="What should I learn after Java collections for backend development?",
                ai_response="After mastering Java Collections, the natural next step for backend development is:\n\n1. Streams API — Learn functional programming with Java Streams.\n2. Concurrency — Master ExecutorService, CompletableFuture, and thread safety.\n3. Spring Boot — Industry-standard framework for dependency injection, REST controllers, and Spring Data JPA.\n4. Build Tools — Maven or Gradle for dependency management.",
                sources=["Career Knowledge Base: Java Learning Path", "Career Knowledge Base: Backend Roadmap"]
            ),
            ChatMessage(
                user_id=current_user.id,
                user_message="How do I prepare for system design interviews as a fresher?",
                ai_response="As a fresher, system design interviews focus on fundamentals:\n\n1. Core Concepts: Client-server architecture, load balancing, Redis caching, database indexing.\n2. Practice Common Designs: URL shortener, Chat app, E-commerce catalog.\n3. Structure Your Answer: Clarify requirements -> High-level architecture -> Deep dive -> Trade-offs.",
                sources=["Career Knowledge Base: Interview Prep Guide", "Career Knowledge Base: System Design Fundamentals"]
            )
        ]
        for m in initial_messages:
            db.add(m)
        db.commit()
        history = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).all()

    return history

@router.post("", response_model=ChatResponse)
def send_chat_message(
    chat_in: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    context = ""
    if profile:
        context = f"Candidate: {profile.name}, Projects: {[p.get('name') for p in profile.projects or []]}"

    result = rag_service.answer_query(chat_in.message, candidate_context=context)

    msg = ChatMessage(
        user_id=current_user.id,
        user_message=chat_in.message,
        ai_response=result["ai_response"],
        sources=result["sources"]
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
