import re
from pymongo import MongoClient
from graph.state import State


def connect_mongo_db(state: State) -> State:
    print("🗄️ mongo connect node running")

    mongo_url = state.get("mongo_url")

    # Try to extract from query if missing
    if not mongo_url:
        query = state.get("query", "")
        # Regex to find mongodb:// or mongodb+srv:// url
        match = re.search(r"mongodb(?:\+srv)?://[^\s]+", query)
        if match:
            mongo_url = match.group(0)
            state["mongo_url"] = mongo_url
            print(f"🔗 Extracted Mongo URL: {mongo_url}")

    if not mongo_url:
        state["llm_result"] = "❌ Mongo URL missing. Please provide a valid MongoDB URL."
        return state

    client = MongoClient(mongo_url)
    client.admin.command("ping")

    state["mongo_client"] = client   # 🔥 MUST
    state["llm_result"] = "✅ Mongo connected"

    return state
