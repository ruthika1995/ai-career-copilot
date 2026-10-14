from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Profile
from app.schemas.schemas import ProfileResponse, ProfileUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(
            user_id=current_user.id,
            name=current_user.name,
            education=[
                {
                    "degree": "B.Tech",
                    "field": "Information Technology",
                    "institution": "Anna University",
                    "graduation_year": 2025
                }
            ],
            experience=[
                {
                    "title": "Frontend Developer Intern",
                    "company": "TechStart Inc.",
                    "duration": "3 months",
                    "description": "Developed responsive web applications using React and TypeScript. Implemented REST API integrations and improved page load performance by 40%.",
                    "technologies": ["React", "TypeScript", "REST APIs", "CSS"]
                }
            ],
            projects=[
                {
                    "name": "Food Recommendation System",
                    "description": "ML-based food recommendation engine using collaborative filtering and content-based approaches.",
                    "technologies": ["Python", "Scikit-learn", "Flask", "PostgreSQL"],
                    "url": "https://github.com/ruthi/food-recommender"
                },
                {
                    "name": "Task Management App",
                    "description": "Full-stack task management application with real-time updates and team collaboration features.",
                    "technologies": ["React", "FastAPI", "Docker", "WebSocket"],
                    "url": "https://github.com/ruthi/task-manager"
                }
            ],
            certifications=["AWS Cloud Practitioner", "Google IT Support"],
            github_url="https://github.com/ruthi",
            linkedin_url="https://linkedin.com/in/ruthi",
            career_preferences={
                "preferred_roles": ["Software Engineer", "Full Stack Developer", "Backend Developer"],
                "preferred_locations": ["Bangalore", "Chennai", "Remote"],
                "job_type": "full-time"
            }
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id, name=profile_in.name)
        db.add(profile)

    profile.name = profile_in.name
    profile.education = profile_in.education
    profile.experience = profile_in.experience
    profile.projects = profile_in.projects
    profile.certifications = profile_in.certifications
    profile.career_preferences = profile_in.career_preferences
    profile.github_url = profile_in.github_url
    profile.linkedin_url = profile_in.linkedin_url

    db.commit()
    db.refresh(profile)
    return profile
