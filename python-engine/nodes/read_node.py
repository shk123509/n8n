from graph.state import State


def read_data_node(state: State) -> State:
    print("📤 read node running")

    client = state.get("mongo_client")

    if not client:
        state["llm_result"] = "❌ Mongo client not found. Connect DB first."
        return state

    db = client["my_database"]
    collection = db["my_collection"]

    documents = list(collection.find({}, {"_id": 0}))

    state["read_result"] = documents
    state["llm_result"] = f"✅ Data read successfully:\n{documents}"

    return state
