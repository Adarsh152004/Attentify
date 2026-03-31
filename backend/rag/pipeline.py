import os
from tavily import TavilyClient
from services.gemini_embedding import embed_query
from services.pinecone_service import query_vectors
from services.groq_service import generate_answer


def _get_tavily() -> TavilyClient:
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise RuntimeError("TAVILY_API_KEY not set in environment")
    return TavilyClient(api_key=api_key)


def run_rag_pipeline(question: str, use_web: bool = True, top_k: int = 5, portfolio_context: str = "") -> dict:
    """
    Full RAG pipeline:
    1. Embed the question → query Pinecone for relevant document chunks
    2. Optionally search Tavily for real-time web context
    3. Build an enriched prompt and generate answer via Groq
    Returns: { "answer": str, "sources": list[str], "context_chunks": int }
    """
    # --- Step 1: Vector search in Pinecone ---
    query_vec = embed_query(question)
    pinecone_results = query_vectors(query_vec, top_k=top_k)

    doc_context = ""
    for match in pinecone_results:
        text = match["metadata"].get("text", "")
        source = match["metadata"].get("filename", "document")
        doc_context += f"\n[Document: {source}]\n{text}\n"

    # --- Step 2: Tavily web search ---
    web_context = ""
    web_sources = []
    if use_web:
        try:
            tavily = _get_tavily()
            search_response = tavily.search(
                query=f"{question} Indian stock market NSE BSE",
                max_results=3,
                search_depth="basic",
                include_answer=True,
            )
            if search_response.get("answer"):
                web_context += f"\n[Web Summary]\n{search_response['answer']}\n"
            for result in search_response.get("results", []):
                web_context += f"\n[{result['title']}]\n{result['content'][:400]}\n"
                web_sources.append(result.get("url", ""))
        except Exception as e:
            web_context = f"\n[Web search unavailable: {e}]\n"

    # --- Step 3: Build prompt and generate ---
    context = (doc_context + web_context).strip()
    if not context:
        context = "No additional context available."

    extra_context = ""
    if portfolio_context:
        extra_context = f"\nUser's Current Portfolio Status:\n{portfolio_context}\n"

    prompt = f"""You are FinPulse AI, an expert financial intelligence assistant for Indian markets.
Answer the user's question using ONLY the context provided below. If the context is insufficient, say so clearly.

IMPORTANT: If the Portfolio Status is provided, prioritize it when answering questions about the user's holdings or wealth.

Context:
{context}
{extra_context}

User Question: {question}

Provide a clear, structured, professional answer in Markdown format."""

    answer = generate_answer(prompt, max_tokens=1200)

    return {
        "answer": answer,
        "sources": web_sources,
        "context_chunks": len(pinecone_results),
    }
