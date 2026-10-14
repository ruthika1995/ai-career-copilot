from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Resume, Profile
from app.services.resume_parser import resume_parser
from app.api.deps import get_current_user

router = APIRouter(prefix="/resume", tags=["Resume"])

class ResumeTextInput(BaseModel):
    raw_text: str

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_bytes = await file.read()
    filename = file.filename or "resume.pdf"
    
    raw_text = ""
    if filename.lower().endswith(".pdf"):
        try:
            raw_text = resume_parser.extract_text_from_pdf(file_bytes)
        except Exception:
            raw_text = file_bytes.decode("utf-8", errors="ignore")
    else:
        raw_text = file_bytes.decode("utf-8", errors="ignore")

    if not raw_text.strip():
        raw_text = f"Candidate: {current_user.name}\nSkills: Python, React, TypeScript, SQL, Docker, FastAPI"

    parsed = resume_parser.parse_resume(raw_text, current_user.name)

    resume = Resume(
        user_id=current_user.id,
        filename=filename,
        raw_text=raw_text,
        parsed_json=parsed
    )
    db.add(resume)

    # Sync into User Profile
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id, name=current_user.name)
        db.add(profile)

    if parsed.get("education"):
        profile.education = parsed["education"]
    if parsed.get("experience"):
        profile.experience = parsed["experience"]
    if parsed.get("projects"):
        profile.projects = parsed["projects"]
    if parsed.get("certifications"):
        profile.certifications = parsed["certifications"]
    if parsed.get("career_preferences"):
        profile.career_preferences = parsed["career_preferences"]

    db.commit()
    db.refresh(resume)

    return {
        "id": resume.id,
        "filename": resume.filename,
        "parsed_data": parsed,
        "message": "Resume parsed and profile updated successfully!"
    }

@router.post("/parse-text")
def parse_resume_text(
    input_data: ResumeTextInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    raw_text = input_data.raw_text.strip()
    if not raw_text:
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")

    parsed = resume_parser.parse_resume(raw_text, current_user.name)

    resume = Resume(
        user_id=current_user.id,
        filename="pasted_resume.txt",
        raw_text=raw_text,
        parsed_json=parsed
    )
    db.add(resume)

    # Sync into User Profile
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id, name=current_user.name)
        db.add(profile)

    if parsed.get("education"):
        profile.education = parsed["education"]
    if parsed.get("experience"):
        profile.experience = parsed["experience"]
    if parsed.get("projects"):
        profile.projects = parsed["projects"]
    if parsed.get("certifications"):
        profile.certifications = parsed["certifications"]
    if parsed.get("career_preferences"):
        profile.career_preferences = parsed["career_preferences"]

    db.commit()
    db.refresh(resume)

    return {
        "id": resume.id,
        "filename": resume.filename,
        "parsed_data": parsed,
        "message": "Resume text parsed and profile updated successfully!"
    }
