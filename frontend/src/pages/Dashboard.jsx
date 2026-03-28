import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import RiskGauge from '../components/RiskGauge';
import PortfolioPieChart from '../components/PortfolioPieChart';
import SentimentBarChart from '../components/SentimentBarChart';
import NewsFeed from '../components/NewsFeed';
import { DollarSign, Percent, TrendingUp, Activity } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Mock data for the dashboard stats
  const stats = [
    { label: 'Total Portfolio Value', value: 124500, type: 'currency', change: 4.2, icon: DollarSign },
    { label: 'YTD Return', value: 0.125, type: 'percent', change: 2.1, icon: Percent },
    { label: 'Market Correlation', value: 0.82, type: 'number', change: -0.05, icon: Activity },
    { label: 'Alpha Score', value: 1.4, type: 'number', change: 0.2, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {greeting}, {user?.email?.split('@')[0] || 'Investor'}
          </h1>
          <p className="text-white/50">Here is your financial intelligence overview for today.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Markets Open
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          return (
            <div key={i} className={`stat-card animation-delay-${(i + 1) * 100}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent-teal" />
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isPositive ? '+' : ''}{stat.change}%
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stat.type === 'currency' && formatCurrency(stat.value)}
                {stat.type === 'percent' && formatPercent(stat.value)}
                {stat.type === 'number' && stat.value}
              </p>
              <p className="text-sm text-white/50 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <RiskGauge score={68} />
             <PortfolioPieChart />
          </div>
          <SentimentBarChart />
        </div>
        <div className="lg:col-span-1">
            <NewsFeed />
        </div>
      </div>
    </div>
  );
}
