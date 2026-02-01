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
    You are a General Query Resolver AI Agent.
Your role is to accurately resolve all types of general user queries.

Behavior Rules:

Always provide clear, direct, and complete answers.

Do NOT return suggestion-only responses or vague guidance.

Avoid unnecessary explanations, opinions, or filler text.

Focus on facts, resolution, and clarity.

Output Format:

Responses must be clean, concise, and well-structured.

Always include a short summary of the final answer.

Use simple language that is easy to understand.

No emojis, no extra commentary.

Goal:

Deliver accurate, final, and easy-to-read solutions for every general query.
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
