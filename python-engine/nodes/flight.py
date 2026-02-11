import os
import requests
import json
from dotenv import load_dotenv
from graph.state import State
from google import genai
from datetime import datetime

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

gemini_client = genai.Client(api_key=GEMINI_API_KEY)


def flight_status_node(state: State) -> State:
    print("✈️ Flight Status node running")

    user_query = state["query"]

    # 1️⃣ EXTRACT FLIGHT NUMBER USING GEMINI
    intent_prompt = f"""
Extract the flight number from the text below.

Rules:
- Remove greetings and filler words
- Keep airline code + number only (example: AS2223, AI302, 6E213)
- Uppercase
- No explanation

User text:
{user_query}

Return ONLY the flight number.
"""

    intent_response = gemini_client.models.generate_content(
        model="gemini-flash-latest",
        contents=intent_prompt
    )

    flight_number = intent_response.text.strip().upper()
    print("✈️ Cleaned flight number:", flight_number)

    if not flight_number or len(flight_number) < 4:
        state["llm_result"] = "❌ Flight number not found. Please provide a valid flight number."
        return state

    # 2️⃣ AERODATABOX API CALL (NEAREST DAY)
    url = f"https://aerodatabox.p.rapidapi.com/flights/number/{flight_number}"

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        state["llm_result"] = "❌ Unable to fetch flight status at the moment."
        return state

    flights = response.json()

    if not flights:
        state["llm_result"] = "❌ No flight information found for this number."
        return state

    flight = flights[0]   # nearest/latest flight

    # 3️⃣ PREPARE RAW FLIGHT DATA
    raw_flight = {
        "flight_number": flight.get("number"),
        "airline": flight.get("airline", {}).get("name"),
        "status": flight.get("status"),
        "departure_airport": flight.get("departure", {}).get("airport", {}).get("name"),
        "arrival_airport": flight.get("arrival", {}).get("airport", {}).get("name"),
        "departure_time": flight.get("departure", {}).get("scheduledTime", {}).get("local"),
        "arrival_time": flight.get("arrival", {}).get("scheduledTime", {}).get("local"),
        "terminal": flight.get("departure", {}).get("terminal"),
        "gate": flight.get("departure", {}).get("gate"),
        "aircraft": flight.get("aircraft", {}).get("model"),
        "last_updated": flight.get("lastUpdatedUtc")
    }

    # 4️⃣ GEMINI FORMATTING
    prompt = f"""
You are a flight travel assistant.

TASK:
- Present flight status clearly
- Use simple and user-friendly language
- Mention airline, route, and status
- If data is missing, say "Not available"
- Do NOT guess

Return output in this format ONLY:

Flight Status Summary:
(2–3 lines overview)

Flight Details:
Flight Number:
Airline:
From:
To:
Status:
Scheduled Departure:
Scheduled Arrival:
Terminal:
Gate:
Aircraft:

Flight Data:
{json.dumps(raw_flight, indent=2)}
"""

    response = gemini_client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    state["llm_result"] = response.text.strip()
    return state
