import uuid
from services.gemini_embedding import embed_text
from services.pinecone_service import upsert_vectors


def chunk_and_embed(text: str, doc_id: str, metadata_base: dict = None) -> list[dict]:
    """
    Chunk text into paragraphs, embed each chunk, and return a list of
    Pinecone-ready vector dicts.
    """
    if metadata_base is None:
        metadata_base = {}

    # Split by double newline, fallback to 500-char windows
    raw_chunks = [c.strip() for c in text.split("\n\n") if c.strip()]
    if not raw_chunks:
        raw_chunks = [text[i : i + 500] for i in range(0, len(text), 500)]

    vectors = []
    for i, chunk in enumerate(raw_chunks):
        if len(chunk) < 30:
            continue  # skip very short fragments
        vector_id = f"{doc_id}-chunk-{i}"
        embedding = embed_text(chunk)
        vectors.append(
            {
                "id": vector_id,
                "values": embedding,
                "metadata": {
                    **metadata_base,
                    "doc_id": doc_id,
                    "chunk_index": i,
                    "text": chunk[:500],  # keep first 500 chars for retrieval
                },
            }
        )
    return vectors


def embed_and_store(text: str, doc_id: str, metadata_base: dict = None) -> int:
    """Convenience wrapper: chunk, embed, and upsert to Pinecone. Returns vector count."""
    vectors = chunk_and_embed(text, doc_id, metadata_base)
    if vectors:
        upsert_vectors(vectors)
    return len(vectors)
