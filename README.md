# Attentify: AI Financial Intelligence Hub

Attentify is a high-performance financial intelligence platform that combines real-time market data, AI-driven predictive modeling, and conversational research into a unified interface.

## 🏗️ Technical Architecture

* **Frontend (`/frontend`)**: Next.js 14, React 18, Tailwind CSS, Framer Motion, and Recharts. Designed with a premium, industrial-grade Fintech aesthetic.
* **Backend (`/backend`)**: Python FastAPI server handling RAG (Retrieval-Augmented Generation), portfolio optimization, and AI predictive analysis.
* **Intelligence Layer**: Google Gemini Pro for reasoning, Pinecone for vector search, and custom financial algorithms for volatility modeling.
* **Database**: Supabase (PostgreSQL) for secure trade history and user settings.

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
* **Node.js** (v18+)
* **Python** (3.10+)
* **Supabase Project** (Database for portfolio and user data)
* **Pinecone Account** (Index: 768-dimension, Cosine metric)

### 2. Configure Environment Variables

Create `.env` files in both the `/backend` and `/frontend` directories using the reference in the root `.env`:

#### `/backend/.env`
```env
GEMINI_API_KEY=your_gemini_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_region
PINECONE_INDEX_NAME=your_index
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
ALPHA_VANTAGE_API_KEY=your_av_key
```

#### `/frontend/.env`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Execution

You need to run both services concurrently:

#### Tab 1: AI Backend (Python)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Tab 2: Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`

---

## 🌐 Deploy to Render

Attentify is pre-configured for one-click deployment on [Render](https://render.com) using the provided `render.yaml` blueprint.

### Option A: Automatic Blueprint Deployment
1. Connect your GitHub repository to Render.
2. Go to **Blueprints** and click **New Blueprint Instance**.
3. Render will automatically detect `render.yaml` and prompt you for the required environment variables.
4. Deploy!

### Option B: Manual Setup
If you prefer setting up services individually:

#### 1. Backend (Web Service)
* **Runtime**: Python
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
* **Root Directory**: `backend`

#### 2. Frontend (Web Service)
* **Runtime**: Node / Next.js
* **Build Command**: `npm install && npm run build`
* **Start Command**: `npm run start`
* **Root Directory**: `frontend`
* **Env Var**: `NEXT_PUBLIC_API_URL` set to your backend's Render URL.

---

## 🛠️ Performance & Security
* **RAG Pipeline**: Optimized for low-latency retrieval from financial PDFs and live web search.
* **Security**: All database interactions are protected via Supabase RLS (Row Level Security) and Service Role keys on the backend.
* **Scaling**: Ready for vertical scaling on Render for high-concurrency AI inference.
