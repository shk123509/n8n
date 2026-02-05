from pymongo import MongoClient
from graph.state import State


def connect_mongo_db(state: State) -> State:
    print("🗄️ mongo connect node running")

    mongo_url = state.get("mongo_url")
    if not mongo_url:
        state["llm_result"] = "❌ Mongo URL missing"
        return state

    client = MongoClient(mongo_url)
    client.admin.command("ping")

    state["mongo_client"] = client   # 🔥 MUST
    state["llm_result"] = "✅ Mongo connected"

    return state
