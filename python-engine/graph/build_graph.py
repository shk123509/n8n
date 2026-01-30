from langgraph.graph import StateGraph, START, END
from graph.state import State

from nodes.classifier import classification_query, route
from nodes.coding import is_coding_question
from nodes.doctor import is_doctor_question
from nodes.farmer import is_farmer_question
from nodes.advice import is_advice_question
from nodes.general import is_general_question

def build_graph():
    graph = StateGraph(State)

    graph.add_node("classify", classification_query)
    graph.add_node("coding", is_coding_question)
    graph.add_node("doctor", is_doctor_question)
    graph.add_node("farmer", is_farmer_question)
    graph.add_node("advice", is_advice_question)
    graph.add_node("general", is_general_question)

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
        }
    )

    graph.add_edge("coding", END)
    graph.add_edge("doctor", END)
    graph.add_edge("farmer", END)
    graph.add_edge("advice", END)
    graph.add_edge("general", END)

    return graph.compile()
