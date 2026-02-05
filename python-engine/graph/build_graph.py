from langgraph.graph import StateGraph, START, END
from graph.state import State

from nodes.classifier import classification_query, route
from nodes.coding import is_coding_question
from nodes.doctor import is_doctor_question
from nodes.farmer import is_farmer_question
from nodes.advice import is_advice_question
from nodes.general import is_general_question
from nodes.google_serach import wow_serpapi_search_node
from nodes.blogs import wow_gemini_blog_writer_node
from nodes.published import wow_hashnode_publish_node

def build_graph():
    graph = StateGraph(State)

    graph.add_node("classify", classification_query)
    graph.add_node("coding", is_coding_question)
    graph.add_node("doctor", is_doctor_question)
    graph.add_node("farmer", is_farmer_question)
    graph.add_node("advice", is_advice_question)
    graph.add_node("general", is_general_question)
    graph.add_node("google_serach", wow_serpapi_search_node)
    graph.add_node("blogs", wow_gemini_blog_writer_node)
    graph.add_node("published", wow_hashnode_publish_node)

    graph.add_edge(START, "classify")

    graph.add_conditional_edges(
        "classify",
        route,
        {
            "is_coding_question": "coding",
            "is_doctor_question": "doctor",
            "is_farmer_question": "farmer",
            "is_advice_question": "advice",
            "is_general_question": "general",
            "wow_serpapi_search_node" : "google_serach",
            "wow_gemini_blog_writer_node" : "blogs",
            "wow_hashnode_publish_node" : "published"
        }
    )

    graph.add_edge("coding", END)
    graph.add_edge("doctor", END)
    graph.add_edge("farmer", END)
    graph.add_edge("advice", END)
    graph.add_edge("general", END)
    graph.add_edge("google_serach", END)
    graph.add_edge("blogs", "published")
    graph.add_edge("published", END)
  

    return graph.compile()
