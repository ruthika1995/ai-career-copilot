from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Interview, Job
from app.schemas.schemas import InterviewCreate, InterviewAnswerSubmit, InterviewResponse
from app.services.interview_service import interview_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/interviews", tags=["Mock Interviewer"])

@router.post("", response_model=InterviewResponse)
def create_interview(
    inter_in: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_title = "Software Engineer"
    if inter_in.job_id:
        job = db.query(Job).filter(Job.id == inter_in.job_id).first()
        if job:
            job_title = job.title

    questions = interview_service.generate_questions(
        job_title=job_title,
        focus_area=inter_in.focus_area,
        difficulty=inter_in.difficulty
    )

    interview = Interview(
        user_id=current_user.id,
        job_id=inter_in.job_id,
        difficulty=inter_in.difficulty,
        focus_area=inter_in.focus_area,
        overall_score=0.0,
        status="in_progress",
        questions=questions
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview

@router.get("/latest", response_model=InterviewResponse)
def get_latest_interview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = db.query(Interview).filter(
        Interview.user_id == current_user.id
    ).order_by(Interview.started_at.desc()).first()

    if not interview:
        # Create an initial one
        return create_interview(
            InterviewCreate(difficulty="medium", focus_area="Java + Spring Boot"),
            db,
            current_user
        )
    return interview

@router.post("/{interview_id}/answer", response_model=InterviewResponse)
def submit_interview_answer(
    interview_id: str,
    ans_in: InterviewAnswerSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")

    questions = list(interview.questions or [])
    if ans_in.question_index < 0 or ans_in.question_index >= len(questions):
        raise HTTPException(status_code=400, detail="Invalid question index.")

    target_q = questions[ans_in.question_index]
    evaluation = interview_service.evaluate_answer(
        question=target_q.get("question", ""),
        answer=ans_in.user_answer
    )

    target_q["user_answer"] = ans_in.user_answer
    target_q["evaluation"] = evaluation
    questions[ans_in.question_index] = target_q

    # Recalculate overall interview score
    evaluated_scores = [q["evaluation"]["overall"] for q in questions if q.get("evaluation")]
    if evaluated_scores:
        avg_score = round((sum(evaluated_scores) / len(evaluated_scores)) * 10.0, 1)
        interview.overall_score = avg_score

    # Check if all answered
    if len(evaluated_scores) == len(questions):
        interview.status = "completed"
        interview.completed_at = datetime.utcnow()

    interview.questions = questions
    db.commit()
    db.refresh(interview)
    return interview
