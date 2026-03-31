import os
from pinecone import Pinecone, ServerlessSpec

_pc = None
_index = None


def _get_index():
    global _pc, _index
    if _index is None:
        api_key = os.getenv("PINECONE_API_KEY")
        index_name = os.getenv("PINECONE_INDEX_NAME", "agentbot")
        environment = os.getenv("PINECONE_ENVIRONMENT", "us-east-1")

        if not api_key:
            raise RuntimeError("PINECONE_API_KEY not set in environment")

        _pc = Pinecone(api_key=api_key)

        # Create/Validate index (768 dims for Gemini models)
        existing_indexes = [_idx.name for _idx in _pc.list_indexes()]
        
        if index_name in existing_indexes:
            # Check dimension of existing index
            desc = _pc.describe_index(index_name)
            if desc.dimension != 768:
                print(f"WARNING: Dimension mismatch for {index_name} ({desc.dimension} != 768). Recreating...")
                _pc.delete_index(index_name)
                # Wait for internal cleanup (implicit in create_index usually)
                existing_indexes = [_idx.name for _idx in _pc.list_indexes()]

        if index_name not in [_idx.name for _idx in _pc.list_indexes()]:
            print(f"INFO: Creating new 768-dimension index {index_name}...")
            _pc.create_index(
                name=index_name,
                dimension=768,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region=environment),
            )

        _index = _pc.Index(index_name)
    return _index


def upsert_vectors(vectors: list[dict]) -> dict:
    """
    Upsert a list of vectors into Pinecone.
    Each vector dict: { "id": str, "values": list[float], "metadata": dict }
    """
    index = _get_index()
    return index.upsert(vectors=vectors)


def query_vectors(query_vector: list[float], top_k: int = 5, filter: dict = None) -> list[dict]:
    """
    Query Pinecone for the top_k most similar vectors.
    Returns a list of matches with id, score, and metadata.
    """
    index = _get_index()
    kwargs = {"vector": query_vector, "top_k": top_k, "include_metadata": True}
    if filter:
        kwargs["filter"] = filter
    response = index.query(**kwargs)
    return [
        {
            "id": m["id"],
            "score": m["score"],
            "metadata": m.get("metadata", {}),
        }
        for m in response.get("matches", [])
    ]


def delete_vectors(ids: list[str]) -> dict:
    """Delete vectors by ID."""
    index = _get_index()
    return index.delete(ids=ids)
