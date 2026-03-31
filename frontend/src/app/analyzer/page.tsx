"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { LiveStockAnalyzer } from "@/components/dashboard/LiveStockAnalyzer";
import { Activity, Terminal, Cpu, Database, Globe } from "lucide-react";

export default function AnalyzerPage() {
  return (
    <div className="h-screen overflow-hidden flex bg-slate-950 text-white font-sans">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto py-12 px-8 space-y-12">
          {/* Header Section */}
          <header className="relative p-12 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Activity size={200} />
             </div>
             
             <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 bg-sky-500/10 border border-sky-500/20 rounded-lg flex items-center justify-center">
                     <Activity size={18} className="text-sky-400" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     Neural analysis node
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-6 tracking-tight leading-tight uppercase">
                  Deep Context <br/>
                  <span className="text-sky-400">Synthesis Terminal</span>
                </h1>
                
                <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xl">
                   Deep architectural dive into individual asset nodes. Synchronizing live price streams 
                   with verified financial journalism and impact synthesis.
                </p>

                <div className="mt-10 flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Sync established</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Globe size={14} className="text-slate-700" />
                      <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Global connect active</span>
                   </div>
                </div>
             </div>
          </header>

          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-xs font-bold flex items-center gap-2 text-white uppercase tracking-widest">
                   <Terminal size={16} className="text-sky-500" />
                   Analysis Orchestrator
                </h2>
                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                   <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Real-time Valuation Core</span>
                </div>
             </div>
             
             <div className="min-h-[500px]">
                <LiveStockAnalyzer />
             </div>
          </div>

          <footer className="py-20 border-t border-slate-900 flex flex-col items-center justify-center text-center gap-4">
             <div className="flex items-center gap-6 opacity-20 text-slate-500">
                <Terminal size={14} />
                <Database size={14} />
                <Cpu size={14} />
             </div>
             <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest leading-relaxed max-w-lg">
               Subsystem Analysis: Structural estimates only. Not financial advice.
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
