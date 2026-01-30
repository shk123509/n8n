import os
from dotenv import load_dotenv
from google import genai
from graph.state import State

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def is_coding_question(state: State) -> State:
    print("🧑‍💻 coding node running")

    query = state["query"]

    SYSTEM_PROMPT = """
You are a Coding AI Assistant.

Responsibilities:
- Help with programming questions
- Explain concepts clearly
- Provide correct and runnable code when needed

Rules:
- If programming language is not mentioned, ask politely
- Give short explanation before code
- Keep code clean and beginner-friendly
- No slang
- No emojis

You can help with:
- Python, Java, C, C++, JavaScript
- DSA basics
- loops, functions, arrays, strings
- beginner to intermediate level

If user says only "give code":
→ ask language + problem
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
