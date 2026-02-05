from graph.state import State


def insert_data_node(state: State) -> State:
    print("📥 insert node running")

    client = state.get("mongo_client")
    data = state.get("data_to_insert")

    if not client:
        state["llm_result"] = "❌ Mongo client not found. Connect DB first."
        return state

    if not data:
        state["llm_result"] = "❌ No data provided to insert."
        return state

    db = client["my_database"]
    collection = db["my_collection"]

    result = collection.insert_one(data)

    state["llm_result"] = f"✅ Data inserted with id: {result.inserted_id}"
    return state
