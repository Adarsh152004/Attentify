"use client";

import { useState, useEffect } from "react";
import { X, Search, Loader2, Target, TrendingUp, Zap, BarChart3, ChevronRight, Activity, ShieldHalf, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PredictionResult {
  symbol: string;
  current_price: number | string;
  momentum: number;
  prediction: "Bullish" | "Bearish" | "Neutral";
  confidence: number;
  target_range: string;
  reasoning: string;
  risk_level: "Low" | "Moderate" | "High";
}

export function StrategicDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null); 
    try {
      const res = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionStyles = (p: string) => {
    if (p === "Bullish") return "text-emerald-500 bg-emerald-500/10";
    if (p === "Bearish") return "text-rose-500 bg-rose-500/10";
    return "text-amber-500 bg-amber-500/10";
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-xl shadow-sky-500/20 flex items-center justify-center transition-all active:scale-95 z-[100] border border-sky-400/50"
      >
        <Activity size={24} />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div 
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-slate-900 border-l border-slate-800 z-[200] transition-transform duration-500 ease-out overflow-hidden shadow-2xl",
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center bg-sky-500/10 rounded-lg border border-sky-500/20">
                <Cpu size={20} className="text-sky-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Intelligence Hub</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Advanced Market Terminal</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Input */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Identify Target Asset</span>
               </div>
               <div className="relative flex items-center gap-2">
                 <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700" />
                    <Input 
                      placeholder="SYMBOL (E.G. TATA)..."
                      className="bg-slate-900 border-slate-800 pl-10 h-12 rounded-lg text-xs font-bold tracking-widest uppercase focus:border-sky-500/50 text-white"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                    />
                 </div>
                 <button 
                    onClick={handlePredict}
                    disabled={loading}
                    className="h-12 w-12 rounded-lg bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                 >
                   {loading ? <Loader2 size={20} className="animate-spin" /> : <ChevronRight size={20} />}
                 </button>
               </div>
            </div>

            {/* Results */}
            {loading ? (
               <div className="py-24 flex flex-col items-center justify-center gap-4">
                  <Loader2 size={40} className="text-sky-500 animate-spin" />
                  <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.4em] animate-pulse">Syncing Intelligence Nodes</p>
               </div>
            ) : result ? (
               <div className="space-y-6 animate-in fade-in duration-500">
                  {/* Result Card */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{result.symbol.replace('.NS', '')}</span>
                        </div>
                        <div className={cn(
                          "px-3 py-1 font-bold uppercase tracking-widest text-[9px] rounded-md",
                          getPredictionStyles(result.prediction)
                        )}>
                           {result.prediction}
                        </div>
                     </div>

                     <div className="flex items-end justify-between border-b border-slate-800 pb-6">
                        <div>
                           <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Current State</p>
                           <h3 className="text-4xl font-bold text-white tracking-tighter tabular-nums">₹{result.current_price}</h3>
                        </div>
                        <div className={cn(
                          "text-right",
                          (result.momentum as number) >= 0 ? 'text-emerald-500' : 'text-rose-500'
                        )}>
                           <p className="text-xl font-bold tabular-nums">{(result.momentum as number) >= 0 ? '+' : ''}{result.momentum}%</p>
                           <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Momentum</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
                           <ShieldHalf size={14} className="text-slate-600" />
                           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Risk</p>
                           <p className={cn(
                             "text-xs font-bold uppercase tracking-widest",
                             result.risk_level === 'High' ? 'text-rose-500' : 'text-slate-400'
                           )}>{result.risk_level}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
                           <TrendingUp size={14} className="text-slate-600" />
                           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Confidence</p>
                           <p className="text-xs font-bold text-white tabular-nums">{result.confidence}%</p>
                        </div>
                     </div>
                  </div>

                  {/* Target Card */}
                  <div className="p-6 rounded-2xl bg-sky-500 text-white shadow-xl shadow-sky-900/10 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                     <Target size={16} className="text-white/40" />
                     <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">10m Target Projection</p>
                     <p className="text-3xl font-bold tracking-tight uppercase tabular-nums">{result.target_range}</p>
                     <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white/10 blur-2xl rounded-full" />
                  </div>

                  {/* Rationale */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
                     <div className="flex items-center gap-2">
                        <Zap size={14} className="text-sky-400" />
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">AI Reasoning</span>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-sky-500/20 pl-4 py-1">
                        &quot;{result.reasoning}&quot;
                     </p>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center py-24 gap-6 opacity-30 text-center">
                  <BarChart3 size={48} className="text-slate-700" />
                  <div className="space-y-2">
                    <p className="text-sm font-bold uppercase tracking-widest text-white">System Standby</p>
                    <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider max-w-[280px]">
                      Awaiting target symbol for trajectory analysis
                    </p>
                  </div>
               </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
             <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                V2.1 Core Stabilized
             </div>
             <span className="text-[9px] font-bold text-slate-800 uppercase tracking-widest">Secure Node</span>
          </div>
        </div>
      </div>
    </>
  );
}
