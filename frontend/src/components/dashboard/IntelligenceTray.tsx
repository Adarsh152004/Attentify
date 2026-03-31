"use client";

import { useState } from "react";
import { Zap, Search, Loader2, Target, TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown, Sparkles, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";

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

export function IntelligenceTray() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const handlePredict = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null); 
    try {
      const res = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setResult(data);
      setIsMinimized(false); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionIcon = (p: string) => {
    if (p === "Bullish") return <TrendingUp size={16} />;
    if (p === "Bearish") return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getRiskColor = (r: string) => {
    if (r === "Low") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (r === "Moderate") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-64 right-0 z-[100] transition-all duration-500",
      isMinimized ? 'translate-y-[calc(100%-48px)]' : 'translate-y-0'
    )}>
      <div className="mx-auto max-w-6xl">
        <div className="bg-slate-900 border-x border-t border-slate-800 rounded-t-2xl shadow-[0_-20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Header */}
          <div className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50">
            <div className="flex items-center gap-3">
              <Cpu size={14} className="text-sky-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Price Prediction Core</span>
              {loading && (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-800">
                  <Loader2 size={12} className="text-sky-400 animate-spin" />
                  <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest animate-pulse">Analyzing Trajectory</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-500"
            >
              {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          <div className="p-8">
            <div className={cn(
              "flex flex-col lg:flex-row gap-8",
              result ? 'lg:items-start' : 'lg:items-center justify-center min-h-[180px]'
            )}>
              
              {/* Input Section */}
              <div className={cn(
                "w-full transition-all duration-500 space-y-4",
                result ? 'lg:w-[320px]' : 'lg:w-[500px] text-center'
              )}>
                {!result && !loading && (
                  <div className="mb-6 animate-in fade-in duration-700">
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-2">10-Min Vision Forecast</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Institutional AI Modeling Engine</p>
                  </div>
                )}
                
                <div className="relative group">
                  <div className="flex gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 focus-within:border-sky-500/50 transition-all">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700" />
                      <Input
                        placeholder="ENTER SYMBOL..."
                        className="bg-transparent border-none pl-10 text-xs font-bold h-10 focus-visible:ring-0 placeholder:text-slate-800 uppercase tracking-widest text-white"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                      />
                    </div>
                    <button 
                      className="bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold px-6 h-10 rounded-lg shadow-lg shadow-sky-500/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                      onClick={handlePredict}
                      disabled={loading}
                    >
                      Predict
                    </button>
                  </div>
                </div>
                
                {!result && !loading && (
                  <div className="flex justify-center gap-3 mt-4">
                    {['TATA', 'RELIANCE', 'ZOMATO'].map(t => (
                      <button 
                        key={t}
                        onClick={() => { setQuery(t); }}
                        className="text-[9px] font-bold text-slate-600 hover:text-sky-400 transition-colors uppercase tracking-widest border border-slate-800 px-3 py-1.5 rounded-md bg-slate-950/50"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Result Panel */}
              {result && !loading && (
                <div className="flex-1 w-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Signal */}
                    <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Sentiment</span>
                         <div className={cn(
                            "px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1.5",
                            result.prediction === 'Bullish' ? 'text-emerald-500 bg-emerald-500/10' : 
                            result.prediction === 'Bearish' ? 'text-rose-500 bg-rose-500/10' : 
                            'text-amber-500 bg-amber-500/10'
                          )}>
                            {getPredictionIcon(result.prediction)}
                            {result.prediction}
                          </div>
                       </div>
                       <div>
                          <h3 className="text-3xl font-bold text-white tracking-tighter uppercase">{result.symbol.replace('.NS', '')}</h3>
                          <p className="text-lg font-bold text-sky-400 tabular-nums tracking-tight mt-1">₹{result.current_price}</p>
                       </div>
                    </div>

                    {/* Stats */}
                    <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Confidence</p>
                            <p className="text-xl font-bold text-white tabular-nums">{result.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Risk</p>
                            <span className={cn(
                              "px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded border",
                              getRiskColor(result.risk_level)
                            )}>
                              {result.risk_level}
                            </span>
                          </div>
                       </div>
                       <div className="mt-4 pt-4 border-t border-slate-800">
                          <p className="text-[9px] font-bold text-sky-500/50 uppercase tracking-widest mb-1">Target Window</p>
                          <p className="text-lg font-bold text-white tracking-tight uppercase tabular-nums">{result.target_range}</p>
                       </div>
                    </div>

                    {/* Rationale */}
                    <div className="p-6 rounded-xl bg-sky-500/5 border border-sky-500/10 flex flex-col">
                       <h4 className="text-[9px] font-bold text-sky-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={10} className="fill-sky-400" />
                         AI Rationale
                       </h4>
                       <p className="text-[11px] font-medium text-slate-400 leading-relaxed line-clamp-4 italic">
                         "{result.reasoning}"
                       </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && result === null && (
                <div className="flex-1 w-full h-[180px] flex flex-col items-center justify-center gap-4 border border-dashed border-slate-800 rounded-xl animate-pulse">
                    <Loader2 size={32} className="text-sky-500 animate-spin" />
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.4em]">Synthesizing Probability Nodes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
