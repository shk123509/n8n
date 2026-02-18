from google import genai
from graph.state import State



def classification_query(state: State) -> State:
    print("🧭 classifier node running")

    query = state["query"]

    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state
    

    client = genai.Client(api_key=user_key)

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
- course_finder_node
- is_general_question
- wow_serpapi_search_node
- bank_ifsc_micr_node
- courier_tracking_node
- live_train_status_node
- flight_status_node
- crypto_stock_price_node
- weather_node
- company_info_node
- find_jobs_from_query_node
- wow_gemini_blog_writer_node
- wow_hashnode_publish_node
- youtube_video_summary_node
- vehicle_info_node
- product_price_compare_node
- expense_tracker_node

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
BANK IFSC / MICR LOOKUP RULE (HIGH PRIORITY)
----------------------------------

Route the query to:
bank_ifsc_micr_node

WHEN TO USE:

Use this node if the user:
- Mentions IFSC code
- Mentions MICR code
- Asks bank branch details
- Asks bank details by city / address

Trigger Keywords:
ifsc, micr, bank branch, bank details,
neft, rtgs, imps, branch address

Examples:
- "IFSC SBIN0005943"
- "MICR code of SBI Andheri"
- "bank branches in mumbai"
- "find bank by IFSC"

Priority:
HIGH

Conflict Resolution:
If IFSC or MICR is present,
ALWAYS route to bank_ifsc_micr_node


----------------------------------
COURIER TRACKING RULE (HIGH PRIORITY)
----------------------------------

Route the query to:
courier_tracking_node

WHEN TO USE:

Use this node if the user:
- Wants to track a courier / parcel
- Mentions tracking number / AWB
- Asks delivery status
- Asks where the parcel is

Intent Focus:
Courier / parcel shipment tracking

Trigger Keywords:
track, tracking, courier, parcel, shipment, delivery status,
awb, consignment, where is my parcel, order tracking

Examples:
- "track my parcel"
- "DTDC tracking T01V4A0102004399"
- "where is my courier"
- "check shipment status"
- "awb number T01V4A0102004399 status"

DO NOT USE IF:
- User asks flight status
- User asks train status
- User asks product price
- User asks vehicle info

Priority:
HIGH

Conflict Resolution:
If tracking number is present,
ALWAYS route to courier_tracking_node


----------------------------------
COMPANY INFO RULE (HIGH PRIORITY)
----------------------------------

Route the query to:
company_info_node

IF the user:
- asks about a company
- wants company details, overview, or profile
- asks what a company does
- asks about founders, industry, business, or background
- mentions a company name without asking for jobs or stock price

Keywords:
company, organization, firm, startup, enterprise, business, profile, details, overview

Examples:
- "tell me about openai"
- "infosys company details"
- "what does microsoft do"
- "about tesla company"
- "google company overview"

→ company_info_node




----------------------------------
PRODUCT PRICE RULE (HIGH PRIORITY)
----------------------------------

Route the query to:
product_price_compare_node

WHEN TO USE:

Use this node if the user:
- Asks for product price
- Wants to compare prices across platforms
- Searches for best product under a budget
- Looks for cheapest / best deal
- Mentions a product name with price intent

Intent Focus:
E-commerce product pricing and comparison.

Trigger Keywords:
price, cost, rate, deal, offer, discount, cheapest, best price,
compare, under, below, budget, buy

Product Indicators:
mobile, phone, laptop, tv, headphone, earphones,
iphone, samsung, oneplus, macbook, dell, hp,
refrigerator, washing machine, shoes, smartwatch

Examples:
- "iphone 15 price"
- "best laptop under 50000"
- "samsung s23 cheapest price"
- "compare iphone 14 price amazon flipkart"
- "buy gaming laptop under 1 lakh"
- "best phone below 30000"

-> product_price_compare_node

DO NOT USE IF:
- User asks about company details → company_info_node
- User asks about stock/share price → crypto_stock_price_node
- User asks about jobs → job_search_node
- User asks about reviews only → wow_serpapi_search_node
- User asks about specs without buying intent → is_general_question

Priority:
HIGH

Conflict Resolution:
If BOTH price intent AND product name are present,
ALWAYS prefer product_price_compare_node
over wow_serpapi_search_node.

----------------------------------
EXPENSE TRACKER RULE (HIGH PRIORITY)
----------------------------------

