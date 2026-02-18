import os
from google import genai
from graph.state import State

def is_general_question(state: State) -> State:
    print("🧩 general node running")

    query = state["query"]
    
    # 🔑 USER KI KEY NIKALO
    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state

    # 🚀 CLIENT KO USER KI KEY SE INIT KARO
    # Note: Kuch systems mein 'http_options' dena padta hai version fix karne ke liye
    client = genai.Client(api_key=user_key)

    SYSTEM_PROMPT = """
    You are a General Query Resolver AI Agent. Provide clear, direct, and complete answers.
    Avoid unnecessary explanations or opinions. No emojis.
    """

    try:
        # 🔥 FIX: Model name ko aise likho
        response = client.models.generate_content(
            model="gemini-flash-latest", 
            contents=[
                {"role": "user", "parts": [{"text": f"System Instruction: {SYSTEM_PROMPT}"}]},
                {"role": "user", "parts": [{"text": query}]},
            ],
        )

        state["llm_result"] = response.text.strip()
    
    except Exception as e:
        print(f"❌ Gemini Error: {str(e)}")
        # 🔥 Agar 404 fir bhi aaye, toh 'gemini-1.5-flash' ki jagah 'gemini-2.0-flash-exp' try karna
        state["llm_result"] = f"LLM Error: {str(e)}"
        
    return state