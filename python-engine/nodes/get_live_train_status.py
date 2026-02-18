import os
import json
import http.client
import re
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")



def live_train_status_node(state: State) -> State:
    print("🚆 Live Train Status node running")

    query = state["query"]

    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state
    

    client = genai.Client(api_key=user_key)

    # 1️⃣ Extract train number
    match = re.search(r"\b\d{4,5}\b", query)
    if not match:
        state["llm_result"] = "❌ Train number not found in query."
        return state

    train_number = match.group()

    # 2️⃣ Call IRCTC API
    conn = http.client.HTTPSConnection("irctc-api2.p.rapidapi.com")
    headers = {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": "irctc-api2.p.rapidapi.com"
    }

    endpoint = f"/liveTrain?trainNumber={train_number}&startDay=1"
    conn.request("GET", endpoint, headers=headers)

    res = conn.getresponse()
    data = json.loads(res.read().decode("utf-8"))

    if not data or "data" not in data:
        state["llm_result"] = "❌ Live train status unavailable right now."
        return state

    train = data["data"]

    # 3️⃣ Prepare RAW info for Gemini
    raw_info = {
        "train_name": train.get("train_name"),
        "train_number": train_number,
        "current_station": train.get("current_station_name"),
        "delay_minutes": train.get("delay"),
        "next_station": train.get("next_station_name"),
        "status": train.get("status")
    }

    # 4️⃣ Gemini Prompt (IMPORTANT)
    prompt = f"""
You are a railway status assistant.

Convert the given train live status data into a clear,
polite, and professional response.

Rules:
- Sound natural and confident
- Avoid robotic language
- Use simple railway-style wording
- Keep it concise but informative
- If next station is missing, clearly mention it

Do not add assumptions.
Do not use markdown symbols like ** or ###.

Train data:


Train data:
{json.dumps(raw_info, indent=2)}
"""

    # 5️⃣ Gemini LLM call
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    state["llm_result"] = response.text.strip()
    return state