Route the query to:
expense_tracker_node

🎯 PRIMARY PURPOSE

Use this node when the user intent is:

→ Personal spending mention
→ Expense logging
→ Money already spent
→ Daily / casual expense tracking

This node is strictly for:
Recording user expenses and categorizing them

🧠 INTENT SIGNALS (STRONG)
1️⃣ Expense Action Keywords

spent
kharch
kharcha
pay
paid
diye
lag gaye
bill aaya
expense
spent on
used money

Hindi + Hinglish allowed

2️⃣ Amount Indicators (ANY ONE REQUIRED)

Numbers: 100, 450, 1200

Currency symbols: ₹, Rs, INR

Casual formats:

500 ka

300 rupaye

1k

2 hazar

3️⃣ Expense Category Indicators (OPTIONAL but STRONG)

food
swiggy
zomato
petrol
diesel
fuel
shopping
amazon
flipkart
recharge
mobile bill
electricity
rent
travel
bus
train
cab
ola
uber

🚨 STRICT MATCH CONDITION

If:

(Amount Present)
AND
(Expense verb OR category)

→ ALWAYS route to:
expense_tracker_node

🧩 FORCE ROUTING EXAMPLES

"Maine Swiggy pe 450 kharch kiye"

"Petrol me 1200 lag gaye"

"Recharge 299 ka"

"Aaj shopping me 3k uda diye"

"Electricity bill 1800 aaya"

"Cab ke 350 diye"

"Lunch 200 ka"

→ expense_tracker_node

🔥 CONFLICT RESOLUTION (IMPORTANT)
CASE 1:

If query contains:

Amount

AND food / shopping / travel word

Even if advice tone ho:

"Aaj khana mehnga pad gaya 500 ka"

→ expense_tracker_node

CASE 2:

If user says:

"Maine aaj 1000 kharch kiye"

Category missing
BUT amount present

→ expense_tracker_node
(Category = "other")

CASE 3:

If BOTH present:

Expense mention

Budget / future planning

Example:

"Kal 2000 kharch karna padega"

→ ❌ NOT expense tracker
→ use budget_planner_node (future intent)

❌ DO NOT ROUTE IF

User asks how much should I spend → budget_planner_node

User asks price of product → product_price_compare_node

User asks monthly summary → expense_summary_node

User asks saving tips only → general_finance_node

User asks loan / EMI → emi_calculator_node

🧠 PRIORITY LEVEL

PRIORITY: HIGH

If BOTH:

Expense logging intent

AND general finance advice

→ ALWAYS prefer:
expense_tracker_node

----------------------------------
VEHICLE INFO RULE (HIGH PRIORITY)
----------------------------------

Route the query to:
vehicle_info_node

WHEN TO USE:

Use this node if the user:
- Asks for vehicle details
- Wants RTO / registration information
- Enters a vehicle number directly
- Asks owner, model, fuel type, registration details

Intent Focus:
Indian vehicle / RTO lookup.

Trigger Keywords:
vehicle, car, bike, scooty, registration, rc,
rto, owner, model, fuel, engine, chassis,
vehicle details, car details, bike details

Vehicle Number Pattern (IMPORTANT):
- Indian registration formats like:
  DL01AB1234
  MH12DE1433
  UP16BQ9999
  KA03MN4567

Examples:
- "DL01AB1234 vehicle details"
- "check car number mh12de1433"
- "bike registration details ka03mn4567"
- "rto details for up16bq9999"
- "owner details of dl8caf5030"

-> vehicle_info_node

DO NOT USE IF:
- User asks about vehicle price → product_price_compare_node
- User asks about stock/company → company_info_node
- User asks about traffic rules → is_general_question
- User asks about resale value → wow_serpapi_search_node

Priority:
HIGH

Conflict Resolution:
If a valid Indian vehicle number pattern is detected,
ALWAYS route to vehicle_info_node
even if words like "today" or "details" are present.



----------------------------------
COURSE FINDER RULE
----------------------------------

Route the query to:
course_finder_node

IF user:
- asks for courses
- mentions learning
- wants certification
- uses words like:
  course, courses, online course, certification,
  learn, training, tutorial

Examples:
- "best python course"
- "free ai courses"
- "machine learning certification"
- "data science training online"

→ course_finder_node


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





