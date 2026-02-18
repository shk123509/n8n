import os
import json
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from pymongo import MongoClient
from graph.state import State

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")

# Gemini Client


# MongoDB Connection
client = MongoClient(MONGO_URI)
db = client["ai_assistant"]
collection = db["expenses"]


def expense_tracker_node(state: State) -> State:
    print("💰 Expense Tracker node running")

    user_query = state["query"]

    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state
    

    client = genai.Client(api_key=user_key)

    # 1️⃣ Extract amount + category using Gemini
    extraction_prompt = f"""
Extract expense details from text.

Rules:
- Extract amount (number only)
- Extract category (food, petrol, shopping, recharge, travel, bills, other)
- If category unclear → use "other"
- Return ONLY JSON format

Example output:
{{
  "amount": 450,
  "category": "food"
}}

User text:
{user_query}
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=extraction_prompt
    )

    try:
        extracted_data = json.loads(response.text.strip())
        amount = extracted_data.get("amount")
        category = extracted_data.get("category", "other")
    except:
        state["llm_result"] = "❌ Could not understand the expense. Please try again."
        return state

    if not amount:
        state["llm_result"] = "❌ Amount not found in your message."
        return state

    # 2️⃣ Save to MongoDB
    expense_data = {
        "amount": amount,
        "category": category,
        "date": datetime.utcnow()
    }

    collection.insert_one(expense_data)

    # 3️⃣ Generate Smart Financial Response
    advice_prompt = f"""
You are a personal finance assistant.

User spent ₹{amount} on {category}.

Respond in friendly tone.
Give:
- Short confirmation
- One smart saving tip (1 line)
Do not overexplain.
"""

    advice_response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=advice_prompt
    )

    state["llm_result"] = advice_response.text.strip()
    return state
