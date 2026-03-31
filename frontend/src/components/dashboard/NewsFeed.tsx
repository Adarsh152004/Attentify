"use client";

import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  Loader2,
  Share2,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string | number;
  headline: string;
  source: string;
  url: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  confidence: number;
  tickers: string[];
  impact: string;
  fetched_at: string;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [fetchingNews, setFetchingNews] = useState(true);

  const fetchNews = async (isManualSync = false) => {
    setFetchingNews(true);
    try {
      const url = `http://localhost:8000/api/news?${isManualSync ? 'sync=true&' : ''}t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Sync failure");
      const data: NewsItem[] = await res.json();
      setNews(data);
    } catch {
      setNews([]);
    } finally {
      setFetchingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(() => {
      fetchNews();
    }, 900000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Bearish": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish": return <TrendingUp size={12} />;
      case "Bearish": return <TrendingDown size={12} />;
      default: return <Minus size={12} />;
    }
  };

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Market News</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Real-time sentiment analysis from 50+ institutional sources.
          </p>
        </div>
        
        <button
          className="h-10 px-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={() => fetchNews(true)}
          disabled={fetchingNews}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Refresh Feed</span>
          {fetchingNews ? <Loader2 size={16} className="animate-spin text-sky-400" /> : <RefreshCw size={16} />}
        </button>
      </div>

      {/* Grid Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fetchingNews && news.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center gap-4 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
            <Loader2 size={32} className="text-sky-500 animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Syncing Nodes...</p>
          </div>
        ) : (
          news.map((item, idx) => (
            <div 
              key={item.id} 
              className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/30 transition-all group animate-in fade-in slide-in-from-bottom-4 shadow-xl"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="p-6 pb-2 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                       <Clock size={12} className="text-sky-500/50" />
                       {new Date(item.fetched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className={cn(
                        "px-3 py-1 rounded-md border font-bold uppercase tracking-wider text-[9px] flex items-center gap-2", 
                        getSentimentStyles(item.sentiment)
                    )}>
                      {getSentimentIcon(item.sentiment)}
                      {item.sentiment}
                    </div>
                 </div>
                 
                 <h2 className="text-lg font-bold text-white leading-tight group-hover:text-sky-400 transition-colors line-clamp-3 min-h-[3.3em]">
                   {item.headline}
                 </h2>

                 <div className="flex flex-wrap gap-2">
                    {item.tickers?.map(ticker => (
                      <span key={ticker} className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider">
                         {ticker}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="px-6 py-4">
                 <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">AI Impact Analysis</span>
                        <span className="text-[9px] font-bold text-sky-500/50 uppercase tracking-widest">{Math.round(item.confidence * 100)}% Conf</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                       {item.impact}
                    </p>
                 </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest truncate max-w-[120px]">
                   {item.source}
                </span>
                
                <div className="flex items-center gap-3">
                   <button className="p-2 text-slate-600 hover:text-white transition-colors">
                      <Share2 size={16} />
                   </button>
                   <a 
                     href={item.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all"
                   >
                     <ArrowUpRight size={16} />
                   </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
