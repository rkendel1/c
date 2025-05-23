import requests

def call_llm_utility(model, prompt):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json().get("response", "")
    except requests.RequestException as e:
        return f"Error contacting {model} model: {str(e)}"
