from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Job, JobMatch, Profile
from app.schemas.schemas import JobCreate, JobResponse
from app.services.gemini_service import gemini_service
from app.services.matching_engine import matching_engine
from app.api.deps import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobResponse])
def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    jobs = db.query(Job).filter(Job.user_id == current_user.id).order_by(Job.created_at.desc()).all()
    if not jobs:
        # Seed default jobs for fresh accounts
        seed_jobs = [
            Job(
                id="1",
                user_id=current_user.id,
                title="Software Engineer",
                company="Google",
                description="Design and implement scalable backend services. Write clean, maintainable code in Java or Python. Work with distributed systems and cloud infrastructure.",
                parsed_requirements={
                    "required_skills": ["Java", "Spring Boot", "SQL", "REST APIs", "Docker", "AWS", "React"],
                    "soft_skills": ["Communication", "Problem Solving", "Teamwork"],
                    "experience_level": "0-2 years",
                    "responsibilities": [
                        "Design and implement scalable backend services",
                        "Write clean, maintainable code",
                        "Participate in code reviews"
                    ],
                    "qualifications": ["Bachelor's in CS or related field"]
                }
            ),
            Job(
                id="2",
                user_id=current_user.id,
                title="Data Engineer",
                company="Amazon",
                description="Build scalable data pipelines using Python, SQL, and Apache Spark on AWS.",
                parsed_requirements={
                    "required_skills": ["Python", "SQL", "Apache Spark", "AWS", "Airflow", "Kafka"],
                    "soft_skills": ["Analytical Thinking", "Communication"],
                    "experience_level": "1-3 years",
                    "responsibilities": ["Build ETL pipelines", "Optimize data warehouse queries"],
                    "qualifications": ["Bachelor's in CS or related field"]
                }
            ),
            Job(
                id="3",
                user_id=current_user.id,
                title="AI Engineer",
                company="OpenAI",
                description="Develop AI-powered applications, fine-tune LLMs, and build high-performance RAG systems using Python and FastAPI.",
                parsed_requirements={
                    "required_skills": ["Python", "PyTorch", "LLMs", "FastAPI", "Docker", "Vector Databases"],
                    "soft_skills": ["Research Mindset", "Communication"],
                    "experience_level": "0-2 years",
                    "responsibilities": [
                        "Develop AI-powered features",
                        "Fine-tune language models",
                        "Build RAG systems"
                    ],
                    "qualifications": ["Bachelor's in CS, ML, or related field"]
                }
            )
        ]
        for sj in seed_jobs:
            db.add(sj)
        db.commit()
        jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
    return jobs

@router.post("", response_model=JobResponse)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Extract requirements via Gemini or regex heuristic
    fallback_req = {
        "required_skills": ["Python", "REST APIs", "SQL", "Docker", "Git"],
        "soft_skills": ["Communication", "Problem Solving"],
        "experience_level": "0-2 years",
        "responsibilities": [
            "Develop scalable backend services",
            "Collaborate with cross-functional teams"
        ],
        "qualifications": ["Bachelor's degree in CS, IT, or related field"]
    }

    prompt = f"""Extract structured job requirements from this description into pure JSON:
{{
  "required_skills": ["Skill1", "Skill2"],
  "soft_skills": ["SoftSkill1"],
  "experience_level": "0-2 years",
  "responsibilities": ["..."],
  "qualifications": ["..."]
}}

Job text:
{job_in.description[:3000]}
"""
    parsed = gemini_service.generate_json(prompt, fallback_req)

    job = Job(
        user_id=current_user.id,
        title=job_in.title,
        company=job_in.company,
        description=job_in.description,
        parsed_requirements=parsed
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Automatically compute initial match score against user profile
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        profile_dict = {
            "projects": profile.projects or [],
            "experience": profile.experience or [],
            "education": profile.education or [],
            "skills": []
        }
        match_data = matching_engine.analyze_match(profile_dict, parsed)
        job_match = JobMatch(
            user_id=current_user.id,
            job_id=job.id,
            overall_score=match_data["overall_score"],
            category_scores=match_data["category_scores"],
            skill_matches=match_data["skill_matches"],
            evidence_map=match_data["evidence_map"],
            gap_analysis=match_data["gap_analysis"]
        )
        db.add(job_match)
        db.commit()

    return job

@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return job
