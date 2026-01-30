from typing import TypedDict

class State(TypedDict):
    query: str
    llm_result: str
    route: str
