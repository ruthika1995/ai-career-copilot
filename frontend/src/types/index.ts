// ========================================
// AI Career Copilot — Type Definitions
// ========================================

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: string[];
  github_url: string;
  linkedin_url: string;
  career_preferences: CareerPreferences;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  graduation_year: number;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface CareerPreferences {
  preferred_roles: string[];
  preferred_locations: string[];
  job_type: 'full-time' | 'part-time' | 'internship' | 'contract';
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  evidence?: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  raw_text: string;
  parsed_data: ParsedResume;
  uploaded_at: string;
}

export interface ParsedResume {
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description: string;
  parsed_requirements: ParsedJob;
  created_at: string;
}

export interface ParsedJob {
  required_skills: string[];
  soft_skills: string[];
  experience_level: string;
  responsibilities: string[];
  qualifications: string[];
}

export interface JobMatch {
  id: string;
  user_id: string;
  job_id: string;
  overall_score: number;
  category_scores: CategoryScores;
  skill_matches: SkillMatch[];
  evidence_map: EvidenceItem[];
  gap_analysis: GapAnalysis;
  analyzed_at: string;
}

export interface CategoryScores {
  technical: number;
  experience: number;
  projects: number;
  education: number;
  soft_skills: number;
}

export interface SkillMatch {
  skill: string;
  matched: boolean;
  match_type: 'exact' | 'semantic' | 'none';
  similarity_score?: number;
  evidence?: string;
  source?: string;
}

export interface EvidenceItem {
  skill: string;
  evidence: string;
  source: string;
  confidence: number;
}

export interface GapAnalysis {
  critical_gaps: string[];
  must_learn: string[];
  good_to_have: string[];
  already_strong: string[];
}

export interface LearningRoadmap {
  id: string;
  weeks: RoadmapWeek[];
  generated_at: string;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  topics: RoadmapTopic[];
  project?: string;
}

export interface RoadmapTopic {
  name: string;
  subtopics: string[];
  resources?: string[];
}

export interface Interview {
  id: string;
  job_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  focus_area: string;
  overall_score: number;
  status: 'in_progress' | 'completed';
  questions: InterviewQuestion[];
  started_at: string;
  completed_at?: string;
}

export interface InterviewQuestion {
  id: string;
  sequence: number;
  question: string;
  user_answer?: string;
  evaluation?: InterviewEvaluation;
  difficulty_level: string;
}

export interface InterviewEvaluation {
  technical_accuracy: number;
  clarity: number;
  depth: number;
  communication: number;
  overall: number;
  feedback: string;
}

export interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  sources?: string[];
  created_at: string;
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
