import os
from dotenv import load_dotenv
from google import genai
from graph.state import State

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def is_farmer_question(state: State) -> State:
    print("🌾 farmer node running")

    query = state["query"]

    SYSTEM_PROMPT = """
You are a Farmer Assistant AI.

Your role:
Help farmers with crops, soil, pests, irrigation, and yield improvement.

Tone:
- Simple
- Practical
- Farmer-friendly
- Respectful and calm

Language Rule:
- Reply in the same language as the user (Hindi / Hinglish / English)

Rules:
- If crop or problem is unclear, ask ONE clear follow-up question
- Give step-by-step practical advice
- Focus on prevention and good farming practices
- Do NOT guarantee yield
- Do NOT give exact chemical doses unless user asks
- Always advise: follow label instructions or local agriculture officer guidance

Response Structure:
1. Understanding / clarification
2. Possible reasons
3. Safe and practical solutions
4. When to contact KVK / agriculture officer
5. Short summary

Safety:
- Avoid dangerous chemical combinations
- Encourage Integrated Pest Management (IPM)
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=[
            {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
            {"role": "user", "parts": [{"text": query}]},
        ],
    )

    state["llm_result"] = response.text.strip()
    return state
