import os
import json
from dotenv import load_dotenv
from google import genai
from graph.state import State

load_dotenv()



def insert_data_node(state: State) -> State:
    print("📥 insert node running")

    mongo_client = state.get("mongo_client")
    data = state.get("data_to_insert")
    query = state.get("query")

    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state
    

    client = genai.Client(api_key=user_key)

    if not mongo_client:
        state["llm_result"] = "❌ Mongo client not found. Connect DB first."
        return state

    # If data is missing, try to extract it using LLM
    if not data and query:
        print("🔍 Extracting data from query...")
        prompt = f"""
        Extract the data the user wants to insert into MongoDB as a valid JSON object.
        User Query: "{query}"
        
        Rules:
        - Return ONLY valid JSON.
        - Keys should be meaningful (e.g., task, title, name, etc.).
        - If no data to insert is found, return {{}}.
        """
        
        try:
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt
            )
            extracted_text = response.text.strip().replace("```json", "").replace("```", "")
            data = json.loads(extracted_text)
            
            if data:
                state["data_to_insert"] = data
                print(f"📦 Extracted Data: {data}")
            else:
                print("⚠️ No data found to insert.")

        except Exception as e:
            print(f"❌ Error extracting data: {e}")

    if not data:
        state["llm_result"] = "❌ No data provided to insert."
        return state

    db = mongo_client["my_database"]
    collection = db["my_collection"]

    result = collection.insert_one(data)

    state["llm_result"] = f"✅ Data inserted with id: {result.inserted_id}"
    return state
