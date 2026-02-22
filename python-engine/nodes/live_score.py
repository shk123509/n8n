import os
import requests
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

RAPID_API_KEY = os.getenv("RAPID_API_KEY")


def cricket_live_score_node(state: State) -> State:
    print("🏏 Cricket Live Score Node Running")

    user_query = state.get("query", "")
    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "❌ Gemini API Key missing."
        return state

    if not RAPID_API_KEY:
        state["llm_result"] = "❌ RapidAPI key missing in .env"
        return state

    client = genai.Client(api_key=user_key)

    # 🔹 1️⃣ Extract team short names safely
    try:
        extract_prompt = f"""
Extract two cricket team short names only (like IND, AUS, ENG).
Return strictly in format:
TEAM1, TEAM2

User Text:
{user_query}
"""

        extract_response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=extract_prompt
        )

        teams_text = extract_response.text.strip().upper()

        if "," not in teams_text:
            state["llm_result"] = "❌ Could not detect two teams."
            return state

        team1, team2 = [t.strip() for t in teams_text.split(",")]

    except Exception as e:
        state["llm_result"] = f"❌ Team extraction failed: {str(e)}"
        return state

    print("🏏 Teams:", team1, "vs", team2)

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
    }

    # 🔹 2️⃣ Search function (LIVE + RECENT reuse)
    def search_matches(endpoint):
        try:
            response = requests.get(
                f"https://cricbuzz-cricket.p.rapidapi.com{endpoint}",
                headers=headers,
                timeout=10
            )

            if response.status_code != 200:
                print("API Error:", response.status_code, response.text)
                return None

            data = response.json()

            for type_match in data.get("typeMatches", []):
                for series in type_match.get("seriesMatches", []):
                    wrapper = series.get("seriesAdWrapper")
                    if not wrapper:
                        continue

                    for match in wrapper.get("matches", []):
                        info = match.get("matchInfo", {})

                        short1 = info.get("team1", {}).get("teamSName", "").upper()
                        short2 = info.get("team2", {}).get("teamSName", "").upper()

                        if (
                            (team1 == short1 and team2 == short2)
                            or
                            (team2 == short1 and team1 == short2)
                        ):
                            return match

            return None

        except requests.exceptions.Timeout:
            print("API Timeout")
            return None
        except Exception as e:
            print("Search Error:", str(e))
            return None

    # 🔹 3️⃣ LIVE first
    match_found = search_matches("/matches/v1/live")
    source = "LIVE"

    # 🔹 4️⃣ RECENT fallback
    if not match_found:
        match_found = search_matches("/matches/v1/recent")
        source = "RECENT"

    if not match_found:
        state["llm_result"] = "❌ No live or recent match found."
        return state

    # 🔹 5️⃣ Score extraction (multi-innings safe)
    info = match_found.get("matchInfo", {})
    score = match_found.get("matchScore", {})

    def format_innings(team_score):
        if not team_score:
            return "Yet to bat"

        output = []
        for key in team_score:
            innings = team_score.get(key, {})
            runs = innings.get("runs", 0)
            wickets = innings.get("wickets", 0)
            overs = innings.get("overs")

            if overs:
                output.append(f"{runs}/{wickets} ({overs} ov)")
            else:
                output.append(f"{runs}/{wickets}")

        return " & ".join(output)

    team1_name = info.get("team1", {}).get("teamName", "Team 1")
    team2_name = info.get("team2", {}).get("teamName", "Team 2")

    team1_score = format_innings(score.get("team1Score"))
    team2_score = format_innings(score.get("team2Score"))

    status = info.get("status", "Status unavailable")

    # 🔹 6️⃣ Final formatted output (no second Gemini call)
    result_text = f"""
🏏 {team1_name} vs {team2_name}

{team1_name}: {team1_score}
{team2_name}: {team2_score}

📢 Status: {status}
📂 Source: {source}
""".strip()

    state["llm_result"] = result_text
    return state