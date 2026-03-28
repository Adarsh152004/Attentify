import os
from groq import Groq
from tavily import TavilyClient

def run_rag_pipeline(question: str, user_id: str) -> dict:
    """End-to-end Pipeline using Tavily for Web Search & Groq (Llama 3) for Generation."""
    
    groq_key = os.environ.get("GROQ_API_KEY", "").strip()
    tavily_key = os.environ.get("TAVILY_API_KEY", "").strip()

    if not groq_key or not tavily_key:
         print(f"DEBUG: Missing keys - Groq: {bool(groq_key)}, Tavily: {bool(tavily_key)}")
         return {
             "response": "Configuration Error: Please add valid GROQ_API_KEY and TAVILY_API_KEY to your ai-backend side .env file.",
             "context_used": "No Live Search (Missing Keys)"
         }

    # Re-initialize clients with stripped keys
    groq_client = Groq(api_key=groq_key)
    tavily_client = TavilyClient(api_key=tavily_key)
    
    # 1. Fetch live context using Tavily
    context = ""
    try:
        tavily_response = tavily_client.search(query=question, search_depth="basic", max_results=3)
        # Build a readable context from the results
        results = [f"Source ({res['url']}): {res['content']}" for res in tavily_response.get("results", [])]
        context = "\n\n".join(results)
    except Exception as e:
        print(f"Tavily Search Error: {e}")
        context = "I couldn't fetch live data due to a search error."
        
    # 2. Construct Prompt
    base_prompt = f"""You are an expert, professional AI Financial Assistant.
Answer the user's financial question thoughtfully and accurately.

Use the following real-time web search context to inform your answer. 
If the context is irrelevant, ignore it and answer based on your general knowledge.

[WEB SEARCH CONTEXT]
{context}

[USER QUESTION]
{question}

Provide your response in clear, concise markdown formatting.
"""
    
    # 3. Generate response using Groq (llama3-70b-8192 or mixtral-8x7b-32768)
    response_text = "I am currently unable to answer this question. Please check the Groq API configuration."
    try:
        if os.environ.get("GROQ_API_KEY"):
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a top-tier financial assistant built to help users make sense of the market."
                    },
                    {
                        "role": "user",
                        "content": base_prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.2, # Lower temp for more factual/financial responses
                max_tokens=2048,
            )
            response_text = chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Groq Generation Error: {e}")
        response_text = f"Groq Error: {str(e)}. Please check if your GROQ_API_KEY is valid and has not expired."

    return {
        "response": response_text,
        "context_used": context
    }
