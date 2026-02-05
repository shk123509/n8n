from typing import TypedDict, Any, Dict, List


class State(TypedDict, total=False):
    # user input / routing
    query: str
    route: str

    # blog writing (KEEP IT – koi issue nahi)
    blog_markdown: str
    blog_title: str

    # outputs
    llm_result: str
    published_url: str

    # mongo
    mongo_url: str
    mongo_client: Any   # 🔥 any ❌ -> Any ✅

    # data ops
    data_to_insert: Dict
    read_result: List[Dict]
