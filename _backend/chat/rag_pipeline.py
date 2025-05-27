from .embedding_utils import EmbeddingManager
from .llm_client import LLMClient

class RAGPipeline:
    def __init__(self, embedding_manager, llm_client, context_store=None):
        self.embedding_manager = embedding_manager
        self.llm_client = llm_client
        self.context_store = context_store  # Optionally a list, dict, or DB model

    def retrieve_context(self, query, top_k=3):
        indices, _ = self.embedding_manager.query_index(query, top_k=top_k)
        # context_store assumed to be a list or dict with retrievable items
        if self.context_store:
            return [self.context_store[i] for i in indices if i < len(self.context_store)]
        return []

    def generate(self, query):
        context = self.retrieve_context(query)
        ctx_str = "\n".join(context) if context else ""
        augmented_query = f"{ctx_str}\n{query}" if ctx_str else query
        return self.llm_client.generate(augmented_query)

    def handle_query(self, query):
        response = self.generate(query)
        # Optionally: store (query, response) in persistent store
        return response