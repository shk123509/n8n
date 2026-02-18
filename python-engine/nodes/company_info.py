import os
import json
import requests
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")





def company_info_node(state: State) -> State:
    print("🏢 Company Info node running")

    query = state["query"]

    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state
    

    client = genai.Client(api_key=user_key)

    # --------------------------------------------------
    # 1️⃣ Extract company name using Gemini
    # --------------------------------------------------
    extract_prompt = f"""
Extract only the company name from the user query.
Return ONLY the company name.

User query:
{query}
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=extract_prompt
    )

    company_name = response.text.strip()
    print("🏷 Extracted Company:", company_name)

    if not company_name:
        state["llm_result"] = "❌ Company name not detected."
        return state

    # --------------------------------------------------
    # 2️⃣ RapidAPI SerpAPI Google Search
    # --------------------------------------------------
    url = "https://serpapi.com/search"

    params = {
        "engine": "google",
        "q": f"{company_name} company overview",
        "hl": "en",
        "gl": "us",
        "api_key": RAPID_API_KEY
    }

    try:
        search_response = requests.get(url, params=params)
        search_data = search_response.json()
    except Exception as e:
        print("Search error:", e)
        state["llm_result"] = "❌ Unable to fetch company data."
        return state

    # --------------------------------------------------
    # 3️⃣ Prepare raw search info
    # --------------------------------------------------
    raw_data = {
        "company": company_name,
        "knowledge_graph": search_data.get("knowledge_graph"),
        "organic_results": search_data.get("organic_results", [])[:3]
    }

    # --------------------------------------------------
    # 4️⃣ Gemini professional summary
    # --------------------------------------------------
    summary_prompt = f"""
You are a professional business intelligence assistant.

Generate a clean, structured company profile.

Format EXACTLY like this:

🏢 Company Overview
(2–3 lines)

📌 Key Details
• Industry:
• Founded:
• Headquarters:
• Website:

🌍 Business Insight
(1–2 line neutral insight)

Company Data:
{json.dumps(raw_data, indent=2)}
"""

    llm_response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=summary_prompt
    )

    state["llm_result"] = llm_response.text.strip()
    return state
