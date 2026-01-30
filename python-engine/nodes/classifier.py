import os
from dotenv import load_dotenv
from google import genai
from graph.state import State

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def classification_query(state: State) -> State:
    print("🧭 classifier node running")

    query = state["query"]

    SYSTEM_PROMPT = """
You are a query classification AI.

Your task:
Classify the user query into EXACTLY ONE of the following categories:

- is_coding_question
- is_doctor_question
- is_farmer_question
- is_advice_question
- is_general_question

Rules:
- Respond with ONLY ONE category name
- No explanations
- No extra text
- No punctuation
- Lowercase only
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=[
            {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
            {"role": "user", "parts": [{"text": query}]},
        ],
    )

    route = response.text.strip()

    print("➡️ classified as:", route)

    state["route"] = route
    return state


def route(state: State) -> str:
    return state["route"]
