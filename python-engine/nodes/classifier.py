import os
from dotenv import load_dotenv
from google import genai
from graph.state import State

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def classification_query(state: State) -> State:
    print("🧭 classifier node running")

    query = state["query"]

    SYSTEM_PROMPT = """
You are a query classification AI.

Your task:
Classify the user query into EXACTLY ONE of the following categories:

- is_coding_question
- is_doctor_question
- is_farmer_question
- is_advice_question
- is_general_question
- wow_serpapi_search_node => 1) Real-time Google search
2) Or can be answered from general knowledge

If the query requires:
- latest information
- current news
- live data
- real-time facts
- current prices, results, rankings
- today / now / recent / latest / 2024 / 2025
- websites, links, blogs, tutorials
- comparisons of current tools or services

Then route the query to:
wow_serpapi_search_node

User: "today gold price in india"
→ wow_serpapi_search_node

User: "latest ai news"
→ wow_serpapi_search_node

User: "react vs vue which is better in 2025"
→ wow_serpapi_search_node

User: "who is elon musk"
→ LLM (no search)

User: "what is REST API"
→ LLM (no search)

User: "google search best hosting for nodejs"
→ wow_serpapi_search_node



Rules:
- Respond with ONLY ONE category name
- No explanations
- No extra text
- No punctuation
- Lowercase only



- If the user asks to:
  • write a blog or article (topics: AI, LangGraph, etc.)
  → Select: wow_gemini_blog_writer_node

- If the user asks to:
  • publish/post the blog to Hashnode
  → Select: wow_hashnode_publish_node

🔴 CRITICAL DATABASE RULES (Read Carefully):

1. connect_mongo_db
   → PRIORITY: If the query contains a MongoDB URL (starts with "mongodb://" or "mongodb+srv://") OR asks to "connect", YOU MUST SELECT THIS NODE.
   → Examples: "connect to db", "mongodb+srv://user:pass@...", "use this url to connect"
   → Even if the query ALSO mentions "insert", "read", "task", or "gen ai", you MUST start with specific connection.

2. insert_data_node
   → Use ONLY when satisfying these conditions:
     a) Connection is ALREADY established (no URL provided in this query).
     b) User explicitly wants to save/insert/add data.

3. read_data_node
   → Use ONLY when satisfying these conditions:
     a) Connection is ALREADY established (no URL provided in this query).
     b) User explicitly wants to read/fetch/list data.
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=[
            {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
            {"role": "user", "parts": [{"text": query}]},
        ],
    )

    route = response.text.strip()

    print("➡️ classified as:", route)

    state["route"] = route
    return state


def route(state: State) -> str:
    return state["route"]
