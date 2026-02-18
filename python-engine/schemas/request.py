from pydantic import BaseModel, Field
from typing import Optional

class QueryRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=1,
        description="User input query"
    )
    # 🔑 Ye add karna zaroori hai
    user_api_key: Optional[str] = Field(
        None, 
        description="User's Gemini API Key from Frontend"
    )