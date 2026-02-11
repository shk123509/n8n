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


def crypto_stock_price_node(state: State) -> State:
    print("💰 Crypto / Stock Price node running")

    user_query = state["query"]

    # --------------------------------------------------
    # 1️⃣ Extract symbol using Gemini
    # --------------------------------------------------
    intent_prompt = f"""
Extract the financial ticker symbol from the text.

Rules:
- Stock examples: AAPL, TSLA, TCS
- Crypto examples: BTC-USD, ETH-USD
- Return ONLY the symbol
- Uppercase only
- No explanation

User text:
{user_query}
"""

    try:
        intent_response = gemini_client.models.generate_content(
            model="gemini-flash-latest",
            contents=intent_prompt
        )
        symbol = intent_response.text.strip().upper()
        print("📈 Extracted symbol:", symbol)

    except Exception as e:
        print("Symbol extraction error:", e)
        state["llm_result"] = "❌ Unable to detect stock or crypto symbol."
        return state

    if not symbol:
        state["llm_result"] = "❌ Unable to detect stock or crypto symbol."
        return state

    # --------------------------------------------------
    # 2️⃣ Call RapidAPI YH Finance (Live Price)
    # --------------------------------------------------
    url = "https://yh-finance.p.rapidapi.com/stock/v3/get-chart"

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "yh-finance.p.rapidapi.com"
    }

    params = {
        "symbol": symbol,
        "interval": "1d",
        "range": "1d",
        "region": "US"
    }

    try:
        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            print("API ERROR:", response.text)
            state["llm_result"] = "❌ Unable to fetch live market data."
            return state

        data = response.json()

        result = data["chart"]["result"][0]
        meta = result["meta"]

        price = meta.get("regularMarketPrice")
        previous_close = meta.get("previousClose")
        currency = meta.get("currency")

    except Exception as e:
        print("API Parsing error:", e)
        state["llm_result"] = "❌ Price data not available."
        return state

    if not price:
        state["llm_result"] = "❌ Live price not available."
        return state

    # --------------------------------------------------
    # 3️⃣ Calculate Change
    # --------------------------------------------------
    change = None
    change_percent = None

    if previous_close:
        change = round(price - previous_close, 2)
        change_percent = round((change / previous_close) * 100, 2)

    # --------------------------------------------------
    # 4️⃣ Send Data to Gemini for Professional Summary
    # --------------------------------------------------
    raw_data = {
        "symbol": symbol,
        "current_price": price,
        "previous_close": previous_close,
        "change": change,
        "change_percent": change_percent,
        "currency": currency
    }

    summary_prompt = f"""
You are a professional financial market assistant.

Generate a clean, structured market update.

Rules:
- Show gain or loss clearly
- Mention percentage movement
- No financial advice
- Keep response structured
- Professional tone

Format EXACTLY like this:

📊 Market Summary
(2–3 line overview)

📈 Price Details
• Asset:
• Current Price:
• Previous Close:
• Change:
• Change %:

📌 Market Insight
(1 short neutral observation)

Market Data:
{json.dumps(raw_data, indent=2)}
"""

    try:
        llm_response = gemini_client.models.generate_content(
            model="gemini-flash-latest",
            contents=summary_prompt
        )

        state["llm_result"] = llm_response.text.strip()

    except Exception as e:
        print("Gemini formatting error:", e)

        # Fallback manual response
        state["llm_result"] = f"""
📊 Market Update

Symbol: {symbol}
Current Price: {price} {currency}
Previous Close: {previous_close} {currency}
Change: {change}
Change %: {change_percent}%
"""

    return state
