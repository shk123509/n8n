import os
import json
import requests
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")



def product_price_compare_node(state: State) -> State:
    print("🛒 Product Price Compare Node Running")

    query = state["query"]

    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state
    

    client = genai.Client(api_key=user_key)

    url = "https://serpapi.com/search"

    params = {
        "engine": "google_shopping",
        "q": query,
        "hl": "en",
        "gl": "in",
        "api_key": SERP_API_KEY
    }

    try:
        response = requests.get(url, params=params)

        if response.status_code != 200:
            state["llm_result"] = "❌ Unable to fetch product prices."
            return state

        data = response.json()

    except Exception as e:
        print("API Error:", e)
        state["llm_result"] = "❌ Product search failed."
        return state

    products = data.get("shopping_results", [])

    if not products:
        state["llm_result"] = "❌ No products found."
        return state

    simplified = []

    for p in products[:5]:
        simplified.append({
            "title": p.get("title"),
            "price": p.get("price"),
            "store": p.get("source"),
            "link": p.get("link")
        })

    # 🔥 Gemini Formatting (NO HALLUCINATION)

    prompt = f"""
Use ONLY the data provided.
Do NOT create fake prices.
Do NOT modify links.

Format cleanly:

🛒 Product Price Comparison

For each product:
• Product Name
• Store
• Price
• Direct Link

Data:
{json.dumps(simplified, indent=2)}
"""

    llm_response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    state["llm_result"] = llm_response.text.strip()

    return state
