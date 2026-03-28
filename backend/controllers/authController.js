import { supabaseAdmin } from '../config/supabase.js';

export const signup = async (req, res, next) => {
  // Logic is primarily handled by Supabase SDK directly on the frontend for now,
  // but if you wanted server-side controlled signups, code goes here.
  res.status(501).json({ message: 'Signup is typically performed directly via frontend SDK in this architecture, but API endpoint exists.' });
};

export const login = async (req, res, next) => {
    // Likewise
  res.status(501).json({ message: 'Login is typically performed directly via frontend SDK in this architecture, but API endpoint exists.' });
};

export const logout = async (req, res, next) => {
  try {
     const { error } = await supabaseAdmin.auth.admin.signOut(req.user.id);
     if(error) throw error;
     res.json({ message: 'Logged out from backend.'});
  } catch(err) {
      next(err);
  }
};
