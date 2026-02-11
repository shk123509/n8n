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
You are a strict query classification AI.

Your task:
You MUST classify the user query into EXACTLY ONE category from the list below.

----------------------------------
AVAILABLE CATEGORIES
----------------------------------

- is_coding_question
- is_doctor_question
- is_farmer_question
- is_advice_question
- is_general_question
- wow_serpapi_search_node
- live_train_status_node
- flight_status_node
- crypto_stock_price_node
- weather_node
- job_search_node
- wow_gemini_blog_writer_node
- wow_hashnode_publish_node
- youtube_video_summary_node

----------------------------------
STRICT RESPONSE RULES
----------------------------------

- Respond with ONLY ONE category name
- No explanation
- No extra text
- No punctuation
- Lowercase only
- Never return multiple categories

----------------------------------
WEATHER RULE
----------------------------------

Route the query to:
weather_node

IF the user:
- asks about weather
- asks temperature
- asks climate
- asks rain forecast
- mentions city + weather
- uses words like:
  weather, temperature, forecast, climate, rain, humidity, wind

Examples:
- "weather in delhi"
- "today temperature in mumbai"
- "is it raining in london?"
- "current weather in dubai"

→ weather_node

----------------------------------
CRYPTO / STOCK PRICE RULE (HIGH PRIORITY)
----------------------------------

This rule has HIGHER priority than REAL-TIME / SEARCH rule.

Route the query to:
crypto_stock_price_node

IF the user:
- asks for crypto or stock price
- mentions bitcoin, ethereum, shares, stock
- asks market value
- even if words like "today" or "now" are present

Examples:
- "bitcoin price now"
- "eth price today"
- "tcs share price"
- "apple stock price today"

→ crypto_stock_price_node

----------------------------------
JOB / INTERNSHIP SEARCH RULE (HIGH PRIORITY)
----------------------------------

Route the query to:
job_search_node

IF the user:
- asks for jobs or internships
- wants fresh hiring information
- wants jobs by skill, role, company, or location
- mentions words like:
  job, jobs, hiring, internship, intern, vacancy, openings, career, fresher jobs

Examples:
- "find python developer jobs"
- "internship for data science students"
- "latest jobs for freshers"
- "nodejs developer hiring in india"
- "remote internships for students"

→ job_search_node

----------------------------------
FLIGHT STATUS RULE (HIGH PRIORITY)
----------------------------------

Route the query to:
flight_status_node

IF the query:
- asks for flight status
- mentions flight delay, arrival, departure
- includes airline + flight number

Keywords:
flight, airline, delayed, arrived, departed, boarding, gate, terminal, status

Flight number pattern examples:
- AI302
- AS2223
- 6E213
- EK202

Examples:
- "check flight ai302 status"
- "flight as2223 arrived or not"
- "indigo 6e213 live status"
- "emirates ek202 delay"

→ flight_status_node

----------------------------------
REAL-TIME / SEARCH RULE
----------------------------------

Route the query to:
wow_serpapi_search_node

IF the query requires ANY of the following:
- latest / recent / today / now
- current prices, rankings, results
- live data or real-time facts
- news or updates (2024 / 2025)
- comparisons of current tools or services
- websites, links, blogs, tutorials
- explicit Google or search intent

Examples:
- "today gold price in india"
- "latest ai news"
- "react vs vue which is better in 2025"
- "best hosting for nodejs"

→ wow_serpapi_search_node

----------------------------------
GENERAL KNOWLEDGE RULE
----------------------------------

If the question can be answered using general knowledge
AND does NOT require real-time data:

Examples:
- "who is elon musk"
- "what is rest api"

→ is_general_question

----------------------------------
VIDEO SUMMARY RULE (NEW)
----------------------------------

Route the query to:
summarize_videos_node

IF the query:
- asks to summarize a video
- asks for notes from a video
- asks for key points / takeaways from a video
- includes a YouTube link
- includes words like:
  video, youtube, summarize video, video summary, explain this video

Examples:
- "summarize this youtube video https://youtube.com/..."
- "give notes from this video"
- "explain this youtube video"
- "key takeaways from this video link"

→ summarize_videos_node

----------------------------------
BLOG WRITING RULE
----------------------------------

If the user asks to:
- write a blog
- generate an article
- long-form content (AI, LangGraph, Tech, etc.)

→ wow_gemini_blog_writer_node

----------------------------------
BLOG PUBLISHING RULE
----------------------------------

If the user asks to:
- publish
- post
- upload a blog to Hashnode

→ wow_hashnode_publish_node

----------------------------------
DATABASE RULES (CRITICAL – HIGHEST PRIORITY)
----------------------------------

1️⃣ connect_mongo_db  
If the query:
- contains a MongoDB URL (mongodb:// or mongodb+srv://)
- OR asks to connect a database

→ ALWAYS select: connect_mongo_db

2️⃣ insert_data_node  
Use ONLY if:
- DB connection is already established
- User explicitly wants to insert/save/add data

3️⃣ read_data_node  
Use ONLY if:
- DB connection is already established
- User explicitly wants to read/fetch/list data

----------------------------------
TRAIN LIVE STATUS RULE (SPECIAL)
----------------------------------

Route to:
live_train_status_node

ONLY IF ALL conditions match:
- Query mentions train-related keywords:
  train, status, running, live
- AND contains a 4–5 digit number (train number)

Examples:
- "find train status 12303"
- "train 12951 live running status"
- "12322 kaha pahunchi?"

→ live_train_status_node

----------------------------------
DEFAULT FALLBACK RULE
----------------------------------

If none of the above rules apply:
→ is_general_question



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





