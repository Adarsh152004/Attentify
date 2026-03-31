import os
from google import genai

_client = None

def _get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set in environment")
        # Initialize the modern SDK client
        _client = genai.Client(api_key=api_key)
    return _client

from google.genai import types

def embed_text(text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> list[float]:
    """
    Generate a text embedding using Gemini models.
    Tries 'gemini-embedding-001' first, then 'text-embedding-004' as fallback.
    Returns a list of floats (768-dimensional vector).
    """
    client = _get_client()
    
    # Prioritize gemini-embedding-001 as it is confirmed working in your environment
    models_to_try = ["models/gemini-embedding-001", "models/text-embedding-004"]
    last_error = None

    for model_id in models_to_try:
        try:
            print(f"INFO: Attempting embedding with {model_id}...")
            result = client.models.embed_content(
                model=model_id,
                contents=text,
                config=types.EmbedContentConfig(
                    task_type=task_type,
                    output_dimensionality=768
                ),
            )
            # Successfully generated embedding
            return result.embeddings[0].values
        except Exception as e:
            print(f"WARNING: Embedding with {model_id} failed: {e}")
            last_error = e
            continue

    raise RuntimeError(f"All embedding attempts failed. Last error: {last_error}")

def embed_query(text: str) -> list[float]:
    """Generate an embedding optimised for retrieval queries."""
    return embed_text(text, task_type="RETRIEVAL_QUERY")
