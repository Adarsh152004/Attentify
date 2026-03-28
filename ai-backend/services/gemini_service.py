import os
from groq import Groq

def generate_text(prompt: str) -> str:
    """Generates text using Groq model (replaces Gemini for now)."""
    groq_key = os.environ.get("GROQ_API_KEY")
    if not groq_key:
         return "I cannot summarize because GROQ_API_KEY is not configured."
         
    try:
        client = Groq(api_key=groq_key)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.2,
            max_tokens=2048,
        )
        return response.choices[0].message.content
    except Exception as e:
         print(f"Groq generation error: {e}")
         return "I encountered an error generating a response."

def generate_embedding(text: str) -> list[float]:
    """Generates an embedding vector using Gemini's text embedding model."""
    try:
         import google.generativeai as genai
         result = genai.embed_content(
            model="models/gemini-embedding-2-preview",
            content=text,
            task_type="retrieval_document"
         )
         return result['embedding']
    except Exception as e:
        print(f"Gemini embedding error: {e}")
        return [0.0] * 768
