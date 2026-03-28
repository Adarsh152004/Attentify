import re

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list[dict]:
    """
    Splits text into smaller chunks compatible with the embedding model.
    Uses basic overlapping word boundaries to preserve context across chunks.
    """
    if not text:
        return []
        
    # Simple split by whitespace (better would be a proper tiktoken/sentence tokenizer)
    words = re.findall(r'\S+|\n', text)
    
    chunks = []
    i = 0
    while i < len(words):
        chunk_words = words[i : i + chunk_size]
        chunk_text = " ".join(chunk_words).replace(" \n ", "\n")
        chunks.append({
            "text": chunk_text,
            "page_num": 0 # A more complex extractor would track the page per chunk
        })
        i += chunk_size - overlap
        
    return chunks
