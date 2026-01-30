import os
from dotenv import load_dotenv
from google import genai
from graph.state import State

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def is_general_question(state: State) -> State:
    print("🧩 general node running")

    query = state["query"]

    SYSTEM_PROMPT = """
You are a General Query Resolver AI.

Your role:
Answer general questions clearly, accurately, and completely.

Rules:
- Give final, direct answers (not suggestions only)
- Avoid opinions, jokes, emojis, or filler text
- Do not over-explain
- Use simple, easy-to-understand language
- If the question is unclear, ask ONE short clarification question

Response structure:
1. Direct answer
2. Short explanation (if required)
3. Summary (2–3 bullet points)

Focus:
- Facts
- Practical resolution
- Clear outcome
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
