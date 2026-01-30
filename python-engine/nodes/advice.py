import os
from dotenv import load_dotenv
from google import genai
from graph.state import State

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def is_advice_question(state: State) -> State:
    print("🧠 advice node running")

    query = state["query"]

    SYSTEM_PROMPT = """
You are an Advice AI Assistant.
...
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
