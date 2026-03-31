# SMART FINANCE SOLUTIONS

An AI-powered financial intelligence platform with a React frontend, Node.js backend, and Python FastAPI AI service. Features portfolio generation, RAG-based chat, and PDF research summarization.

## Architecture

* **Frontend (`/frontend`)**: React 18, Vite, Tailwind CSS, Recharts. Premium fintech dark theme.
* **Backend (`/backend`)**: Node.js, Express, Supabase SDK (Server-Side), News Ingestion (Alpha Vantage).
* **AI Backend (`/ai-backend`)**: Python, FastAPI, Google Gemini API, Pinecone, PyPDF2.
* **Database**: Supabase (PostgreSQL + Auth).

---

## 🚀 Setup Instructions

### 1. Prerequisites
1. Node.js (v18+)
2. Python (3.10+)
3. Supabase Project (Database & Auth setup via the Migration SQL provided in the agent planning)
4. Pinecone Account (Create a 768-dimension index named `finance-rag-index` with `cosine` metric)
5. Google Gemini API Key
6. Alpha Vantage API Key  (Free level)

### 2. Configure Environment Variables

Navigate to each folder and rename `.env.example` to `.env`, then fill in your keys:

#### `/frontend/.env`
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:4000/api
```

#### `/backend/.env`
```env
PORT=4000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
AI_SERVER_URL=http://localhost:8000
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

#### `/ai-backend/.env`
```env
GEMINI_API_KEY=your_google_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_env
PINECONE_INDEX_NAME=finance-rag-index
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 3. Install Dependencies & Run

You need to run all three services concurrently.

#### Tab 1: AI Backend (Python)
```bash
cd ai-backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Tab 2: Node Backend
```bash
cd backend
npm install
npm run dev
```

#### Tab 3: React Frontend
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Deployment Strategy

* **Frontend**: Deploy to Vercel or Netlify. Connect standard build commands `npm run build`.
* **Backend**: Deploy to Render or Railway as a standard Node.js Web Service.
* **AI Backend**: Deploy to Railway or standard cloud VM. Ensure `uvicorn main:app --host 0.0.0.0` is the start command.
