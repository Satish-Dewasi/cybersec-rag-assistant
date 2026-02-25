from typing import List, Dict
import os
from urllib import response
import requests
from dotenv import load_dotenv

class LLMRateLimitException(Exception):
    """Raised when the LLM provider hits rate limits."""
    pass  


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
BASE_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"
class CyberThreatGenerator:

    def generate(
        self,
        query: str,
        retrieved_docs: List[Dict],
        confidence_level: str
    ) -> str:

        if confidence_level == "low":
            return (
                "The query appears to be outside the cybersecurity "
                "threat intelligence domain based on current knowledge base."
            )

        context = "\n\n".join(
            [doc["text"][:1000] for doc in retrieved_docs]
        )

        if confidence_level == "medium":
            system_instruction = (
                "Provide a cautious and transparent response. "
                "Mention that relevance confidence is moderate."
            )
        else:
            system_instruction = (
                "Provide a confident and structured cybersecurity analysis."
            )

        prompt = f"""
You are a Cybersecurity Threat Intelligence Assistant.

{system_instruction}

User Query:
{query}

Relevant Threat Intelligence Data:
{context}

Generate a clear, structured explanation.
"""

        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }

        response = requests.post(
            f"{BASE_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=payload
        )

        if response.status_code == 429:
            raise LLMRateLimitException(
                "The intelligence processing engine is temporarily rate-limited due to usage caps. "
                "Please retry shortly. The system will recover automatically."
            )

        if response.status_code != 200:
            raise Exception("LLM provider failure.")

        result = response.json()

        return result["candidates"][0]["content"]["parts"][0]["text"]
    

      