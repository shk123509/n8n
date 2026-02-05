import requests
import os
from dotenv import load_dotenv
from google import genai
from graph.state import State
from typing import TypedDict
from serpapi.google_search import GoogleSearch
from langgraph.graph import StateGraph



load_dotenv()

HASHNODE_API_URL = "https://gql.hashnode.com"



def wow_hashnode_publish_node(state: State) -> State:
    print("🚀 WOW Hashnode Publisher running")

    # 🔒 Safety check
    blog_md = state.get("blog_markdown")
    if not blog_md:
        state["llm_result"] = "❌ Blog not found. Please write a blog first."
        return state

    mutation = """
    mutation PublishPost(
      $publicationId: ObjectId!,
      $title: String!,
      $contentMarkdown: String!
    ) {
      publishPost(
        input: {
          publicationId: $publicationId,
          title: $title,
          contentMarkdown: $contentMarkdown
        }
      ) {
        post {
          url
        }
      }
    }
    """

    headers = {
        "Authorization": os.getenv("HASHNODE_API_TOKEN"),
        "Content-Type": "application/json"
    }

    payload = {
        "query": mutation,
        "variables": {
            "publicationId": os.getenv("HASHNODE_PUBLICATION_ID"),
            "title": state.get("blog_title", state["query"]),
            "contentMarkdown": blog_md
        }
    }

    res = requests.post(HASHNODE_API_URL, json=payload, headers=headers)
    res.raise_for_status()

    url = res.json()["data"]["publishPost"]["post"]["url"]

    # ✅ Save result cleanly
    state["llm_result"] = f"✅ Blog published successfully: {url}"
    state["published_url"] = url

    return state
