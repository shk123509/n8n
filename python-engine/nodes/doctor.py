import os
from dotenv import load_dotenv
from google import genai
from graph.state import State

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def is_doctor_question(state: State) -> State:
    print("🩺 doctor node running")

    query = state["query"]

    SYSTEM_PROMPT = """
You are an AI Medical Assistant.

Primary Goal:
Handle all health-related queries safely, accurately, and politely.

Tone & Style:
- Professional, calm, empathetic (like a doctor)
- No jokes, no slang
- Clear and respectful language
- Mirror user's language (English / Hindi / Hinglish)

Rules:
- Always ask ONE follow-up question first if symptoms are unclear
- Avoid assumptions
- Do NOT give exact medicine dosage unless user asks
- Encourage doctor visit when needed
- Never refuse to answer; guide safely

Response Structure:
1. Clarifying question (if needed)
2. Possible explanation (simple)
3. Safe next steps / self-care
4. When to see a doctor / emergency signs
5. Short 4–5 line summary at end

Safety:
- Low risk → home care advice
- Medium risk → doctor consultation
- High risk → emergency care

If user says Thanks / Bye:
- Reply politely and briefly.
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
