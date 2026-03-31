import os
import json
import asyncio
import warnings
import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

warnings.filterwarnings("ignore", category=ResourceWarning)

import yfinance as yf
from duckduckgo_search import DDGS
import pandas as pd
from pypfopt import expected_returns, risk_models
from pypfopt.efficient_frontier import EfficientFrontier

from google import genai
from google.genai import types

load_dotenv()
from services.news_analyzer import fetch_and_enrich_news, get_latest_news, news_ingestion_loop

# Initialize API Key for Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

app = FastAPI(title="FinPulse India V2 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Start the autonomous news ingestion loop in the background
    # Runs every 15 minutes as requested
    asyncio.create_task(news_ingestion_loop(15))
    print("Background news ingestion task started (15m interval).")

def sanitize_data(obj):
    """
    Recursively replaces NaN, Inf, and -Inf with None (null in JSON).
    Prevents "Out of range float values are not JSON compliant" errors.
    """
    import math
    if isinstance(obj, dict):
        return {k: sanitize_data(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_data(x) for x in obj]
    elif isinstance(obj, float):
        if not math.isfinite(obj):
            return None
        return obj
    return obj

class AnalyzeRequest(BaseModel):
    ticker: str

class PortfolioRequest(BaseModel):
    tickers: list[str]
    risk_appetite: str # "Low", "Medium", "High"
    period: str = "1y" # "1y", "3y", "5y"

class PredictRequest(BaseModel):
    query: str

class VeracityRequest(BaseModel):
    headline: str
    source: str

class ChatRequest(BaseModel):
    message: str
    use_web: bool = True

@app.get("/api/market")
def get_market():
    # Fetch real NIFTY 50 intraday 15m data
    try:
        nifty = yf.Ticker("^NSEI")
        hist = nifty.history(period="1d", interval="15m")
        if hist.empty:
            return {"error": "No market data found (Market might be closed/weekend).", "data": []}
            
        chart_data = []
        for index, row in hist.iterrows():
            # Format time HH:MM
            time_str = index.strftime("%H:%M")
            chart_data.append({"time": time_str, "value": round(row['Close'], 2)})
            
        current_price = chart_data[-1]["value"] if chart_data else 0
        open_price = hist['Open'].iloc[0] if not hist.empty else 1
        pct_change = ((current_price - open_price) / open_price) * 100
            
        return {"data": chart_data, "current": current_price, "pct_change": round(pct_change, 2)}
    except Exception as e:
        print(f"Error fetching ^NSEI: {e}")
        return {"error": str(e), "data": []}

@app.post("/api/analyze")
async def analyze_stock(req: AnalyzeRequest):
    ticker = req.ticker.upper()
    ns_ticker = ticker if ticker.endswith(".NS") else f"{ticker}.NS"
    
    # 1. Fetch Real Stats
    try:
        stock = yf.Ticker(ns_ticker)
        info = stock.info
        current_price = info.get("currentPrice", 0)
        day_high = info.get("dayHigh", 0)
        day_low = info.get("dayLow", 0)
        pe_ratio = info.get("trailingPE", "N/A")
        market_cap = info.get("marketCap", "N/A")
        
        fifty_day_ma = info.get("fiftyDayAverage", "N/A")
        if isinstance(fifty_day_ma, (int, float)):
            fifty_day_ma = round(fifty_day_ma, 2)
            
        fifty_two_week_high = info.get("fiftyTwoWeekHigh", "N/A")
        if isinstance(fifty_two_week_high, (int, float)):
            fifty_two_week_high = round(fifty_two_week_high, 2)
            
        fifty_two_week_low = info.get("fiftyTwoWeekLow", "N/A")
        if isinstance(fifty_two_week_low, (int, float)):
            fifty_two_week_low = round(fifty_two_week_low, 2)
            
        dividend_yield = info.get("dividendYield", "N/A")
        if isinstance(dividend_yield, (int, float)) and dividend_yield != "N/A":
            dividend_yield = f"{round(dividend_yield * 100, 2)}%"
        
        # Safe format
        fmt_price = f"₹{current_price}" if current_price else "N/A"
        
        # 2. Scrape Real News and Pre-vet via Veracity Check
        news_results = []
        with DDGS() as ddgs:
            results = ddgs.news(keywords=f"{ticker} stock India news", max_results=5)
            if results:
                news_results = list(results)
                
        trusted_news = news_results
        news_str = ""
        for i, n in enumerate(trusted_news):
            news_str += f"{i+1}. [{n['source']}] {n['title']} (URL: {n['url']})\nSnippet: {n['body']}\n\n"

        # 3. Analyze with AI (Groq) Structured Output
        analysis_markdown = "AI Analysis failed to generate."
        sources_array = []
        
        prompt = f"""
        You are an expert Indian financial analyst for FinPulse India.
        Synthesize the following real-time data and news into a professional analysis for the stock {ns_ticker}.
        
        Current Price: {fmt_price}
        P/E Ratio: {pe_ratio}
        Day High/Low: {day_high} / {day_low}
        50-Day MA: {fifty_day_ma}
        52-Week High/Low: {fifty_two_week_high} / {fifty_two_week_low}
        Div. Yield: {dividend_yield}
        
        Recent News:
        {news_str}
        
        Respond strictly in valid JSON format using this schema:
        {{
            "analysis": "<Detailed 2-3 paragraph markdown analysis here. Use bullet points for Market Sentiment. Do not hallucinate raw URLs in text.>",
            "sources": [
                {{
                    "name": "<Source Name (e.g. Economic Times)>",
                    "url": "<URL>"
                }}
            ]
        }}
        Include ONLY the sources from the news list above that you actively relied upon.
        """
        
        try:
            from services.groq_service import _get_client as get_groq_client
            groq_client = get_groq_client()
            
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are FinPulse AI, an expert financial intelligence assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                max_tokens=1024,
                temperature=0.4,
                response_format={"type": "json_object"},
            )
            raw_txt = chat_completion.choices[0].message.content.strip()
            
            import re
            import json
            raw_txt = re.sub(r"^```json\s*|\s*```$", "", raw_txt, flags=re.MULTILINE).strip()
            res_json = json.loads(raw_txt)
            analysis_markdown = res_json.get("analysis", "Error parsing analysis text.")
            sources_array = res_json.get("sources", [])
        except Exception as pe:
            print(f"Failed to fetch/parse analysis JSON from Groq: {pe}")
            analysis_markdown = f"Analysis failed to generate or parse correctly. {pe}"
        
        return {
            "ticker": ticker,
            "metrics": {
                "price": fmt_price,
                "high": day_high,
                "low": day_low,
                "pe": pe_ratio,
                "fifty_day_ma": fifty_day_ma,
                "fifty_two_week_high": fifty_two_week_high,
                "fifty_two_week_low": fifty_two_week_low,
                "dividend_yield": dividend_yield
            },
            "analysis": analysis_markdown,
            "sources": sources_array
        }
    except Exception as e:
        print(f"Analysis Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/portfolio")
def optimize_portfolio(req: PortfolioRequest):
    try:
        if not req.tickers:
            raise ValueError("No tickers provided")
            
        ns_tickers = [t if t.endswith(".NS") else f"{t}.NS" for t in req.tickers]
        
        # Limit to 10 tickers to avoid massive local memory loads on user machine
        if len(ns_tickers) > 10:
            ns_tickers = ns_tickers[:10]
            
        # Download historical data dynamically based on user config (1y, 3y, 5y)
        data = yf.download(ns_tickers, period=req.period)['Close']
        if data.empty:
            raise ValueError("No price data retrieved from Yahoo Finance.")
            
        # If user selected only 1 ticker, return 100% allocation
        if len(ns_tickers) == 1:
            return {
                "allocation": [{"name": req.tickers[0], "value": 100}],
                "performance": {"return": 0, "volatility": 0, "sharpe": 0}
            }
            
        # Calculate Expected Returns and Sample Covariance
        mu = expected_returns.mean_historical_return(data)
        S = risk_models.sample_cov(data)
        
        # Optimize for maximum sharpe ratio
        ef = EfficientFrontier(mu, S)
        
        # Adjust objective based on risk
        if req.risk_appetite == "High":
            ef.max_sharpe()
        elif req.risk_appetite == "Low":
            ef.min_volatility()
        else: # Medium
            ef.max_sharpe()
            
        cleaned_weights = ef.clean_weights() # dict of {ticker: weight}
        
        # Extract the True Mathetmatical Performance numbers!
        perf = ef.portfolio_performance()
        expected_return = perf[0]
        volatility = perf[1]
        sharpe_ratio = perf[2]
        
        # Format for chart (Name, Value)
        chart_data = []
        for i, (ticker, weight) in enumerate(cleaned_weights.items()):
            w_pct = round(weight * 100, 1)
            if w_pct > 0:
                # Strip '.NS' for display
                disp_name = req.tickers[i] 
                chart_data.append({"name": disp_name, "value": w_pct})
                
        # Sort by value descending
        chart_data.sort(key=lambda x: x['value'], reverse=True)
        
        return {
            "allocation": chart_data,
            "performance": {
                "return": round(expected_return * 100, 1),
                "volatility": round(volatility * 100, 1),
                "sharpe": round(sharpe_ratio, 2)
            }
        }
    except Exception as e:
        print(f"Portfolio Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# ATTENTIFY INTELLIGENCE LAYER — NEW ENDPOINTS (DO NOT MODIFY ABOVE)
# ============================================================

# --- Lazy-load Attentify services (imported only when first used) ---
def _groq():
    from services.groq_service import generate_answer, classify_sentiment
    return generate_answer, classify_sentiment

def _embedding():
    from services.gemini_embedding import embed_text, embed_query
    return embed_text, embed_query

def _pinecone():
    from services.pinecone_service import upsert_vectors, query_vectors
    return upsert_vectors, query_vectors

def _rag():
    from rag.pipeline import run_rag_pipeline
    return run_rag_pipeline


# --- Pydantic models for new endpoints ---
class VeracityRequest(BaseModel):
    headline: str
    source: str

class ChatRequest(BaseModel):
    message: str
    use_web: bool = True

class SentimentRequest(BaseModel):
    text: str

class EmbedRequest(BaseModel):
    text: str
    task_type: str = "RETRIEVAL_DOCUMENT"

class StoreVectorRequest(BaseModel):
    id: str
    values: list[float]
    metadata: dict = {}

class QueryContextRequest(BaseModel):
    query: str
    top_k: int = 5
    filter: Optional[dict] = None


# --- Seed news headlines (used by VeracityWidget) ---
SEED_NEWS = [
    {
        "id": 1, 
        "headline": "SEBI tightens F&O margin norms for retail investors to curb speculation", 
        "source": "Economic Times",
        "url": "https://economictimes.indiatimes.com",
        "sentiment": "Neutral",
        "confidence": 85,
        "tickers": ["NSE", "SEBI"],
        "impact": "Increased margin requirements may reduce retail participation in high-risk F&O segments.",
        "fetched_at": datetime.now().isoformat()
    },
    {
        "id": 2, 
        "headline": "RBI holds repo rate at 6.5% amid sticky core inflation concerns", 
        "source": "LiveMint",
        "url": "https://www.livemint.com",
        "sentiment": "Neutral",
        "confidence": 92,
        "tickers": ["RBI", "NBFC"],
        "impact": "Steady interest rates provide stability but signal a cautious stance on inflation.",
        "fetched_at": datetime.now().isoformat()
    },
    {
        "id": 3, 
        "headline": "Nifty 50 hits record high as FIIs pump ₹8,200 crore in a single session", 
        "source": "Business Standard",
        "url": "https://www.business-standard.com",
        "sentiment": "Bullish",
        "confidence": 95,
        "tickers": ["NIFTY50", "HDFCBANK"],
        "impact": "Strong foreign inflows signal global confidence in the Indian equity markets.",
        "fetched_at": datetime.now().isoformat()
    },
    {
        "id": 4, 
        "headline": "Adani Group secures ₹12,000 crore green energy financing from SBI", 
        "source": "Financial Express",
        "url": "https://www.financialexpress.com",
        "sentiment": "Bullish",
        "confidence": 88,
        "tickers": ["ADANIENT", "SBIN"],
        "impact": "Major capital infusion for renewables boosts Adani's infrastructure and ESG credentials.",
        "fetched_at": datetime.now().isoformat()
    },
    {
        "id": 5, 
        "headline": "IT sector outlook turns cautious as US recession fears dampen deal pipelines", 
        "source": "NDTV Profit",
        "url": "https://www.ndtv.com/profit",
        "sentiment": "Bearish",
        "confidence": 80,
        "tickers": ["INFY", "TCS"],
        "impact": "US macroeconomic headwinds are likely to slow revenue growth for major Indian IT players.",
        "fetched_at": datetime.now().isoformat()
    },
    {
        "id": 6, 
        "headline": "Gold ETFs see record inflows of ₹3,500 crore as investors hedge equity risk", 
        "source": "Moneycontrol",
        "url": "https://www.moneycontrol.com",
        "sentiment": "Bullish",
        "confidence": 90,
        "tickers": ["GOLD", "RELIANCE"],
        "impact": "High volatility in equities is driving investors towards safer commodity havens like Gold.",
        "fetched_at": datetime.now().isoformat()
    },
]


@app.get("/api/news")
def get_news(sync: bool = False):
    """Return autonomous Neural-enriched financial news headlines."""
    if sync:
        print("[Neural Sync] Manual ingestion triggered via API...")
        news = fetch_and_enrich_news()
    else:
        news = get_latest_news()
        
    if not news:
        # Fallback to seed news if autonomous feed is empty/initializing
        return SEED_NEWS
    return news


@app.post("/api/veracity")
async def veracity_check(req: VeracityRequest):
    """Gemini-powered trust score analysis for a news headline."""
    if not client:
        raise HTTPException(status_code=503, detail="Gemini client not initialised (missing API key)")
    try:
        prompt = f"""You are a financial fact-checker for Indian markets.
Evaluate the credibility of this news headline and its source.

Headline: "{req.headline}"
Source: {req.source}

Consider:
- Is this a credible financial news source in India?
- Does the headline contain verifiable claims typical of regulatory bodies (SEBI, RBI, NSE)?
- Are there red flags like sensational language, anonymous claims, or unverifiable numbers?

Respond ONLY in JSON format:
{{"trust_score": <0-100>, "reasoning": "<2-3 sentence explanation>"}}"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
        import re
        text = response.text.strip()
        # Strip markdown code fences if present
        text = re.sub(r"^```json\s*|\s*```$", "", text, flags=re.MULTILINE).strip()
        result = json.loads(text)
        return {"trust_score": result.get("trust_score", 50), "reasoning": result.get("reasoning", "")}
    except Exception as e:
        print(f"Veracity Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat(req: ChatRequest):
    """RAG-powered chat: Portfolio Context + Pinecone context + Tavily web search + Groq answer."""
    try:
        # Fetch current portfolio data for context
        portfolio_context = ""
        try:
            status = await api_portfolio_status()
            if status.get("holdings"):
                portfolio_context = "Holdings:\n"
                for h in status["holdings"]:
                    portfolio_context += f"- {h['ticker']}: {h['quantity']} units at ₹{h['current_price']} (P&L: {h['pl_pct']}%)\n"
                portfolio_context += f"Total Value: ₹{status['total_value']}\n"
                portfolio_context += f"Daily Performance: {status['daily_change_pct']}%"
        except Exception as e:
            print(f"Chat Portfolio Context Error: {e}")

        run_rag = _rag()
        result = run_rag(req.message, use_web=req.use_web, portfolio_context=portfolio_context)
        return result
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/sentiment")
async def sentiment(req: SentimentRequest):
    """Classify financial text sentiment using Groq llama-3.1-8b-instant."""
    try:
        _, classify = _groq()
        result = classify(req.text)
        return result
    except Exception as e:
        print(f"Sentiment Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def _process_pdf_background(file_bytes: bytes, filename: str, doc_id: str):
    """Background task: extract → chunk → embed → store in Pinecone."""
    try:
        from pdf_processing.extractor import extract_text_from_bytes
        from services.embedding_service import embed_and_store

        text = extract_text_from_bytes(file_bytes, filename)
        count = embed_and_store(
            text,
            doc_id=doc_id,
            metadata_base={"filename": filename, "doc_id": doc_id},
        )
        print(f"[PDF] Stored {count} vectors for '{filename}' (id={doc_id})")
    except Exception as e:
        print(f"[PDF] Background processing failed for '{filename}': {e}")


@app.post("/api/summarize-pdf")
async def summarize_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Upload a PDF → extract text → generate Gemini summary → embed chunks in Pinecone (background)."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()
    doc_id = str(uuid.uuid4())

    # Generate immediate summary via Gemini
    summary = "Summary generation skipped (Gemini unavailable)."
    if client:
        try:
            from pdf_processing.extractor import extract_text_from_bytes
            text = extract_text_from_bytes(file_bytes, file.filename)
            preview = text[:4000]  # First 4000 chars for summary
            prompt = f"""Summarise this financial document for an Indian investor audience.
Highlight key metrics, risks, and investment implications.
Document excerpt:
{preview}

Provide a concise 3-paragraph Markdown summary."""
            response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
            summary = response.text
        except Exception as e:
            summary = f"Summary failed: {e}"

    # Embed and store full PDF in background
    background_tasks.add_task(_process_pdf_background, file_bytes, file.filename, doc_id)

    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "summary": summary,
        "status": "Embedding in progress...",
    }


@app.post("/api/embed")
async def embed_endpoint(req: EmbedRequest):
    """Generate a Gemini text embedding for any input text."""
    try:
        embed_text, _ = _embedding()
        vector = embed_text(req.text, req.task_type)
        return {"embedding": vector, "dimensions": len(vector)}
    except Exception as e:
        print(f"Embed Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/store-vector")
async def store_vector(req: StoreVectorRequest):
    """Manually upsert a single vector into Pinecone."""
    try:
        upsert, _ = _pinecone()
        result = upsert([{"id": req.id, "values": req.values, "metadata": req.metadata}])
        return {"status": "ok", "result": str(result)}
    except Exception as e:
        print(f"Store Vector Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/query-context")
async def query_context(req: QueryContextRequest):
    """Query Pinecone for top-k most relevant chunks for a given query string."""
    try:
        _, embed_query = _embedding()
        _, query_vec_fn = _pinecone()
        # Re-import explicitly for clarity
        from services.gemini_embedding import embed_query as eq
        from services.pinecone_service import query_vectors as qv
        query_vector = eq(req.query)
        matches = qv(query_vector, top_k=req.top_k, filter=req.filter)
        return {"matches": matches, "count": len(matches)}
    except Exception as e:
        print(f"Query Context Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class SavePortfolioRequest(BaseModel):
    holdings: list[dict] # [{ "ticker": str, "quantity": int, "purchase_price": float }]

class SimulateRequest(BaseModel):
    scenario: str
    holdings: Optional[list[dict]] = None # If None, use saved portfolio


@app.post("/api/portfolio/save")
async def api_save_portfolio(req: SavePortfolioRequest):
    """Save user holdings for the personalized dashboard."""
    try:
        from services.portfolio_service import save_portfolio
        save_portfolio(req.holdings)
        return {"status": "success", "message": f"Saved {len(req.holdings)} holdings."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/portfolio/status")
async def api_portfolio_status():
    """Fetch real-time dashboard data for the saved portfolio."""
    try:
        from services.portfolio_service import get_portfolio
        holdings = get_portfolio()
        if not holdings:
            return {"holdings": [], "total_value": 0, "daily_change": 0}
            
        tickers = [h["ticker"] for h in holdings]
        # Standardize tickers for yfinance and categorize by sector
        ns_tickers = []
        sector_map = {
            "RELIANCE": "Energy", "TCS": "IT", "HDFCBANK": "Finance", 
            "INFY": "IT", "ICICIBANK": "Finance", "ITC": "Consumer",
            "NVDA": "Technology", "AAPL": "Technology", "MSFT": "Technology",
            "TSLA": "Automotive", "GOOGL": "Technology", "AMZN": "Consumer"
        }
        
        us_tickers = ["NVDA", "AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "META", "BRK-B"]
        
        for h in holdings:
            t = h["ticker"].upper()
            core_t = t.split('.')[0]
            
            # Smart normalization with strict matching and stripping
            core_t = core_t.strip()
            if core_t in us_tickers:
                 # US Stocks - use as is (Nasdaq/NYSE)
                 ns_tickers.append(core_t)
            elif ".NS" in t or ".BO" in t:
                 # Already suffixed Indian stock (NSE/BSE)
                 ns_tickers.append(t)
            else:
                 # Default to Indian Exchange (.NS) if not a known US symbol
                 ns_tickers.append(f"{core_t}.NS")
        
        # Batch download real-time prices
        data = yf.download(ns_tickers, period="5d", interval="1d")['Close']
        if data.empty:
             return {"error": "Failed to fetch price data"}
             
        # Latest Close
        latest_prices = data.iloc[-1]
        prev_prices = data.iloc[-2] if len(data) > 1 else latest_prices
        
        processed = []
        total_value = 0
        total_prev_value = 0
        
        for i, h in enumerate(holdings):
            t = ns_tickers[i]
            curr_price = float(latest_prices[t]) if t in latest_prices else 0
            prev_price = float(prev_prices[t]) if t in prev_prices else curr_price
            
            value = curr_price * h["quantity"]
            purchase_val = h["purchase_price"] * h["quantity"]
            pl = value - purchase_val
            
            total_value += value
            total_prev_value += prev_price * h["quantity"]
            
            core_t = h["ticker"].split('.')[0].upper()
            processed.append({
                "ticker": h["ticker"],
                "quantity": h["quantity"],
                "purchase_price": h["purchase_price"],
                "current_price": round(curr_price, 2),
                "value": round(value, 2),
                "pl": round(pl, 2),
                "pl_pct": round((pl / purchase_val) * 100, 2) if purchase_val else 0,
                "daily_change_pct": round(((curr_price - prev_price) / prev_price) * 100, 2) if prev_price else 0,
                "sector": sector_map.get(core_t, "Others")
            })
            
        # Final sanitization to prevent JSON crashes (NaN/Inf)
        return sanitize_data({
            "holdings": processed,
            "total_value": round(total_value, 2),
            "daily_change_pct": round(((total_value - total_prev_value) / total_prev_value) * 100, 2) if total_prev_value else 0
        })
    except Exception as e:
        print(f"Portfolio Status Error: {e}")
        raise HTTPException(status_code=500, detail=str(sanitize_data(e)))


@app.get("/api/scenarios")
async def get_scenarios():
    """Return available crisis scenarios for simulation."""
    from services.simulation_service import SCENARIOS
    return SCENARIOS


@app.post("/api/portfolio/simulate")
async def api_simulate_portfolio(req: SimulateRequest):
    """Simulate a crisis scenario on the current or provided portfolio."""
    try:
        from services.simulation_service import simulate_crisis
        from services.portfolio_service import get_portfolio
        
        target_holdings = req.holdings
        if not target_holdings:
            # If no holdings sent, try to use real-time status as base values
            status = await api_portfolio_status()
            if "error" in status or not status.get("holdings"):
                raise HTTPException(status_code=400, detail="No portfolio saved to simulate.")
            target_holdings = [{"ticker": h["ticker"], "value": h["value"]} for h in status["holdings"]]
            
        result = simulate_crisis(target_holdings, req.scenario)
        return sanitize_data(result)
    except Exception as e:
        print(f"Simulation Error: {e}")
        raise HTTPException(status_code=500, detail=str(sanitize_data(e)))

# --- Real-Time 10-Min Neural Prediction Engine ---

TICKER_RESOLVER = {
    "tata motors": "TATAMOTORS.NS",
    "tata": "TATAMOTORS.NS",
    "tcs": "TCS.NS",
    "reliance": "RELIANCE.NS",
    "infy": "INFY.NS",
    "infosys": "INFY.NS",
    "hdfc": "HDFCBANK.NS",
    "hdfc bank": "HDFCBANK.NS",
    "sbi": "SBIN.NS",
    "icici": "ICICIBANK.NS",
    "zomato": "ZOMATO.NS",
    "adani": "ADANIENT.NS",
    "itc": "ITC.NS"
}

@app.post("/api/predict")
async def predict_stock(req: PredictRequest):
    """
    Real-time 10-minute Neural Prediction Engine.
    Combines 1m Technical Data + Latest News Sentiment via FastStream.
    """
    query_clean = req.query.lower().strip()
    ticker_sym = TICKER_RESOLVER.get(query_clean)
    
    if not ticker_sym:
        # Try to use the query itself as ticker
        ticker_sym = req.query.upper()
        if not ticker_sym.endswith(".NS") and not ticker_sym.endswith(".BO"):
            ticker_sym = f"{ticker_sym}.NS"

    try:
        # 1. Fetch data with robust fallbacks
        stock = yf.Ticker(ticker_sym)
        hist = stock.history(period="5d", interval="1m").tail(30)
        
        if hist.empty:
            hist = stock.history(period="1wk", interval="5m").tail(30)

        # 2. Extract technical signals
        if not hist.empty:
            latest_price = hist['Close'].iloc[-1]
            opening_price = hist['Open'].iloc[0]
            price_velocity = ((latest_price - opening_price) / opening_price) * 100
            momentum_summary = f"Latest Price: ₹{round(latest_price, 2)}, 30-Min Momentum: {round(price_velocity, 2)}%"
        else:
            latest_price = 0
            price_velocity = 0
            momentum_summary = "Real-time technical data restricted (Market Closed/Data restricted)."
            try:
                with DDGS() as ddgs:
                    search_results = list(ddgs.text(f"{ticker_sym.replace('.NS', '')} share price NSE", max_results=2))
                    if search_results:
                        momentum_summary += f" [Pulse Context: {search_results[0]['body'][:150]}...]"
            except:
                pass

        # 3. Fetch ultra-recent news
        news_str = ""
        try:
            with DDGS() as ddgs:
                results = list(ddgs.news(keywords=f"{ticker_sym.replace('.NS', '')} stock news india", max_results=5))
                news_str = "\n".join([f"- {r['title']}" for r in results])
        except:
            pass

        current_time = datetime.now()
        is_weekend = current_time.weekday() >= 5
        
        prompt = f"""
        Analyze the following real-time signals for {ticker_sym} and project the most likely movement for the NEXT 10 MINUTES.
        
        MARKET STATUS: {"CLOSED (Weekend/Holiday)" if is_weekend else "OPEN/ACTIVE"}
        Current Time: {current_time.strftime("%Y-%m-%d %H:%M:%S")}
        
        DATA CONTEXT:
        - {momentum_summary}
        
        LATEST NEWS & CONTEXT:
        {news_str if news_str else "No breaking news in the last hour. Focus on major sector trends."}
        
        SPECIAL INSTRUCTION:
        If market is CLOSED, pivot analysis to "Next Session Opening Strategy" and "Overall Sentiment Trend".
        
        Respond Strictly in JSON format:
        {{
            "prediction": "Bullish" | "Bearish" | "Neutral",
            "confidence": <0-100 score>,
            "target_range": "Target Window",
            "reasoning": "rationale",
            "risk_level": "Low" | "Moderate" | "High"
        }}
        """
        
        from services.groq_service import _get_client as get_faststream_client
        faststream_client = get_faststream_client()
        chat_completion = faststream_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            max_tokens=512,
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        prediction_result = json.loads(chat_completion.choices[0].message.content)
        
        return {
            "symbol": ticker_sym,
            "current_price": round(latest_price, 2) if latest_price else "Syncing...",
            "momentum": round(price_velocity, 2),
            **prediction_result
        }
    except Exception as e:
        print(f"Neural Engine Catch: {e}")
        return {
            "symbol": ticker_sym,
            "current_price": "N/A",
            "momentum": 0,
            "prediction": "Neutral",
            "confidence": 40,
            "target_range": "Data Restricted",
            "reasoning": f"Technical data for {ticker_sym} is currently on standby.",
            "risk_level": "Moderate"
        }
