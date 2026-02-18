import os
import json
import requests
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")





def course_finder_node(state: State) -> State:
    print("🎓 Course Finder Node Running")

    query = state["query"]


    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state
    

    client = genai.Client(api_key=user_key)

    

    url = "https://udemy-free-courses.p.rapidapi.com/courses/"

    headers = {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": "udemy-free-courses.p.rapidapi.com"
    }

    params = {
        "pagination": "1"
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            state["llm_result"] = "❌ API error while fetching courses."
            return state

        data = response.json()

    except Exception as e:
        print("API Error:", e)
        state["llm_result"] = "❌ Unable to fetch courses."
        return state

    courses = data.get("courses", [])

    if not courses:
        state["llm_result"] = "❌ No free courses found."
        return state

    # 🔎 Filter by user query
    filtered_courses = [
        c for c in courses 
        if query.lower() in c.get("title", "").lower()
    ]

    if not filtered_courses:
        filtered_courses = courses[:5]
    else:
        filtered_courses = filtered_courses[:5]

    simplified = []

    for c in filtered_courses:
        simplified.append({
            "title": c.get("title"),
            "level": c.get("instructional_level_simple"),
            "rating": c.get("rating"),
            "students": c.get("num_subscribers"),
            "duration": c.get("content_info_short"),
            "url": c.get("url")
        })

    # 🧠 Gemini Formatting (No hallucination allowed)

    prompt = f"""
Use ONLY the data below.
Do NOT create fake courses.
Do NOT modify URLs.

Format:

🎓 Top Free Udemy Courses

For each:
• Title
• Level
• Duration
• Rating
• Students
• Link

Data:
{json.dumps(simplified, indent=2)}
"""

    llm_response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    state["llm_result"] = llm_response.text.strip()

    return state
