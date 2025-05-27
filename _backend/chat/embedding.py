import faiss
from sentence_transformers import SentenceTransformer
import torch
#import torchaudio
from PIL import Image
import logging
#from torchvggish import vggish
from transformers import CLIPProcessor, CLIPModel

# Load the pre-trained models
text_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
#image_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
#image_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
#audio_model = vggish()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_embeddings(data, data_type):
    """
    Create embeddings for the given data using appropriate models and FAISS.
    
    Args:
        data (list): List of data to create embeddings for.
        data_type (str): Type of data ('text', 'image', 'audio').
        
    Returns:
        index (faiss.Index): FAISS index containing the embeddings.
    """
    if data_type == 'text':
        embeddings = text_model.encode(data)
  #  elif data_type == 'image':
   #     images = [Image.open(item) for item in data]
   #     inputs = image_processor(images=images, return_tensors="pt", padding=True)
   #     embeddings = image_model.get_image_features(**inputs).detach().numpy()
    #elif data_type == 'audio':
      #  audio_tensors = [torchaudio.load(item)[0] for item in data]
     #   embeddings = [audio_model(audio_tensor.unsqueeze(0)).detach().numpy() for audio_tensor in audio_tensors]
      #  embeddings = np.vstack(embeddings)
    else:
        raise ValueError("Unsupported data type. Choose from 'text', 'image', or 'audio'.")
    
    # Create a FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    
    # Add embeddings to the index
    index.add(embeddings)
    
    # Log the creation of embeddings
    logger.info(f"Created {len(data)} embeddings for {data_type} data.")
    
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
