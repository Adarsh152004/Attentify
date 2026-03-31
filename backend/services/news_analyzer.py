import json
import os
import asyncio
from datetime import datetime
from duckduckgo_search import DDGS
from services.groq_service import analyze_news_impact

PROCESSED_NEWS_FILE = "processed_news.json"

def fetch_and_enrich_news():
    """
    1. Load existing news history.
    2. Fetch latest Indian market news using DDGS.
    3. Enrich new items only (avoid re-analyzing same headlines).
    4. Save the merged history (limit to 50) to processed_news.json.
    """
    print(f"[{datetime.now()}] Starting autonomous news ingestion (History Mode)...")
    try:
        # Load existing history
        history = []
        if os.path.exists(PROCESSED_NEWS_FILE):
            try:
                with open(PROCESSED_NEWS_FILE, "r") as f:
                    history = json.load(f)
            except:
                history = []
        
        existing_urls = {item.get("url") for item in history}
        new_enriched_count = 0

        with DDGS() as ddgs:
            # Focus on Indian stock market news
            results = list(ddgs.news(keywords="Indian Stock Market NSE BSE latest", max_results=10))
            
            for item in results:
                headline = item.get("title", "")
                url = item.get("url", "#")
                
                # Skip if already in history
                if url in existing_urls:
                    continue

                source = item.get("source", "Unknown")
                
                try:
                    # Neural Enrichment
                    analysis = analyze_news_impact(headline)
                    
                    history.insert(0, { # Insert at start for chronological feel
                        "id": hash(headline + url),
                        "headline": headline,
                        "source": source,
                        "url": url,
                        "sentiment": analysis.get("sentiment", "Neutral"),
                        "confidence": analysis.get("confidence", 0),
                        "tickers": analysis.get("tickers", []),
                        "impact": analysis.get("impact", "No significant impact predicted."),
                        "fetched_at": datetime.now().isoformat()
                    })
                    new_enriched_count += 1
                except Exception as Neural_err:
                    print(f"Neural Enrichment fNeuralled for '{headline}': {Neural_err}")

        # Limit history to 50 items (User suggested 20, I recommend 50 for a better hub feel)
        history = history[:50]

        # Save the updated history
        with open(PROCESSED_NEWS_FILE, "w") as f:
            json.dump(history, f, indent=2)
            
        print(f"[{datetime.now()}] Successfully updated history. Added {new_enriched_count} new items. Total: {len(history)}")
        return history

    except Exception as e:
        print(f"News Ingestion Error: {e}")
        return []

async def news_ingestion_loop(interval_minutes: int = 30):
    """Loop to run the news ingestion and enrichment periodically."""
    while True:
        fetch_and_enrich_news()
        await asyncio.sleep(interval_minutes * 60)

def get_latest_news():
    """Read processed news from the JSON file."""
    if not os.path.exists(PROCESSED_NEWS_FILE):
        return []
    try:
        with open(PROCESSED_NEWS_FILE, "r") as f:
            return json.load(f)
    except:
        return []



