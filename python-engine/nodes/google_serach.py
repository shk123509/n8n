import os
from dotenv import load_dotenv
from google import genai
from graph.state import State
from typing import TypedDict
from serpapi.google_search import GoogleSearch
from langgraph.graph import StateGraph



load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")


def wow_serpapi_search_node(state: State) -> State:
    print("🌍 WOW SerpAPI Google Search running")

    params = {
        "engine": "google",
        "q": state["query"],
        "hl": "en",
        "gl": "in",
        "api_key": SERPAPI_KEY
    }

    search = GoogleSearch(params)
    data = search.get_dict()

    results = []

    for item in data.get("organic_results", [])[:5]:
        results.append(
            f"🔹 {item.get('title')}\n"
            f"{item.get('snippet')}\n"
            f"{item.get('link')}"
        )

    state["llm_result"] = "\n\n".join(results) if results else "No results found."
    return state

