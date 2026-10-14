from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Roadmap, Job, JobMatch
from app.schemas.schemas import RoadmapResponse
from app.services.gemini_service import gemini_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/roadmap", tags=["Learning Roadmap"])

@router.get("", response_model=RoadmapResponse)
def get_roadmap(
    job_id: str = "1",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.user_id == current_user.id,
        Roadmap.job_id == job_id
    ).first()

    if not roadmap:
        # Default 4-week roadmap
        weeks_data = [
            {
                "week": 1,
                "title": "Java Fundamentals",
                "topics": [
                    {
                        "name": "Core Java",
                        "subtopics": ["OOP Concepts", "Collections Framework", "Streams API", "Exception Handling"]
                    },
                    {
                        "name": "Build Tools",
                        "subtopics": ["Maven", "Gradle basics"]
                    }
                ]
            },
            {
                "week": 2,
                "title": "Spring Boot & REST APIs",
                "topics": [
                    {
                        "name": "Spring Core",
                        "subtopics": ["Dependency Injection", "REST Controllers", "JPA & Hibernate", "Spring Security"]
                    },
                    {
                        "name": "Database",
                        "subtopics": ["JPA Repositories", "Query Methods", "Migrations with Flyway"]
                    }
                ],
                "project": "Build a REST API for a bookstore using Spring Boot + PostgreSQL"
            },
            {
                "week": 3,
                "title": "Cloud & Containerization (AWS)",
                "topics": [
                    {
                        "name": "Compute & Storage",
                        "subtopics": ["EC2 Instances", "S3 Buckets", "IAM Roles & Policies"]
                    },
                    {
                        "name": "Database & Deploy",
                        "subtopics": ["RDS", "Elastic Beanstalk", "CloudWatch"]
                    }
                ]
            },
            {
                "week": 4,
                "title": "Portfolio Capstone Project",
                "topics": [
                    {
                        "name": "Full Application",
                        "subtopics": ["Spring Boot REST API", "React Frontend", "PostgreSQL on RDS", "Deploy to AWS"]
                    }
                ],
                "project": "Deploy your Spring Boot + React application with Docker and GitHub Actions CI/CD"
            }
        ]

        roadmap = Roadmap(
            user_id=current_user.id,
            job_id=job_id,
            weeks=weeks_data
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)

    return roadmap
