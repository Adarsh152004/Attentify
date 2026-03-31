import os
from groq import Groq

_client = None

def _get_client() -> Groq:
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY not set in environment")
        _client = Groq(api_key=api_key)
    return _client


def generate_answer(prompt: str, model: str = "llama-3.1-8b-instant", max_tokens: int = 1024) -> str:
    """Send a prompt to Groq and return the text response."""
    client = _get_client()
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": (
                    "You are FinPulse AI, an expert financial intelligence assistant specialising in "
                    "Indian markets (NSE/BSE). You provide accurate, concise, and professional "
                    "financial analysis based on the context provided."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        model=model,
        max_tokens=max_tokens,
        temperature=0.4,
    )
    return chat_completion.choices[0].message.content


def classify_sentiment(text: str) -> dict:
    """Classify the sentiment of a financial text snippet."""
    client = _get_client()
    prompt = (
        f"Classify the sentiment of this financial news headline or text as one of: "
        f"'Bullish', 'Bearish', or 'Neutral'. Also provide a confidence score 0-100 "
        f"and a one-sentence explanation.\n\n"
        f"Text: {text}\n\n"
        f"Respond ONLY in JSON format: "
        f'{{ "sentiment": "...", "confidence": <number>, "explanation": "..." }}'
    )
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
        max_tokens=256,
        temperature=0.1,
        response_format={"type": "json_object"},
    )
    import json
    return json.loads(response.choices[0].message.content)

def analyze_news_impact(headline: str, source: str) -> dict:
    """Perform deep neural analysis on a financial headline."""
    client = _get_client()
    prompt = (
        f"Analyze this Indian financial news headline for market impact.\n\n"
        f"Headline: {headline}\nSource: {source}\n\n"
        f"Determine:\n1. Sentiment (Bullish/Bearish/Neutral)\n"
        f"2. Confidence (0-100)\n"
        f"3. Most relevant stock tickers (NSE/BSE symbols)\n"
        f"4. A one-sentence 'Neural Impact' summary of why this matters.\n\n"
        f"Respond Strictly in JSON format:\n"
        f'{{ "sentiment": "...", "confidence": <number>, "tickers": ["..."], "impact": "..." }}'
    )
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
        max_tokens=512,
        temperature=0.1,
        response_format={"type": "json_object"},
    )
    import json
    return json.loads(response.choices[0].message.content)
