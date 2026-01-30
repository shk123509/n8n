from fastapi import FastAPI
from schemas.request import QueryRequest
from graph.build_graph import build_graph

app = FastAPI(title="AI Node Engine")

graph = build_graph()   # 🔥 graph ek baar load hota hai


@app.post("/execute")
def execute(req: QueryRequest):
    state = {
        "query": req.query,
        "route": ""   # important for conditional routing
    }

    result = graph.invoke(state)

    return {
        "result": result.get("llm_result")
    }
