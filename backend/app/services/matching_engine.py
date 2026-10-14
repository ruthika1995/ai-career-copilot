from typing import Dict, Any, List
import re

class MatchingEngine:
    def analyze_match(self, profile: Dict[str, Any], job_requirements: Dict[str, Any]) -> Dict[str, Any]:
        required_skills = job_requirements.get("required_skills", ["Python", "SQL", "Docker", "Git"])
        soft_skills_req = job_requirements.get("soft_skills", ["Communication", "Problem Solving"])

        # Candidate skills
        candidate_skills_set = set()
        for p in profile.get("projects", []):
            for t in p.get("technologies", []):
                candidate_skills_set.add(t.lower())
        for exp in profile.get("experience", []):
            for t in exp.get("technologies", []):
                candidate_skills_set.add(t.lower())
        for s in profile.get("skills", []):
            candidate_skills_set.add(s.lower() if isinstance(s, str) else s.get("name", "").lower())

        skill_matches = []
        evidence_map = []
        matched_count = 0

        for skill in required_skills:
            skill_lower = skill.lower()
            matched = False
            evidence_str = ""
            source_str = ""

            # Check projects
            for p in profile.get("projects", []):
                techs = [t.lower() for t in p.get("technologies", [])]
                if skill_lower in techs or skill_lower in p.get("description", "").lower():
                    matched = True
                    evidence_str = f"Demonstrated in project '{p.get('name')}' ({p.get('description')[:60]}...)"
                    source_str = f"Project: {p.get('name')}"
                    break

            # Check experience
            if not matched:
                for exp in profile.get("experience", []):
                    techs = [t.lower() for t in exp.get("technologies", [])]
                    if skill_lower in techs or skill_lower in exp.get("description", "").lower():
                        matched = True
                        evidence_str = f"Applied as {exp.get('title')} at {exp.get('company')}"
                        source_str = f"Experience: {exp.get('company')}"
                        break

            if not matched and skill_lower in candidate_skills_set:
                matched = True
                evidence_str = f"Listed in verified profile competencies"
                source_str = "Profile: Verified Skills"

            if matched:
                matched_count += 1
                skill_matches.append({
                    "skill": skill,
                    "matched": True,
                    "match_type": "exact",
                    "similarity_score": 1.0,
                    "evidence": evidence_str,
                    "source": source_str
                })
                evidence_map.append({
                    "skill": skill,
                    "evidence": evidence_str,
                    "source": source_str,
                    "confidence": 0.95
                })
            else:
                skill_matches.append({
                    "skill": skill,
                    "matched": False,
                    "match_type": "none",
                    "similarity_score": 0.0,
                    "evidence": None,
                    "source": None
                })

        # Category scores
        total_req = max(len(required_skills), 1)
        tech_score = min(100.0, round((matched_count / total_req) * 100, 1))
        projects_score = min(100.0, round(len(profile.get("projects", [])) * 30.0, 1))
        experience_score = 75.0 if profile.get("experience") else 60.0
        education_score = 95.0 if profile.get("education") else 70.0
        soft_skills_score = 80.0

        # Explainable formula: 40% tech, 25% projects, 20% experience, 10% education, 5% soft
        overall_score = round(
            (0.40 * tech_score) +
            (0.25 * projects_score) +
            (0.20 * experience_score) +
            (0.10 * education_score) +
            (0.05 * soft_skills_score),
            1
        )

        missing_skills = [m["skill"] for m in skill_matches if not m["matched"]]
        present_skills = [m["skill"] for m in skill_matches if m["matched"]]

        gap_analysis = {
            "critical_gaps": missing_skills[:3],
            "must_learn": missing_skills[:2],
            "good_to_have": missing_skills[2:],
            "already_strong": present_skills
        }

        return {
            "overall_score": overall_score,
            "category_scores": {
                "technical": tech_score,
                "projects": projects_score,
                "experience": experience_score,
                "education": education_score,
                "soft_skills": soft_skills_score
            },
            "skill_matches": skill_matches,
            "evidence_map": evidence_map,
            "gap_analysis": gap_analysis
        }

matching_engine = MatchingEngine()
