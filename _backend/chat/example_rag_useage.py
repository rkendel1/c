from .embedding_utils import EmbeddingManager
from .llm_client import LLMClient
from .rag_pipeline import RAGPipeline

# Step 1: Load data and build embeddings/index
documents = [
    "Zoning law 1...",
    "Permit regulation A...",
    "How to apply for a permit...",
    "Trash pickup schedule..."
]
embedding_mgr = EmbeddingManager(index_path="faiss.index")
embedding_mgr.add_to_index(documents)  # Only needs to be run once per new document batch

# Step 2: Setup LLM client
llm_client = LLMClient(endpoint="http://localhost:11434/api/generate", default_model="llm")

# Step 3: Setup RAG pipeline
pipeline = RAGPipeline(embedding_mgr, llm_client, context_store=documents)

# Step 4: Handle a query
query = "What do I need to open a restaurant?"
response = pipeline.handle_query(query)
print("RAG Response:", response)