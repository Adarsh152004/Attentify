def build_context(matches: list) -> str:
    """Takes Pinecone matches and formats them into a prompt-friendly context string."""
    context_chunks = []
    
    for i, match in enumerate(matches):
        metadata = match.get('metadata', {})
        text = metadata.get('text', '')
        score = match.get('score', 0)
        
        # Only include context with some basic relevance threshold
        if score > 0.65:
            context_chunks.append(f"--- Excerpt {i+1} (Relevance: {score:.2f}) ---\n{text}")
            
    if not context_chunks:
        return ""
        
    return "Here is some context from the user's uploaded financial documents:\n\n" + "\n\n".join(context_chunks)
