import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.chat_routes import router as chat_router
from routes.pdf_routes import router as pdf_router
from routes.embed_routes import router as embed_router
from routes.sentiment_routes import router as sentiment_router

# Load env vars
load_dotenv()

app = FastAPI(title="Smart Finance AI Backend", version="1.0.0")

# Allow requests from the Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your node IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat_router, tags=["Chat & RAG"])
app.include_router(pdf_router, tags=["PDF & Document Analysis"])
app.include_router(embed_router, tags=["Embeddings"])
app.include_router(sentiment_router, tags=["Sentiment Analysis"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
