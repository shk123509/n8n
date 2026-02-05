from typing import TypedDict

class State(TypedDict, total=False):
    # user input / routing
    query: str
    route: str

    # blog writing
    blog_markdown: str
    blog_title: str

    # outputs
    llm_result: str
    published_url: str
