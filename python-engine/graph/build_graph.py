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
from nodes.mongoose import connect_mongo_db
from nodes.insert import insert_data_node
from nodes.read_node import read_data_node
from nodes.get_live_train_status import live_train_status_node
from nodes.summerize_videos import youtube_video_summary_node
from nodes.job import find_jobs_from_query_node
from nodes.flight import flight_status_node
from nodes.weather_node import weather_node
from nodes.prices import crypto_stock_price_node
from nodes.company_info import company_info_node
from nodes.course_find import course_finder_node
from nodes.product_price import product_price_compare_node
from nodes.vehicle_info import vehicle_info_node
from nodes.expesive_track import expense_tracker_node
from nodes.courier import courier_tracking_node
from nodes.bank import bank_ifsc_micr_node
from nodes.live_score import cricket_live_score_node
from nodes.cicd import ci_cd_generator_node


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
    graph.add_node("mongoose", connect_mongo_db)
    graph.add_node("insert", insert_data_node)
    graph.add_node("read_node", read_data_node)
    graph.add_node("get_live_train_status", live_train_status_node)
    graph.add_node("summerize_videos", youtube_video_summary_node)
    graph.add_node("job", find_jobs_from_query_node)
    graph.add_node("flight", flight_status_node)
    graph.add_node("weather_node", weather_node)
    graph.add_node("prices", crypto_stock_price_node)
    graph.add_node("company_info", company_info_node)
    graph.add_node("course_find", course_finder_node)
    graph.add_node("product_price", product_price_compare_node)
    graph.add_node("vehicle_info", vehicle_info_node)
    graph.add_node("expesive_track", expense_tracker_node)
    graph.add_node("courier", courier_tracking_node)
    graph.add_node("bank", bank_ifsc_micr_node)
    graph.add_node("live_score", cricket_live_score_node)
    graph.add_node("cicd", ci_cd_generator_node)
    

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
            "wow_hashnode_publish_node" : "published",
            "connect_mongo_db" : "mongoose",
            "insert_data_node" : "insert",
            "read_data_node" : "read_node",
            "live_train_status_node" : "get_live_train_status",
            "youtube_video_summary_node" : "summerize_videos",
            "find_jobs_from_query_node" : "job",
            "flight_status_node" : "flight",
            "weather_node" : "weather_node",
            "crypto_stock_price_node" : "prices",
            "company_info_node" : "company_info",
            "course_finder_node" : "course_find",
            "product_price_compare_node" : "product_price",
            "vehicle_info_node" : "vehicle_info",
            "expense_tracker_node" : "expesive_track",
            "courier_tracking_node" : "courier",
            "bank_ifsc_micr_node" : "bank",
            "cricket_live_score_node" : "live_score",
            "ci_cd_generator_node" : "cicd"
            
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
    graph.add_edge("mongoose", "insert")
    graph.add_edge("insert", "read_node")
    graph.add_edge("read_node", END)
    graph.add_edge("get_live_train_status", END)
    graph.add_edge("summerize_videos", END)
    graph.add_edge("job", END)
    graph.add_edge("flight", END)
    graph.add_edge("weather_node", END)
    graph.add_edge("prices", END)
    graph.add_edge("company_info", END)
    graph.add_edge("course_find", END)
    graph.add_edge("product_price", END)
    graph.add_edge("vehicle_info", END)
    graph.add_edge("expesive_track", END)
    graph.add_edge("courier", END)
    graph.add_edge("bank", END)
    graph.add_edge("live_score", END)
    graph.add_edge("cicd", END)
  

    return graph.compile()
