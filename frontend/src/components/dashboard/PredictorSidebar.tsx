"use client";

import { useState } from "react";
import { Search, Loader2, TrendingUp, TrendingDown, Minus, Cpu, Activity } from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PredictionResult {
  symbol: string;
  current_price: number;
  momentum: number;
  prediction: "Bullish" | "Bearish" | "Neutral";
  confidence: number;
  target_range: string;
  reasoning: string;
  risk_level: "Low" | "Moderate" | "High";
}

export function PredictorSidebar() {
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

  const getPredictionIcon = (p: string) => {
    if (p === "Bullish") return <TrendingUp size={14} />;
    if (p === "Bearish") return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getRiskColor = (r: string) => {
    if (r === "Low") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (r === "Moderate") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-white uppercase tracking-tight">
            <Cpu size={16} className="text-sky-400" />
            AI Momentum Forecast
          </CardTitle>
          <CardDescription className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Real-time Nifty/NSE Projections
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700" />
              <Input
                placeholder="ENTER SYMBOL..."
                className="bg-slate-950 border-slate-800 pl-9 text-[10px] font-bold h-10 focus:border-sky-500/50 transition-all uppercase tracking-widest text-white rounded-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePredict()}
              />
            </div>
            <button 
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-[10px] px-4 h-10 rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Run"}
            </button>
          </div>

          {!result && !loading && (
            <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/50 opacity-60">
              <Activity size={24} className="text-slate-700 mx-auto mb-3" />
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest px-4 leading-relaxed">
                Awaiting Input Node
              </p>
            </div>
          )}

          {loading && (
            <div className="py-10 flex flex-col items-center gap-3">
              <Loader2 size={24} className="text-sky-500 animate-spin" />
              <p className="text-[9px] font-bold text-sky-500/60 uppercase tracking-widest animate-pulse">
                Synthesizing Data
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="animate-in fade-in duration-500 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tighter uppercase">{result.symbol.replace('.NS', '')}</h3>
                    <p className="text-sm font-bold text-sky-400 tracking-tight mt-1 tabular-nums">₹{result.current_price}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest rounded-md",
                    result.prediction === 'Bullish' ? 'text-emerald-500 bg-emerald-500/10' : 
                    result.prediction === 'Bearish' ? 'text-rose-500 bg-rose-500/10' : 
                    'text-amber-500 bg-amber-500/10'
                  )}>
                    {getPredictionIcon(result.prediction)}
                    {result.prediction}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Probability</p>
                    <p className="text-xs font-bold text-white uppercase">{result.confidence}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Exposure</p>
                    <span className={cn(
                      "px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded border inline-block",
                      getRiskColor(result.risk_level)
                    )}>
                      {result.risk_level}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/10">
                   <p className="text-[8px] font-bold text-sky-500/50 uppercase tracking-widest mb-1 text-center">10m Target</p>
                   <p className="text-xs font-bold text-white tracking-widest uppercase text-center tabular-nums">{result.target_range}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest italic">AI Rationale</p>
                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                    &quot;{result.reasoning}&quot;
                  </p>
                </div>
              </div>

              <p className="text-[8px] text-center text-slate-700 font-bold uppercase tracking-widest opacity-50">
                AI Probabilistic Model • V2.1
              </p>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
