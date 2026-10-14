from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Job, JobMatch, Profile
from app.schemas.schemas import MatchResponse
from app.services.matching_engine import matching_engine
from app.api.deps import get_current_user

router = APIRouter(prefix="/matches", tags=["Matching Engine"])

@router.get("", response_model=List[MatchResponse])
def get_all_matches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    matches = db.query(JobMatch).filter(JobMatch.user_id == current_user.id).all()
    if not matches:
        # Generate match for each job if not computed yet
        jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        profile_dict = {
            "projects": profile.projects or [] if profile else [],
            "experience": profile.experience or [] if profile else [],
            "education": profile.education or [] if profile else [],
            "skills": []
        }
        for job in jobs:
            res = matching_engine.analyze_match(profile_dict, job.parsed_requirements or {})
            m = JobMatch(
                user_id=current_user.id,
                job_id=job.id,
                overall_score=res["overall_score"],
                category_scores=res["category_scores"],
                skill_matches=res["skill_matches"],
                evidence_map=res["evidence_map"],
                gap_analysis=res["gap_analysis"]
            )
            db.add(m)
        db.commit()
        matches = db.query(JobMatch).filter(JobMatch.user_id == current_user.id).all()
    return matches

@router.get("/job/{job_id}", response_model=MatchResponse)
def get_job_match(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    match = db.query(JobMatch).filter(
        JobMatch.user_id == current_user.id,
        JobMatch.job_id == job_id
    ).first()

    if not match:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found.")
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        profile_dict = {
            "projects": profile.projects or [] if profile else [],
            "experience": profile.experience or [] if profile else [],
            "education": profile.education or [] if profile else [],
            "skills": []
        }
        res = matching_engine.analyze_match(profile_dict, job.parsed_requirements or {})
        match = JobMatch(
            user_id=current_user.id,
            job_id=job.id,
            overall_score=res["overall_score"],
            category_scores=res["category_scores"],
            skill_matches=res["skill_matches"],
            evidence_map=res["evidence_map"],
            gap_analysis=res["gap_analysis"]
        )
        db.add(match)
        db.commit()
        db.refresh(match)

    return match
