from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks
from pydantic import BaseModel

from pdf_processing.extractor import extract_text_from_pdf
from pdf_processing.chunker import chunk_text
from services.embedding_service import process_and_embed_chunks
from services.pinecone_service import upsert_vectors
from services.gemini_service import generate_text

router = APIRouter()

# Setup Supabase client just for status updates
import os
from supabase import create_client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

def background_process_pdf(file_bytes: bytes, document_id: str):
    try:
        # 1. Extract Text
        raw_text = extract_text_from_pdf(file_bytes)
        
        if not raw_text:
            raise Exception("No text extracted from PDF")

        # 2. Generate a quick Executive Summary with Gemini
        summary_prompt = f"Provide a brief, 3-4 sentence professional executive summary of the following financial document text. Highlight key numbers/metrics if present:\n\n{raw_text[:8000]}"
        summary = generate_text(summary_prompt)

        # 3. Chunk Text
        chunks = chunk_text(raw_text, chunk_size=800, overlap=100)
        
        # 4. Generate Embeddings & Upsert to Pinecone (slowest part)
        vectors = process_and_embed_chunks(chunks, document_id)
        if vectors:
            upsert_vectors(vectors)

        # 5. Update Supabase record as completed
        if supabase:
            supabase.table("research_documents").update({
                "embedding_status": "completed",
                "summary": summary
            }).eq("id", document_id).execute()
            
    except Exception as e:
        print(f"Error processing document {document_id}: {e}")
        if supabase:
             supabase.table("research_documents").update({
                "embedding_status": "failed"
            }).eq("id", document_id).execute()

@router.post("/summarize-pdf")
async def handle_pdf_upload(background_tasks: BackgroundTasks, file: UploadFile = File(...), document_id: str = Form(...)):
    """Receives a PDF, queues it for processing, and returns immediately to unblock Node.js"""
    
    file_bytes = await file.read()
    
    # Add to background tasks so API returns 200 OK immediately
    background_tasks.add_task(background_process_pdf, file_bytes, document_id)
    
    return {"status": "Processing queued successfully in AI Backend"}
