from google import genai
from graph.state import State



def wow_gemini_blog_writer_node(state: State) -> State:
    print("✍️ WOW Gemini Blog Writer running")

    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "Error: API Key missing in Python Engine."
        return state
    

    client = genai.Client(api_key=user_key)

    prompt = f"""
You are a professional technical blogger.

Write a high-quality technical blog on the topic below.

Topic: {state["query"]}

Rules:
- Clear introduction with problem statement
- Well-structured sections with headings
- Explain concepts in simple Hinglish
- Add code examples where relevant
- Practical, real-world explanations
- End with final thoughts

Output in Markdown format.

Examples :
LangGraph: LLM Workflows ko “Proper Engineering” banane ka tareeka

Aaj kal sab LLM apps bana rahe hain — chatbots, agents, AI tools.
Par jaise-jaise app thodi complex hoti hai, ek problem aati hai:

“Prompt → Response” se aage kya?”

Yahin par LangGraph ka entry hota hai.

Problem kya thi?

Normal LLM apps usually aise hote hain:

Ek prompt

Ek response

Thoda sa if-else logic

Bas.

Par real apps mein:

Multiple steps hote hain

Decisions lene padte hain

Tools call hote hain

Kabhi loop chahiye

Kabhi memory

Kabhi error recovery

Aur sab kuch ek hi file mein spaghetti ban jata hai 😵‍💫

LangGraph kya hai?

LangGraph ek framework hai jo LLM workflows ko graph ki tarah design karta hai.

Simple words mein:

App ko nodes mein tod do

Nodes ke beech edges (flow) define karo

State maintain hoti hai

Decisions clean ho jate hain

Socho LangGraph = LLM apps ke liye “state machine + flow chart”

Graph ka matlab yahan kya hai?

Graph mein:

Node = ek kaam (LLM call, tool, logic)

Edge = next step

Conditional edge = decision based routing

Example socho:

User query aayi

Decide karo: search chahiye ya direct answer

Agar search → tool call

Nahi → direct LLM

Final answer

Ye sab LangGraph mein naturally fit hota hai.

LangChain vs LangGraph

Short aur honest comparison 👇

LangChain

Linear pipelines ke liye best

Prompt → Tool → Output

Simple use-cases

LangGraph

Complex flows

Conditional routing

Loops

Stateful agents

Multi-step reasoning

👉 LangChain = road
👉 LangGraph = Google Maps (with rerouting)

LangGraph kyun use karein?
1. Clean Architecture

Logic idhar-udhar nahi hota
Har step clearly defined hota hai

2. Stateful AI

Conversation, memory, intermediate data — sab state mein

3. Conditional Routing

Model khud decide kar sakta hai:

Kis node pe jana hai

Kis tool ko call karna hai

4. Agent-like Behavior

Real agents bante hain, sirf chatbots nahi

Real-World Use Cases

LangGraph perfect hai jab:

AI Agent bana rahe ho

Tool-based reasoning chahiye

n8n / workflow-type AI engine

Customer support bot with decisions

Multi-step data analysis

Retry & fallback logic

Basically:

“AI ko thoda dimag dena ho”

Mental Model (yaad rakhne ke liye)

Socho aise:

LangGraph = Flowchart

LLM = Employee

Tools = Helpers

State = Notebook

Employee kaam karta hai, notebook mein likhta hai, flowchart decide karta hai next step.

Kab LangGraph use na karein?

Honesty time 👇
LangGraph avoid karo agar:

Sirf simple chatbot banana hai

One-shot Q&A hai

No branching logic

Wahan LangChain ya plain API enough hai.

Final Thoughts

LangGraph ek “engineering mindset” laata hai LLM apps mein.

Agar tum:

Serious AI products bana rahe ho

Agents, workflows, decision systems chahiye

Production-ready architecture chahiye

👉 LangGraph seekhna worth it hai.

Examples :
Web Development: Internet ka Backbone kaise banta hai?

Jab tum Google open karte ho, Instagram scroll karte ho, ya Amazon se order karte ho —
yeh sab Web Development ki wajah se possible hota hai.

Simple bolun to:

Web Development = Websites aur Web Apps banana + chalana

Web Development hota kya hai?

Web Development ka matlab sirf “website design” nahi hai.
Isme teen major parts hote hain:

Frontend

Backend

Database

Ye teen milkar ek complete web app banate hain.

1. Frontend (User jo dekhta hai)

Frontend wo hota hai jo user screen par dekhta aur use karta hai.

Frontend mein kya hota hai?

Buttons

Forms

Layout

Colors

Animations

Common Frontend Tech

HTML → structure

CSS → styling

JavaScript → logic

Frameworks: React, Vue, Angular

👉 Frontend = Shop ka showroom

2. Backend (Dimag jo kaam karta hai)

Backend wo hota hai jo background mein kaam karta hai.

Example:

Login ka logic

Data save karna

Server par request handle karna

Security

Common Backend Tech

Node.js

Python (Django, FastAPI)

Java (Spring)

PHP (Laravel)

👉 Backend = Shop ka staff + manager

3. Database (Yaad rakhne wali jagah)

Database data store karta hai.

Examples:

User info

Orders

Messages

Products

Popular Databases

MongoDB

MySQL

PostgreSQL

Firebase

👉 Database = Godown / Store Room

Web Developer kya karta hai?

Ek Web Developer:

UI banata hai

APIs likhta hai

Database connect karta hai

Bugs fix karta hai

Website deploy karta hai

Types of Web Developers
1. Frontend Developer

UI/UX focus

React, CSS mastery

2. Backend Developer

Logic + security

APIs & databases

3. Full Stack Developer

Frontend + Backend dono

Startup favorite 😄

Web Development kyun seekhein?

🌍 High demand skill

💰 Freelancing & jobs

🚀 Apna product bana sakte ho

🧠 Logical thinking strong hoti hai

Beginner Roadmap (Simple)

HTML + CSS

JavaScript basics

Git & GitHub

One frontend framework

Basic backend

Database

Deployment

Ek saath sab mat padho — step by step.
User (Browser)
      |
      |  HTTP Request
      v
Frontend (HTML, CSS, JS)
      |
      |  API Call
      v
Backend (Node / Python)
      |
      |  Query
      v
Database (MongoDB / SQL)
      |
      |  Response
      v
Backend → Frontend → User

<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Hello Web Development</h1>
  <button>Click Me</button>
</body>
</html>

Backend
   |
   |  Save / Fetch
   v
Database

[ User ]
   |
   v
[ Frontend ]
   |
   v
[ Backend API ]
   |
   v
[ Database ]
   |
   v
Response back to User

User enters email/password
        ↓
Frontend sends API request
        ↓
Backend checks database
        ↓
If valid → Login success
Else → Error
Frontend vs Backend (Quick Table)
Frontend	Backend
UI	Logic
Browser	Server
React	Node
Visible	Hidden

Beginner Project Example
Project: Contact Form

Frontend

Form

Input fields

Submit button

Backend

API to receive data

Database

Store messages

Examples :

1️⃣ RAG ka Basic Idea (High-Level)
User Question
     |
     v
   LLM
     |
     v
Answer (❌ hallucination risk)


⬆️ Problem: LLM ke paas fresh / private data nahi hota

2️⃣ RAG ka Core Concept
User Question
     |
     v
Retrieve Relevant Data
     |
     v
LLM + Context
     |
     v
Accurate Answer

3️⃣ RAG Complete Architecture
                ┌──────────────┐
                │  Documents   │
                │ (PDF, Web,   │
                │  Notes, DB)  │
                └──────┬───────┘
                       |
                       v
                ┌──────────────┐
                │  Embeddings  │
                └──────┬───────┘
                       |
                       v
                ┌──────────────┐
                │ Vector Store │
                │ (FAISS etc.) │
                └──────┬───────┘
                       |
User Question ──────────┘
       |
       v
Similarity Search
       |
       v
Relevant Context
       |
       v
      LLM
       |
       v
   Final Answer

4️⃣ RAG Query-Time Flow (Most Important)
[ User Query ]
       |
       v
[ Convert to Vector ]
       |
       v
[ Search Similar Docs ]
       |
       v
[ Top-K Chunks ]
       |
       v
[ LLM + Context ]
       |
       v
[ Final Response ]

5️⃣ Traditional LLM vs RAG (Visual Difference)
❌ Without RAG
Question → LLM → Guess-Based Answer

✅ With RAG
Question → Search → Evidence → LLM → Grounded Answer

6️⃣ RAG Data Ingestion Pipeline
Raw Data
   |
   v
Chunking
   |
   v
Embedding
   |
   v
Vector Database

7️⃣ Chunking Concept (Visual)
Big Document
────────────────────────────
| Chunk 1 | Chunk 2 | Chunk 3 |
────────────────────────────

8️⃣ Vector Search Visualization
Query Vector ●
             \
              ●  Doc A
             /
            ●   Doc B   ← most similar

9️⃣ RAG + Tools (Advanced)
User Query
     |
     v
Retriever
     |
     v
External Tools / Docs
     |
     v
LLM
     |
     v
Answer

🔟 RAG vs Fine-Tuning (Diagram)
Fine-Tuning
Data → Model Training → Fixed Knowledge

RAG
Data → Vector DB → Dynamic Retrieval → LLM

1️⃣1️⃣ RAG in Real App (End-to-End)
Frontend
   |
   v
Backend API
   |
   v
Retriever
   |
   v
Vector DB
   |
   v
LLM
   |
   v
Response to User

1️⃣2️⃣ Interview One-Liner Diagram (🔥)
LLM + External Knowledge = RAG
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    blog_md = response.text.strip()

    state["blog_markdown"] = blog_md
    state["blog_title"] = state["query"]   # later can auto-generate
    state["llm_result"] = blog_md
    
    return state
