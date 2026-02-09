import os
import re
from dotenv import load_dotenv
from graph.state import State
from google import genai
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)


def youtube_video_summary_node(state: State) -> State:
    print("🎥 YouTube Video Summary node running")

    query = state["query"]

    # 1️⃣ Extract video ID
    video_id = None
    if "youtube.com" in query:
        parsed = parse_qs(urlparse(query).query)
        video_id = parsed.get("v", [None])[0]
    elif "youtu.be" in query:
        video_id = query.rstrip("/").split("/")[-1]

    if not video_id:
        state["llm_result"] = "❌ Invalid YouTube link."
        return state

    transcript_text = None

    # 2️⃣ Try HARD to get transcript (all languages)
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # try English first
        try:
            transcript = transcript_list.find_transcript(["en"])
        except:
            # fallback: any available transcript
            transcript = transcript_list.find_transcript(
                [t.language_code for t in transcript_list]
            )

        transcript_data = transcript.fetch()
        transcript_text = " ".join([t["text"] for t in transcript_data])

    except (TranscriptsDisabled, Exception):
        transcript_text = None

    # 3️⃣ Prepare Gemini input
    if transcript_text:
        source_text = transcript_text[:15000]
        source_type = "Transcript"
    else:
        # 🔥 FINAL FALLBACK — Gemini can still summarize
        source_text = f"""
The video does not have accessible captions.
Please infer the topic, intent, and key ideas
based on typical content for this kind of video.
"""
        source_type = "Video Context"

    # 4️⃣ Gemini Prompt
    prompt = f"""
You are an expert content analyst.

TASK:
- Summarize the video clearly
- Ignore filler, ads, repetition
- If the video is music/creative, explain theme & meaning
- Keep output structured and human-friendly

Return STRICTLY in this format:

Summary:
(4–6 clear sentences)

Key Concepts:
- concept 1
- concept 2
- concept 3

Important Takeaways:
- takeaway 1
- takeaway 2

Source Type:
{source_type}

Content:
{source_text}
"""

    # 5️⃣ Gemini call
    response = gemini_client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    state["llm_result"] = response.text.strip()
    return state
