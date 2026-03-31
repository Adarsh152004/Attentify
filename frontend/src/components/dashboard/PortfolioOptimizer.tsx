"use client";

import { useState, useEffect, useCallback } from "react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, X, Target, Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Allocation {
  name: string;
  value: number;
}

interface PerformanceStats {
  return: number;
  volatility: number;
  sharpe: number;
}

const COLORS = [
  '#0ea5e9', // sky-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // rose-500
  '#6366f1', // indigo-500
  '#ec42f3', // fuchsia-500
  '#06b6d4', // cyan-500
];

export function PortfolioOptimizer() {
  const [tickers, setTickers] = useState<string[]>(["RELIANCE", "TCS", "HDFCBANK", "INFY", "ITC"]);
  const [newTicker, setNewTicker] = useState("");
  const [risk, setRisk] = useState("High");
  const [period, setPeriod] = useState("1y");
  const [allocation, setAllocation] = useState<Allocation[]>([]);
  const [performance, setPerformance] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const fetchOptimization = useCallback(async () => {
    if (tickers.length === 0) return;
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("http://localhost:8000/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickers: tickers,
          risk_appetite: risk,
          period: period,
        }),
      });
      if (!res.ok) {
        throw new Error("Mathematical optimization failed. Invalid ticker or poor data.");
      }
      const data = await res.json();
      setAllocation(data.allocation);
      setPerformance(data.performance);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [tickers, risk, period]);

  useEffect(() => {
    setIsMounted(true);
    fetchOptimization();
  }, [fetchOptimization]);

  const addTicker = () => {
    if (tickers.length >= 10) {
      setError("Maximum 10 tickers allowed.");
      return;
    }
    if (newTicker && !tickers.includes(newTicker.toUpperCase())) {
      setTickers([...tickers, newTicker.toUpperCase()]);
      setNewTicker("");
      setError("");
    }
  };

  const removeTicker = (t: string) => {
    setTickers(tickers.filter(item => item !== t));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-sm font-bold flex items-center text-white tracking-tight">
          <Target className="w-4 h-4 mr-3 text-sky-400" />
          Portfolio Optimization Matrix
        </CardTitle>
        <CardDescription className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">
          Modern Portfolio Theory • Efficient Frontier Analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 block">Market Universe</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {tickers.map(t => (
                <div key={t} className="bg-slate-900 text-white text-[10px] font-bold uppercase py-1.5 px-3 rounded-lg flex items-center border border-slate-800 hover:border-sky-500/30 transition-all group">
                  {t}
                  <X className="w-3 h-3 ml-2 cursor-pointer text-slate-500 hover:text-rose-500 transition-colors" onClick={() => removeTicker(t)} />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                placeholder="ADD TICKER (E.G. TCS)..."
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTicker()}
                className="bg-slate-900 border border-slate-800 h-10 px-4 text-xs font-bold uppercase tracking-widest rounded-lg focus:outline-none focus:border-sky-500/50 transition-all flex-1 text-white placeholder:text-slate-700"
              />
              <Button size="icon" onClick={addTicker} className="h-10 w-10 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg">
                <Plus size={18}/>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Risk Optimization</label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setRisk('Low')}
                  className={cn(
                    "flex-1 h-12 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2",
                    risk === 'Low' 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900"
                  )}
                >
                  <Activity size={14} />
                  Min Volatility
                </button>
                <button
                  onClick={() => setRisk('High')}
                  className={cn(
                    "flex-1 h-12 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2",
                    risk === 'High' 
                      ? "bg-sky-500/10 border-sky-500/30 text-sky-400" 
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900"
                  )}
                >
                  <TrendingUp size={14} />
                  Max Sharpe
                </button>
              </div>
              <div className="flex gap-2">
                {['1y', '3y', '5y'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase tracking-widest",
                      period === p 
                        ? "bg-slate-800 border-slate-700 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-600 hover:bg-slate-900"
                    )}
                  >
                    {p} Lookback
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-in shake">
               <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <X size={12} />
                  {error}
               </p>
            </div>
          )}

          <div className="h-[240px] w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 relative group overflow-hidden">
            {loading && (
               <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                 <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3"></div>
                 <span className="text-[10px] font-bold animate-pulse tracking-[0.2em] text-sky-400">Computing...</span>
               </div>
            )}
            {isMounted && !loading && allocation.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                    formatter={(value: number | string | undefined) => [`${value}%`, 'Weight']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {!loading && allocation.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weighting</p>
                    <p className="text-xl font-bold text-white tracking-widest">100%</p>
                 </div>
              </div>
            )}
          </div>

          {isMounted && !loading && performance && (
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Expected Return</span>
                <span className="text-emerald-500 font-bold text-lg tabular-nums">{performance.return}%</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Volatility</span>
                <span className="text-rose-500 font-bold text-lg tabular-nums">{performance.volatility}%</span>
              </div>
              <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400 block mb-1">Sharpe Ratio</span>
                <span className="text-sky-400 font-bold text-lg tabular-nums">{performance.sharpe}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}
