import os
import requests
import json
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

gemini_client = genai.Client(api_key=GEMINI_API_KEY)


def find_jobs_from_query_node(state: State) -> State:
    print("💼 Job Search node running")

    user_query = state["query"]

    # 1️⃣ CLEAN USER QUERY USING GEMINI (MOST IMPORTANT FIX)
    intent_prompt = f"""
Extract a clean job search query from the text below.

Rules:
- Remove greetings and filler words
- Keep only job role keywords
- Max 5 words
- Do NOT add explanation

User text:
{user_query}

Return ONLY the cleaned job query.
"""

    intent_response = gemini_client.models.generate_content(
        model="gemini-flash-latest",
        contents=intent_prompt
    )

    clean_query = intent_response.text.strip().lower()
    print("🔍 Cleaned job query:", clean_query)

    # 2️⃣ RAPIDAPI JSEARCH CALL (FIXED PARAMS)
    url = "https://jsearch.p.rapidapi.com/search"

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    params = {
        "query": clean_query,
        "page": 1,
        "num_pages": 1,
        "date_posted": "all",          # 🔥 FIX: week → all
        "country": "us",               # 🔥 FIX: required for results
        "employment_types": "FULLTIME,INTERN"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        state["llm_result"] = "❌ Unable to fetch job listings at the moment."
        return state

    jobs = response.json().get("data", [])[:5]

    if not jobs:
        state["llm_result"] = "❌ No jobs found. Try a different role or location."
        return state

    # 3️⃣ PREPARE RAW JOB DATA
    raw_jobs = []
    for job in jobs:
        raw_jobs.append({
            "job_title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": job.get("job_city") or job.get("job_country"),
            "employment_type": job.get("job_employment_type"),
            "apply_link": job.get("job_apply_link"),
            "source": job.get("job_publisher")
        })

    # 4️⃣ GEMINI FORMATTING
    prompt = f"""
You are a professional career assistant.

TASK:
- Present job results clearly
- Make it easy to scan
- Keep language simple
- Do NOT add fake details

Return output in this format ONLY:

Job Opportunities Summary:
(2–3 lines overview)

Available Roles:
1. Job Title – Company
   Location:
   Type:
   Apply Link:

2. Job Title – Company
   Location:
   Type:
   Apply Link:

Job Data:
{json.dumps(raw_jobs, indent=2)}
"""

    response = gemini_client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    state["llm_result"] = response.text.strip()
    return state
