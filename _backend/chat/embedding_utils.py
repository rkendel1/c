import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmbeddingManager:
    def __init__(self, model_name='paraphrase-MiniLM-L6-v2', index_path=None):
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.index_path = index_path
        if index_path:
            try:
                self.index = faiss.read_index(index_path)
                logger.info(f"Loaded FAISS index from {index_path}")
            except Exception:
                logger.info("No existing FAISS index found, will create a new one.")

    def create_embeddings(self, texts):
        return self.model.encode(texts)

    def create_index(self, embeddings):
        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embeddings)
        return self.index

    def add_to_index(self, new_texts):
        new_embs = self.create_embeddings(new_texts)
        if self.index is None:
            self.create_index(new_embs)
        else:
            self.index.add(new_embs)
        logger.info(f"Added {len(new_texts)} items to FAISS index.")
        if self.index_path:
            faiss.write_index(self.index, self.index_path)

    def query_index(self, query_text, top_k=5):
        query_emb = self.create_embeddings([query_text])
        D, I = self.index.search(query_emb, top_k)
        return I[0], D[0]  # indices and distances

    def save_index(self, path=None):
        if self.index is not None:
            faiss.write_index(self.index, path or self.index_path)
            logger.info(f"FAISS index saved at {path or self.index_path}")