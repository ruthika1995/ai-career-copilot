import json
import logging
import urllib.request
import re
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# Try configuring Google Gemini if key provided
try:
    import google.generativeai as genai
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
except Exception:
    pass

class AIService:
    def __init__(self):
        self.openrouter_key = settings.OPENROUTER_API_KEY
        self.openrouter_model = settings.OPENROUTER_MODEL or "nvidia/nemotron-3.5-lightning:free"
        self.gemini_key = settings.GEMINI_API_KEY
        self.gemini_model = settings.GEMINI_MODEL

    def _call_openrouter(self, prompt: str, system_prompt: str = "") -> Optional[str]:
        if not self.openrouter_key:
            return None

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openrouter_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "AI Career Copilot"
        }

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        # Try primary model then secondary free model
        models_to_try = [
            self.openrouter_model,
            "liquid/lfm-2.5-2.6b:free",
            "nvidia/nemotron-3.5-lightning:free"
        ]

        for model in models_to_try:
            payload = {
                "model": model,
                "messages": messages,
                "temperature": 0.2
            }
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers=headers
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    res = json.loads(resp.read().decode("utf-8"))
                    choices = res.get("choices", [])
                    if choices and "message" in choices[0]:
                        content = choices[0]["message"]["content"]
                        return content.strip()
            except Exception as e:
                logger.warning(f"OpenRouter attempt with {model} failed: {e}")
                continue

        return None

    def _call_gemini(self, prompt: str) -> Optional[str]:
        if not self.gemini_key:
            return None
        try:
            import google.generativeai as genai
            model = genai.GenerativeModel(self.gemini_model)
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.warning(f"Gemini generation failed: {e}")
            return None

    def generate_json(self, prompt: str, fallback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Call OpenRouter or Gemini to generate structured JSON, falling back cleanly."""
        sys_prompt = "You are an expert AI Career Intelligence engine. You MUST respond with pure, valid JSON only. Do not output markdown fences or explanatory text."
        
        # 1. Try OpenRouter
        raw = self._call_openrouter(prompt, system_prompt=sys_prompt)
        
        # 2. Try Gemini
        if not raw:
            raw = self._call_gemini(f"{prompt}\n\nIMPORTANT: Respond with pure JSON only.")

        if raw:
            try:
                # Clean markdown fences if any
                cleaned = raw.strip()
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:]
                elif cleaned.startswith("```"):
                    cleaned = cleaned[3:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]
                cleaned = cleaned.strip()
                
                # Extract first { ... } or [ ... ]
                match = re.search(r'(\{.*\}|\[.*\])', cleaned, re.DOTALL)
                if match:
                    cleaned = match.group(1)

                return json.loads(cleaned)
            except Exception as e:
                logger.error(f"Failed to parse LLM JSON output: {e}. Raw: {raw[:200]}")

        return fallback_data

    def generate_text(self, prompt: str, fallback_text: str) -> str:
        """Generate text response using OpenRouter or Gemini."""
        sys_prompt = "You are an elite career advisor and engineering mentor. Provide concise, clear, and actionable career advice."
        raw = self._call_openrouter(prompt, system_prompt=sys_prompt)
        if not raw:
            raw = self._call_gemini(prompt)
        if raw:
            return raw
        return fallback_text

gemini_service = AIService()
