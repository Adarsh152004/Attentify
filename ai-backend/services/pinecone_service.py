import os
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

# Note: Using pinecone 3.x+ API
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY", "dummy_key")
INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME", "finance-rag-index")

index = None
try:
    if PINECONE_API_KEY and PINECONE_API_KEY != "dummy_key":
        pc = Pinecone(api_key=PINECONE_API_KEY)
        if INDEX_NAME not in [i.name for i in pc.list_indexes()]:
            print(f"Warning: Index '{INDEX_NAME}' not found in Pinecone. Please create it with dimension 768.")
        else:
            index = pc.Index(INDEX_NAME)
    else:
        print("Warning: PINECONE_API_KEY is not set.")
except Exception as e:
    print(f"Pinecone initialization error: {e}")
    index = None

def upsert_vectors(vectors: list, namespace: str = ""):
    """Upserts vectors to Pinecone. Vectors should be a list of dicts: {'id': str, 'values': list, 'metadata': dict}"""
    if not index:
        raise Exception("Pinecone index not initialized.")
    # Upsert in batches of 100
    batch_size = 100
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        index.upsert(vectors=batch, namespace=namespace)

def query_vectors(query_embedding: list[float], top_k: int = 5, namespace: str = "", filter_dict: dict = None):
    """Queries pinecone for similar vectors"""
    if not index:
        print("Warning: Pinecone index not initialized, returning empty results.")
        return []
        
    try:
        response = index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            namespace=namespace,
            filter=filter_dict
        )
        return response['matches']
    except Exception as e:
         print(f"Pinecone query error: {e}")
         return []
