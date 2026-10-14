from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

# Auth schemas
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Profile schemas
class ProfileBase(BaseModel):
    name: str
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    certifications: List[str] = []
    career_preferences: Dict[str, Any] = {}
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    user_id: str
    updated_at: datetime

    class Config:
        from_attributes = True

# Job schemas
class JobCreate(BaseModel):
    title: str
    company: str
    description: str

class JobResponse(BaseModel):
    id: str
    user_id: str
    title: str
    company: str
    description: str
    parsed_requirements: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True

# Match schemas
class MatchResponse(BaseModel):
    id: str
    user_id: str
    job_id: str
    overall_score: float
    category_scores: Dict[str, float]
    skill_matches: List[Dict[str, Any]]
    evidence_map: List[Dict[str, Any]]
    gap_analysis: Dict[str, Any]
    analyzed_at: datetime

    class Config:
        from_attributes = True

# Interview schemas
class InterviewCreate(BaseModel):
    job_id: Optional[str] = None
    difficulty: str = "medium"
    focus_area: str = "Full Stack"

class InterviewAnswerSubmit(BaseModel):
    question_index: int
    user_answer: str

class InterviewResponse(BaseModel):
    id: str
    user_id: str
    job_id: Optional[str] = None
    difficulty: str
    focus_area: str
    overall_score: float
    status: str
    questions: List[Dict[str, Any]]
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Chat schemas
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    id: str
    user_message: str
    ai_response: str
    sources: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Roadmap schemas
class RoadmapResponse(BaseModel):
    id: str
    user_id: str
    job_id: Optional[str] = None
    weeks: List[Dict[str, Any]]
    generated_at: datetime

    class Config:
        from_attributes = True
