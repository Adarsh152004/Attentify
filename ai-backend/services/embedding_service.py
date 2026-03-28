from services.gemini_service import generate_embedding
import uuid

def process_and_embed_chunks(chunks: list[dict], document_id: str, namespace: str = "default"):
    """
    Takes text chunks, generates embeddings for each, and formats them for Pinecone.
    """
    vectors_to_upsert = []
    
    for i, chunk in enumerate(chunks):
        text = chunk.get('text', '')
        if not text:
            continue
            
        vector = generate_embedding(text)
        if not vector:
            continue
            
        vector_id = f"doc_{document_id}_chunk_{i}_{uuid.uuid4().hex[:8]}"
        
        metadata = {
            "document_id": document_id,
            "text": text,
            "page_num": chunk.get('page_num', 0)
        }
        
        vectors_to_upsert.append({
            "id": vector_id,
            "values": vector,
            "metadata": metadata
        })
        
    return vectors_to_upsert
