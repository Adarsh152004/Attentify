"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Zap, TrendingUp, TrendingDown,Cpu, Activity, Globe, ArrowRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface AnalysisResponse {
  ticker: string;
  metrics: {
    price: number | string;
    high: number | string;
    low: number | string;
    pe: number | string;
    fifty_day_ma?: number | string;
    fifty_two_week_high?: number | string;
    fifty_two_week_low?: number | string;
    dividend_yield?: string;
  };
  analysis: string;
  sources?: {
    name: string;
    url: string;
  }[];
}

export function LiveStockAnalyzer() {
  const [ticker, setTicker] = useState("");
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeStock = async () => {
    if (!ticker) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: ticker }),
      });
      
      if (!res.ok) throw new Error("Synthesis failure. Service unavailable.");
      
      const result = await res.json();
      setData(result);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "Failed to connect to Intelligence Core.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center text-white tracking-tight">
              <Cpu className="mr-3 h-4 w-4 text-sky-400" />
              Stock Intelligence Analyzer
            </CardTitle>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="h-3 w-3" />
                    Live Scan
                </span>
                <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
            </div>
        </div>
        <CardDescription className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">
          Deep-Dive Analysis • Verified Neural Synthesis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col space-y-6 flex-1 min-h-0 p-6">
        
        <div className="flex gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              placeholder="ENTER TICKER (E.G. RELIANCE)..." 
              className="w-full bg-slate-950 border border-slate-800 h-12 pl-12 pr-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-700"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && analyzeStock()}
            />
          </div>
          <button 
            className="h-12 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-lg shadow-sky-500/20 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={analyzeStock}
            disabled={loading || !ticker}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap size={14} className="fill-current" />
            )}
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-3 animate-in fade-in">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            {error}
          </div>
        )}

        {data ? (
          <div className="space-y-6 flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Price</span>
                <span className="text-xl font-bold text-white block mt-1">₹{data.metrics.price}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">P/E Ratio</span>
                <span className="text-xl font-bold text-white block mt-1">{data.metrics.pe}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={12}/> HIGH
                </span>
                <span className="text-xl font-bold text-emerald-500 block mt-1">₹{data.metrics.high}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-rose-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <TrendingDown size={12}/> LOW
                </span>
                <span className="text-xl font-bold text-rose-500 block mt-1">₹{data.metrics.low}</span>
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group/card shadow-inner">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center py-1 px-3 bg-sky-500/10 rounded-full border border-sky-500/20">
                  AI Context Synthesis
                </h3>
              </div>
              
              <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-p:leading-relaxed prose-strong:text-white prose-a:text-sky-400 relative z-10">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                  }}
                >
                  {data.analysis}
                </ReactMarkdown>
              </div>

              {data.sources && data.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                      <Globe className="w-3 h-3 mr-2 text-sky-500/50" />
                      Verification Nodes
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.sources.map((src, i) => (
                      <a 
                        key={i} 
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/30 hover:bg-slate-900 transition-all group/link"
                      >
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate group-hover/link:text-slate-200">
                          {src.name}
                        </span>
                        <ArrowRight size={12} className="text-slate-700 group-hover/link:text-sky-400 group-hover/link:translate-x-1 transition-all" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 border border-dashed border-slate-800 rounded-2xl opacity-40">
             <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                <Globe size={24} className="text-slate-600" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Awaiting Search Query</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
