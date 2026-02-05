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


wow_gemini_blog_writer_node=> When user say that write a blog and read a blog dynamic topics link ai,langgrap etc....
You can selected this wow_gemini_blog_writer_node ok Than when user asy published you can selected wow_hashnode_publish_node this ok etc..
- If the user asks to:
  • write a blog
  • create an article
  • generate a blog post
  • read and write about dynamic topics (AI, LangGraph, RAG, LLMs, etc.)
  → Select: wow_gemini_blog_writer_node

  - If the user asks to:
  • publish the blog
  • post the article
  • upload blog to Hashnode
  • make it live
  → Select: wow_hashnode_publish_node

1. connect_mongo_db   →  user ask connect you can selected this nodes connect_mongo_db not other nodes ok examples (connect, insert, db, connect, etc...) you can selected ok  ok use  when user wants to connect to database or mentions database, MongoDB, DB, URL you can pick this nodes connect_mongo_db
2. insinsert_data_nodeert_data  → use when user wants to save, add, insert, store, create a task or data pick insert_data_node
3. read_data_node    → use when user wants to read, fetch, show, get, list data from database pick read_data_node
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
