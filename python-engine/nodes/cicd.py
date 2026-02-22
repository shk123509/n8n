import os
from dotenv import load_dotenv
from graph.state import State
from google import genai

load_dotenv()

def ci_cd_generator_node(state: State) -> State:
    print("🚀 CI/CD Generator Node Running")

    user_query = state.get("query", "")
    user_key = state.get("user_api_key")

    if not user_key:
        state["llm_result"] = "❌ Gemini API Key missing."
        return state

    try:
        client = genai.Client(api_key=user_key)

        prompt = f"""
You are a senior DevOps engineer.

Generate a professional GitHub Actions CI/CD workflow YAML file 
for the following project request:

User Request:
{user_query}

Requirements:
- Include checkout step
- Setup environment
- Install dependencies
- Linting step
- Run tests
- Build step
- Use best practices
- Use latest stable action versions
- Return ONLY valid YAML
- No explanations
"""

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )

        yaml_output = response.text.strip()

        # Basic safety check
        if "name:" not in yaml_output:
            state["llm_result"] = "❌ Failed to generate valid workflow."
            return state

        state["llm_result"] = yaml_output
        return state

    except Exception as e:
        state["llm_result"] = f"❌ CI/CD generation failed: {str(e)}"
        return state