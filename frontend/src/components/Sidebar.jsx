import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PieChart,
  MessageSquareText,
  FileText,
  Newspaper,
  LogOut,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/portfolio', icon: PieChart, label: 'Portfolio' },
  { to: '/chat', icon: MessageSquareText, label: 'AI Assistant' },
  { to: '/research', icon: FileText, label: 'Research' },
];

export default function Sidebar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-navy-800/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-accent">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">SMART FINANCE</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">Solutions</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-white/30 px-4 mb-3">Navigation</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* AI Badge */}
      <div className="px-4 pb-4">
        <div className="glass-card-static p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent-teal" />
            <span className="text-xs font-semibold text-accent-teal">AI POWERED</span>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed">
            Powered by Gemini AI with RAG pipeline for intelligent financial insights.
          </p>
        </div>
      </div>

      {/* User / Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.email || 'User'}
              </p>
              <p className="text-[10px] text-white/30">Investor</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
