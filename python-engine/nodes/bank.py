import os
import requests
import json
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")


def bank_ifsc_micr_node(state: State) -> State:
    print("🏦 Bank IFSC/MICR node running")

    user_query = state["query"]
    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state

    client = genai.Client(api_key=user_key)

    # 1️⃣ Extract search value (IFSC / MICR / City)
    intent_prompt = f"""
Extract bank search value from the text.

Rules:
- Could be IFSC, MICR, or city name
- Return only the value
- No explanation

User text:
{user_query}

Return ONLY the search value.
"""

    intent_response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=intent_prompt
    )

    search_value = intent_response.text.strip()
    print("🏦 Search value:", search_value)

    if not search_value:
        state["llm_result"] = "❌ Bank search value not found."
        return state

    # 2️⃣ RapidAPI call
    url = "https://banksindia.p.rapidapi.com/v1/bank/ifsc-micr/india"

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "banksindia.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    payload = {
        "search": search_value
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200:
        state["llm_result"] = "❌ Unable to fetch bank details."
        return state

    api_response = response.json()

    # 3️⃣ SAFE RESPONSE PARSING (BUG FIX)
    if isinstance(api_response, dict) and "data" in api_response:
        results = api_response["data"]
    elif isinstance(api_response, list):
        results = api_response
    else:
        results = []

    if not results:
        state["llm_result"] = "❌ No bank information found."
        return state

    # Take first result
    bank = results[0]

    # 4️⃣ CORRECT KEY MAPPING (lowercase keys)
    raw_bank = {
        "bank": bank.get("bank"),
        "branch": bank.get("branch"),
        "ifsc": bank.get("ifsc"),
        "micr": bank.get("micr"),
        "address": bank.get("address"),
        "city": bank.get("city"),
        "state": bank.get("state"),
        "contact": bank.get("contact")
    }

    # 5️⃣ Gemini formatting
    prompt = f"""
You are a banking assistant.

TASK:
- Present bank details clearly
- Use simple professional language
- If data missing say "Not available"
- Do NOT guess

Return output in this format ONLY:

Bank Details Summary:
(1–2 lines)

Bank Information:
Bank Name:
Branch:
IFSC:
MICR:
Address:
City:
State:
Contact:

Bank Data:
{json.dumps(raw_bank, indent=2)}
"""

    final_response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    state["llm_result"] = final_response.text.strip()
    return state
