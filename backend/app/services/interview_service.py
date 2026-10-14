from typing import Dict, Any, List
from app.services.gemini_service import gemini_service

class InterviewService:
    def generate_questions(self, job_title: str, focus_area: str, difficulty: str) -> List[Dict[str, Any]]:
        fallback = [
            {
                "id": "1",
                "sequence": 1,
                "question": f"Explain the core design patterns and architecture you would use when building a scalable {focus_area} system for {job_title}.",
                "difficulty_level": difficulty,
                "user_answer": None,
                "evaluation": None
            },
            {
                "id": "2",
                "sequence": 2,
                "question": "How do you handle database connection pooling, indexing, and slow query optimization in a high-traffic production service?",
                "difficulty_level": difficulty,
                "user_answer": None,
                "evaluation": None
            },
            {
                "id": "3",
                "sequence": 3,
                "question": "Describe a challenging bug you encountered in a recent project. How did you diagnose the root cause and ensure it won't reoccur?",
                "difficulty_level": difficulty,
                "user_answer": None,
                "evaluation": None
            }
        ]

        prompt = f"""Generate 3 technical interview questions for a {difficulty}-level interview for a {job_title} role specializing in {focus_area}.
Output JSON format:
[
  {{"id": "1", "sequence": 1, "question": "...", "difficulty_level": "{difficulty}", "user_answer": null, "evaluation": null}},
  {{"id": "2", "sequence": 2, "question": "...", "difficulty_level": "{difficulty}", "user_answer": null, "evaluation": null}},
  {{"id": "3", "sequence": 3, "question": "...", "difficulty_level": "{difficulty}", "user_answer": null, "evaluation": null}}
]
"""
        res = gemini_service.generate_json(prompt, fallback)
        if isinstance(res, list) and len(res) >= 1:
            return res
        return fallback

    def evaluate_answer(self, question: str, answer: str) -> Dict[str, Any]:
        fallback = {
            "technical_accuracy": 8,
            "clarity": 8,
            "depth": 7,
            "communication": 8,
            "overall": 8,
            "feedback": "Strong answer covering the essential principles. To make it stand out further, cite specific tools, metric improvements, or tradeoffs you evaluated."
        }

        prompt = f"""Evaluate this candidate's interview answer to the question:
Question: {question}
Candidate Answer: {answer}

Provide evaluation scores out of 10 for:
technical_accuracy, clarity, depth, communication, overall, and constructive feedback text.
Return JSON:
{{
  "technical_accuracy": 8,
  "clarity": 8,
  "depth": 7,
  "communication": 8,
  "overall": 8,
  "feedback": "..."
}}
"""
        return gemini_service.generate_json(prompt, fallback)

interview_service = InterviewService()
