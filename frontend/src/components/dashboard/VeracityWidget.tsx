"use client";

import { useState, useEffect } from "react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ShieldAlert, Newspaper, Search, Loader2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: number;
  headline: string;
  source: string;
}

interface VeracityResponse {
  trust_score: number;
  reasoning: string;
}

export function VeracityWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [veracity, setVeracity] = useState<VeracityResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error(err));
  }, []);

  const analyzeNews = async (item: NewsItem) => {
    setSelectedNews(item);
    setLoading(true);
    setVeracity(null);

    try {
      const res = await fetch("http://localhost:8000/api/veracity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: item.headline, source: item.source }),
      });
      const data = await res.json();
      setVeracity(data);
    } catch (err) {
      console.error(err);
      setVeracity({ trust_score: 0, reasoning: "Connection to Truth Engine failed. Internal relay error." });
    } finally {
      setLoading(false);
    }
  };

  const getScoreStyles = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };
  
  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle size={16} className="text-emerald-500" />;
    if (score >= 50) return <AlertTriangle size={16} className="text-amber-500" />;
    return <ShieldAlert size={16} className="text-rose-500" />;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-white uppercase tracking-tight">
          <Newspaper size={16} className="text-sky-400" />
          Market Truth Engine
        </CardTitle>
        <CardDescription className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
          Filing Cross-Reference • Fact Validation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {veracity && selectedNews && (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Search size={14} className="text-sky-500" />
                <h4 className="font-bold text-slate-500 text-[9px] uppercase tracking-widest">Verification Result</h4>
              </div>
              <Badge className={cn("px-2 py-0.5 font-bold uppercase tracking-widest text-[9px] border-none", getScoreStyles(veracity.trust_score))}>
                {veracity.trust_score}% Reliability
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-white leading-tight italic border-l-2 border-sky-500 pl-4 py-1">&quot;{selectedNews.headline}&quot;</p>
              <div className="flex gap-3 items-start p-4 bg-slate-900 rounded-lg border border-slate-800">
                 {getIcon(veracity.trust_score)}
                 <p className="text-[10px] font-medium text-slate-400 leading-relaxed ">{veracity.reasoning}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-bold text-slate-600 text-[9px] uppercase tracking-widest px-1">Recent Intelligence Stream</h4>

          <div className="grid gap-2">
            {news.map((item) => (
              <div
                key={item.id}
                className="group relative flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex-1 pr-4">
                  <p className="text-[11px] font-bold text-white tracking-tight leading-tight uppercase group-hover:text-sky-400 transition-colors">{item.headline}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Link2 size={10} className="text-slate-700" />
                    <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">{item.source}</p>
                  </div>
                </div>
                <button
                  className="px-3 h-8 rounded-lg bg-slate-800 hover:bg-sky-500/10 hover:text-sky-400 border border-slate-700 hover:border-sky-500/30 text-[9px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                  onClick={() => analyzeNews(item)}
                  disabled={loading}
                >
                  {loading && selectedNews?.id === item.id ? (
                    <Loader2 size={12} className="animate-spin mx-auto" />
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
}
