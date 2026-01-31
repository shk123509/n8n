from fastapi import FastAPI
from schemas.request import QueryRequest
from graph.build_graph import build_graph
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Node Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # production me frontend URL daalna
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = build_graph()   # 🔥 graph ek baar load hota hai


@app.post("/execute")
def execute(req: QueryRequest):
    state = {
        "query": req.query,
        "route": ""   # important for conditional routing
    }

    result = graph.invoke(state)

    return {
        "result": result.get("llm_result"),
        "route": result.get("route")
    }
