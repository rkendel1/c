import requests

class LLMClient:
    def __init__(self, endpoint="http://localhost:11434/api/generate", default_model="llm"):
        self.endpoint = endpoint
        self.default_model = default_model

    def generate(self, prompt, model=None, stream=False, retries=2):
        payload = {
            "model": model or self.default_model,
            "prompt": prompt,
            "stream": stream
        }
        for attempt in range(retries):
            try:
                resp = requests.post(self.endpoint, json=payload, timeout=30)
                resp.raise_for_status()
                return resp.json().get("response", "")
            except Exception as e:
                if attempt == retries - 1:
                    raise
        return None