import faiss
from sentence_transformers import SentenceTransformer

# Load the pre-trained model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def create_embeddings(data):
    """
    Create embeddings for the given data using SentenceTransformer and FAISS.
    
    Args:
        data (list): List of text data to create embeddings for.
        
    Returns:
        index (faiss.Index): FAISS index containing the embeddings.
    """
    # Generate embeddings
    embeddings = model.encode(data)
    
    # Create a FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    
    # Add embeddings to the index
    index.add(embeddings)
    
    return index

def load_embeddings(index_path):
    """
    Load embeddings from a FAISS index file.
    
    Args:
        index_path (str): Path to the FAISS index file.
        
    Returns:
        index (faiss.Index): Loaded FAISS index.
    """
    # Load the FAISS index
    index = faiss.read_index(index_path)
    
    return index
