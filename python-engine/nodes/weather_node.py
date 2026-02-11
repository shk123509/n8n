import os
import requests
from dotenv import load_dotenv
from graph.state import State

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

def weather_node(state: State) -> State:
    print("🌦 weather node running")

    query = state["query"]

    # -------- Extract City Using Simple Logic --------
    # You can improve this later using LLM extraction
    city = query.lower().replace("weather in", "").strip()

    url = "https://weatherapi-com.p.rapidapi.com/current.json"

    querystring = {"q": city}

    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        data = response.json()

        if "error" in data:
            state["response"] = "❌ City not found. Please try again."
            return state

        location = data["location"]["name"]
        country = data["location"]["country"]
        temp = data["current"]["temp_c"]
        condition = data["current"]["condition"]["text"]
        humidity = data["current"]["humidity"]
        wind = data["current"]["wind_kph"]

        result = f"""
🌍 Location: {location}, {country}
🌡 Temperature: {temp}°C
☁ Condition: {condition}
💧 Humidity: {humidity}%
🌬 Wind Speed: {wind} kph
"""

        state["response"] = result
        return state

    except Exception as e:
        state["response"] = "❌ Weather service error."
        return state
