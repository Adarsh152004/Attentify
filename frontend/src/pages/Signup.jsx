import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Lock, User, Target, AlertCircle, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    riskProfile: 'moderate',
    investmentGoal: 'long_term',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pass metadata
      const { user } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        risk_profile: formData.riskProfile,
        investment_goal: formData.investmentGoal,
      });

      // Try automatic login (in case email confirmation isn't required)
      if (user) {
         try {
           await signIn(formData.email, formData.password);
           navigate('/dashboard');
         } catch {
             // If implicit signin fails, just redirect to login
             navigate('/login', { state: { message: 'Signup successful. Please log in.' } });
         }
      }
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      setLoading(false); // only disable loading if error
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 py-12">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none fixed">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-teal/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-blue/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-lg z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-accent-lg mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">SMART FINANCE</h1>
          <p className="text-xs text-white/50 tracking-widest uppercase mt-1">Create Account</p>
        </div>

        {/* Signup Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Setup Investor Profile</h2>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-white/40" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-glass pl-11"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-white/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-glass pl-11"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-white/40" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-glass pl-11"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Risk Profile</label>
                <select
                  name="riskProfile"
                  value={formData.riskProfile}
                  onChange={handleChange}
                  className="input-glass appearance-none"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Goal</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Target className="w-4 h-4 text-white/40" />
                    </div>
                    <select
                        name="investmentGoal"
                        value={formData.investmentGoal}
                        onChange={handleChange}
                        className="input-glass appearance-none pl-9"
                    >
                    <option value="long_term">Long Term Growth</option>
                    <option value="retirement">Retirement</option>
                    <option value="income">Income</option>
                    <option value="preservation">Wealth Preservation</option>
                    </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full flex items-center justify-center mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-teal font-medium hover:text-accent-cyan transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
