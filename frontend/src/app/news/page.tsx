"use client";

import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { StrategicDrawer } from "@/components/dashboard/StrategicDrawer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Rss, Activity, Globe } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8 space-y-12">
          
          {/* Header Section */}
          <header className="bg-slate-900 border border-slate-800 rounded-2xl p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none">
              <Rss size={220} />
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center">
                  <Rss className="h-5 w-5 text-sky-400" />
                </div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                  Market Signal
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Global <span className="text-sky-400">Narrative</span>
              </h1>
              
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                Real-time synthesis of global financial journalism. Filter market noise and 
                identify strategic sentiment signals with our proprietary veracity engines.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Live Ingestion</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Activity size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Veracity Active</span>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                 <Globe size={14} className="text-sky-400" />
                 Primary Streams
              </h2>
            </div>
            <NewsFeed />
          </div>
          
          <footer className="py-12 border-t border-slate-800 text-center opacity-40">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">
               VittaDrishti systems // Core V3 // Signal Intelligence
             </p>
          </footer>
        </div>
      </main>

      <StrategicDrawer />
    </div>
  );
}
