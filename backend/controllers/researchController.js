import { supabaseAdmin } from '../config/supabase.js';
import { aiClient } from '../services/aiClient.js';
import FormData from 'form-data';

export const uploadDocument = async (req, res, next) => {
  try {
    const file = req.file;
    const { title } = req.body;
    const userId = req.user.id;

    if (!file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // 1. Insert record into Supabase to track status
    const { data: docRecord, error: insertError } = await supabaseAdmin
      .from('research_documents')
      .insert({
        title: title || file.originalname,
        uploaded_by: userId,
        embedding_status: 'processing'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Send the response back immediately so the UI doesn't block
    res.status(202).json({ 
        message: 'File processing started', 
        document: docRecord 
    });

    // 2. Perform background processing (send to AI backend)
    try {
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
        formData.append('document_id', docRecord.id);

        await aiClient.post('/summarize-pdf', formData, {
            headers: { ...formData.getHeaders() }
        });
        
    } catch(err) {
        console.error("AI summarization pipeline failed for doc", docRecord.id, err?.response?.data || err.message);
        await supabaseAdmin.from('research_documents').update({ embedding_status: 'failed' }).eq('id', docRecord.id);
    }

  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('research_documents')
      .select('*')
      .eq('uploaded_by', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ documents: data });
  } catch (error) {
    next(error);
  }
};

export const getDocumentSummary = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabaseAdmin
          .from('research_documents')
          .select('summary, embedding_status')
          .eq('id', id)
          .eq('uploaded_by', req.user.id)
          .single();
          
        if(error) throw error;
        res.json({ document: data });
    } catch (err) {
        next(err);
    }
}

export const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = await supabaseAdmin
          .from('research_documents')
          .delete()
          .eq('id', id)
          .eq('uploaded_by', req.user.id);
          
        if(error) throw error;
        
        // Potential cleanup in python vector DB needed here, or via webhook/queue. 
        // We'll ignore it for this scope since pinecone namespace deletion handles user scopes if implemented.
        res.json({ message: 'Document removed' });
    } catch(err) {
        next(err);
    }
}
