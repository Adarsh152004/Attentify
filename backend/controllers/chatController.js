import { aiClient } from '../services/aiClient.js';
import { supabaseAdmin } from '../config/supabase.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Call AI backend for RAG response
    const aiResponse = await aiClient.post('/chat', {
        question,
        user_id: userId // For namespacing or personalized context later
    });
    
    // The AI response should ideally have the { answer, context_used } payload
    const answer = aiResponse.data?.response || "I could not generate a response. Please try again.";

    // Save to chat history immediately
    const { error } = await supabaseAdmin
      .from('chat_history')
      .insert({
        user_id: userId,
        question: question,
        response: answer
      });

    if (error) console.error("Failed to log chat to DB:", error); // Don't interrupt flow if db logging fails

    // Return the response directly
    res.json({ response: answer });

  } catch (error) {
    console.error("Chat Controller Error:", error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to communicate with AI Assistant.' });
  }
};

export const getChatHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { data, error } = await supabaseAdmin
          .from('chat_history')
          .select('question, response, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: true }) // chronological
          
        if(error) throw error;
        
        res.json({ history: data });
    } catch (err) {
        next(err);
    }
}
