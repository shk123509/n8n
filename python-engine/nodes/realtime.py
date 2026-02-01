# flake8: noqa
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from typing import Annotated, Dict, List, Any, Optional
from langgraph.graph.message import add_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from google import genai
import os
from dotenv import load_dotenv
import requests
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode, tools_condition
from serpapi.google_search import GoogleSearch
import smtplib
from email.message import EmailMessage
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi
from twilio.rest import Client
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.runnables import RunnableConfig # <-- Very Important

load_dotenv()

# --- INITIALIZE CONSTANTS ---
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM")
RAPID_API_KEY = os.getenv("RAPID_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

twilio_client = Client(TWILIO_SID, TWILIO_TOKEN)

client = Client(
    os.getenv("TWILIO_ACCOUNT_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)