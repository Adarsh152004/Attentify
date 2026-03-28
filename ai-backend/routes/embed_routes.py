from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import generate_embedding
from services.pinecone_service import upsert_vectors, query_vectors

router = APIRouter()

class EmbedRequest(BaseModel):
    text: str

class StoreVectorRequest(BaseModel):
    id: str
    text: str
    metadata: dict = {}

class QueryContextRequest(BaseModel):
    text: str
    top_k: int = 5

@router.post("/embed")
async def generate_embed_only(req: EmbedRequest):
    vector = generate_embedding(req.text)
    return {"embedding": vector}

@router.post("/store-vector")
async def store_vector(req: StoreVectorRequest):
    vector = generate_embedding(req.text)
    req.metadata['text'] = req.text
    
    vectors_to_upsert = [{
        "id": req.id,
        "values": vector,
        "metadata": req.metadata
    }]
    
    upsert_vectors(vectors_to_upsert)
    return {"status": "success"}

@router.post("/query-context")
async def query_context(req: QueryContextRequest):
    query_vector = generate_embedding(req.text)
    matches = query_vectors(query_vector, top_k=req.top_k)
    return {"matches": matches}
