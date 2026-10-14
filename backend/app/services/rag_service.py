from typing import Dict, Any, List
from app.services.gemini_service import gemini_service

KNOWLEDGE_BASE = [
    {
        "topic": "Resume Bullet Formula",
        "content": "Use Google's XYZ formula: Accomplished [X] as measured by [Y], by doing [Z]. Always begin bullets with active verbs and quantify impact."
    },
    {
        "topic": "System Design for Freshers",
        "content": "Focus on horizontal vs vertical scaling, stateless services, cache invalidation with Redis, database indexing, and REST vs message queues."
    },
    {
        "topic": "Portfolio Standouts",
        "content": "A high-impact project has live deployment URL, GitHub repository with clean README and architecture diagram, integration tests, and Docker containerization."
    }
]

class RAGService:
    def answer_query(self, user_message: str, candidate_context: str = "") -> Dict[str, Any]:
        sources = [k["topic"] for k in KNOWLEDGE_BASE]

        fallback_response = f"""Based on standard engineering career guidelines and your current profile:

1. **Strategic Prioritization**: When applying for software engineering roles, focus on building demonstrable depth in 1-2 core backend languages (e.g., Python/Java) and containerization via Docker.
2. **Quantified Outcomes**: Frame your projects using measurable metrics (e.g., "Reduced response latency by 35% through database indexing").
3. **Interview Preparation**: Practice writing clean code and explaining trade-offs aloud using the STAR method (Situation, Task, Action, Result).
"""

        prompt = f"""You are an elite career advisor and engineering mentor.
Context from Knowledge Base:
{KNOWLEDGE_BASE}

Candidate Background:
{candidate_context}

User question:
{user_message}

Provide actionable, clear, encouraging, and technically rigorous guidance:
"""
        ans = gemini_service.generate_text(prompt, fallback_response)
        return {
            "ai_response": ans,
            "sources": sources
        }

rag_service = RAGService()
