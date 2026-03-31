"use client";

import { useState } from "react";
import { Zap, Loader2, TrendingUp, TrendingDown, Minus, Terminal, Activity, Cpu } from "lucide-react";
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

export function IndustrialCommandBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (p: string) => {
    if (p === "Bullish") return "text-emerald-500";
    if (p === "Bearish") return "text-rose-500";
    return "text-amber-500";
  };

  const getRiskStatus = (r: string) => {
    if (r === "Low") return "bg-emerald-500";
    if (r === "Moderate") return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="fixed bottom-6 left-[calc(16rem+1.5rem)] right-6 z-[100] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Loading Progress */}
      <div className="h-[2px] bg-slate-800">
        {loading && <div className="h-full bg-sky-500 animate-[loading-bar_1.5s_infinite] shadow-[0_0_8px_rgba(14,165,233,0.5)]" />}
      </div>

      <div className="flex h-16 items-stretch">
        
        {/* Command Input */}
        <div className="flex items-center gap-4 px-6 border-r border-slate-800 bg-slate-950/50 group w-[380px] shrink-0">
          <Terminal size={14} className="text-sky-500/50 shrink-0" />
          <Input
            placeholder="TYPE STOCK SYMBOL..."
            className="bg-transparent border-none p-0 text-[10px] font-bold h-10 focus-visible:ring-0 placeholder:text-slate-700 uppercase tracking-widest text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePredict()}
          />
          <button 
            type="button"
            className="text-[9px] font-bold px-4 h-8 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-all border border-sky-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Cpu size={12} />}
            ANALYZE
          </button>
        </div>

        {/* Status / Results */}
        {!result && !loading && (
          <div className="flex-1 flex items-center px-6 gap-8 overflow-hidden">
             <div className="flex items-center gap-3 text-slate-600">
                <Activity size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Core Interface Standby • Port 8000 Linked</span>
             </div>
             <div className="hidden xl:flex items-center gap-4 border-l border-slate-800 ml-4 pl-8">
                {['TATA', 'RELIANCE', 'ZOMATO', 'ADANI'].map(t => (
                  <button key={t} onClick={() => setQuery(t)} className="text-[9px] font-bold text-slate-600 hover:text-sky-400 transition-colors uppercase tracking-widest">[{t}]</button>
                ))}
             </div>
          </div>
        )}

        {loading && (
           <div className="flex-1 flex items-center px-6 gap-4 bg-slate-950/20">
              <Loader2 size={14} className="text-sky-500 animate-spin" />
              <span className="text-[10px] text-sky-500/70 font-bold uppercase tracking-widest animate-pulse">Filtering Market Noise • Synthesizing AI Signal</span>
           </div>
        )}

        {result && !loading && (
          <div className="flex-1 flex items-stretch divide-x divide-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-500 items-center">
            
            {/* Symbol */}
            <div className="px-6 flex flex-col justify-center min-w-[140px]">
               <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-0.5">Ticker</span>
               <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-tight">{result.symbol.replace('.NS', '')}</span>
                  <span className="text-[10px] font-bold text-sky-500 tabular-nums">₹{result.current_price}</span>
               </div>
            </div>

            {/* Signal */}
            <div className="px-6 flex flex-col justify-center min-w-[140px]">
               <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-0.5">Signal</span>
               <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${getPredictionColor(result.prediction)}`}>
                  {result.prediction === 'Bullish' ? <TrendingUp size={12} /> : 
                   result.prediction === 'Bearish' ? <TrendingDown size={12} /> : 
                   <Minus size={12} />}
                  {result.prediction}
                  <span className="text-[9px] text-slate-700 font-bold ml-1">{result.confidence}%</span>
               </div>
            </div>

            {/* Target */}
            <div className="px-6 flex flex-col justify-center min-w-[160px]">
               <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-0.5">Target Range</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{result.target_range}</span>
            </div>

            {/* Rationale */}
            <div className="flex-1 px-6 flex flex-col justify-center min-w-[300px] bg-slate-950/20">
               <span className="text-[8px] text-sky-500/60 font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                 <Zap size={10} className="fill-sky-500" />
                 AI Rationale
               </span>
               <p className="text-[9px] font-medium text-slate-500 truncate tracking-tight lowercase">
                 &gt; {result.reasoning}
               </p>
            </div>

            {/* Risk */}
            <div className="px-6 flex items-center gap-4 bg-slate-950/40">
                <div className="text-right">
                   <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">Risk</p>
                   <p className={cn(
                     "text-[9px] font-bold uppercase tracking-widest",
                     result.risk_level === 'High' ? 'text-rose-500' : 'text-slate-500'
                   )}>{result.risk_level}</p>
                </div>
                <div className="h-8 w-[2px] rounded-full overflow-hidden bg-slate-800">
                  <div className={cn("h-full w-full", getRiskStatus(result.risk_level))} />
                </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
