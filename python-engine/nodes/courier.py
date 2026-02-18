import os
import requests
import json
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")


def courier_tracking_node(state: State) -> State:
    print("📦 Courier Tracking node running")

    user_query = state["query"]
    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state

    client = genai.Client(api_key=user_key)

    # 1️⃣ Extract tracking number
    intent_prompt = f"""
Extract only the courier tracking number from this text.
No explanation.

User text:
{user_query}
"""
    intent_response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=intent_prompt
    )

    tracking_number = intent_response.text.strip()
    print("📦 Extracted tracking number:", tracking_number)

    if not tracking_number:
        state["llm_result"] = "❌ Tracking number not found."
        return state

    # 2️⃣ CORRECT RapidAPI Endpoint
    url = "https://cheap-tracking-status.p.rapidapi.com/TrackingGetTrackingDetails"

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "cheap-tracking-status.p.rapidapi.com",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    # ⚠️ IMPORTANT: BODY KEY MUST BE "TrackingCode" (Capital T & C)
    payload = {
        "TrackingCode": tracking_number
    }

    response = requests.post(url, headers=headers, json=payload)

    print("Status Code:", response.status_code)
    print("Response:", response.text)

    if response.status_code != 200:
        state["llm_result"] = f"❌ API Error: {response.status_code}"
        return state

    data = response.json().get("data")

    if not data or "events" not in data or len(data["events"]) == 0:
        state["llm_result"] = "❌ No tracking information found."
        return state

    latest_event = data["events"][0]

    raw_tracking = {
        "tracking_number": data.get("tracking_number"),
        "status": latest_event.get("status"),
        "current_location": latest_event.get("location") or "Not available",
        "last_updated": latest_event.get("datetime"),
        "courier": latest_event.get("courier", {}).get("translation", {}).get("name")
    }

    # 3️⃣ Format with Gemini
    prompt = f"""
You are a courier tracking assistant.

Return output in this format:

Shipment Status Summary:
(2 lines)

Shipment Details:
Tracking Number:
Courier:
Status:
Current Location:
Last Updated:

Data:
{json.dumps(raw_tracking, indent=2)}
"""

    result = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    state["llm_result"] = result.text.strip()
    return state
