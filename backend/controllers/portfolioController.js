import { generateAllocation } from '../services/portfolioEngine.js';
import { supabaseAdmin } from '../config/supabase.js';

export const generatePortfolio = async (req, res, next) => {
  try {
    const { investment_amount, risk_level, investment_duration } = req.body;
    const userId = req.user.id; // From requireAuth middleware

    if (!investment_amount || !risk_level || !investment_duration) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 1. Generate Allocation via AI/Algorithmic Engine
    const { allocation, risk_score } = await generateAllocation({
        amount: investment_amount, 
        risk: risk_level, 
        duration: investment_duration
    });

    // 2. Save to Supabase
    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .insert({
        user_id: userId,
        allocation_json: { allocations: allocation }, // ensure proper JSON structure
        risk_score: risk_score,
        investment_amount: investment_amount,
        investment_duration: investment_duration
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ portfolio: data });
  } catch (error) {
    next(error);
  }
};

export const getUserPortfolios = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ portfolios: data });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioById = async (req, res, next) => {
  try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();
        
      if(error) throw error;
      res.json({ portfolio: data });
  } catch (err) {
      next(err);
  }
};

export const deletePortfolio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = await supabaseAdmin
          .from('portfolios')
          .delete()
          .eq('id', id)
          .eq('user_id', req.user.id);
          
        if(error) throw error;
        res.json({ message: 'Portfolio deleted successfully' });
    } catch(err) {
        next(err);
    }
}
