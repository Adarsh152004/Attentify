"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { LiveStockAnalyzer } from "@/components/dashboard/LiveStockAnalyzer";
import { PortfolioOptimizer } from "@/components/dashboard/PortfolioOptimizer";
import { VeracityWidget } from "@/components/dashboard/VeracityWidget";
import { Zap, Activity, ShieldCheck, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden flex bg-slate-950 text-slate-200 font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-slate-950">
        <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8 space-y-8">
          {/* Header Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <Activity size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-sky-400" />
                </div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                  Market OS
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                VittaDrishti <span className="text-sky-400">Intelligence</span>
              </h1>
              
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                Real-time financial analysis, portfolio optimization, and AI-driven market insights. 
                Everything you need to monitor the global pulse in one place.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live System</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Secure Protocol</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Globe size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Global Nodes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Market Pulse Section */}
            <div className="lg:col-span-12">
              <div className="mb-4 flex items-center gap-2 px-1">
                <Activity size={16} className="text-sky-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Market Pulse</h2>
              </div>
              <MarketOverview />
            </div>

            {/* Middle Section: Analyzer & Optimizer */}
            <div className="lg:col-span-6 space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Activity size={16} className="text-sky-400" />
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Neural Analyzer</h2>
               </div>
               <LiveStockAnalyzer />
            </div>
            
            <div className="lg:col-span-6 space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Zap size={16} className="text-sky-400" />
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Portfolio Matrix</h2>
               </div>
               <PortfolioOptimizer />
            </div>

            {/* Bottom Section: Veracity */}
            <div className="lg:col-span-12">
              <div className="mb-4 flex items-center gap-2 px-1">
                <ShieldCheck size={16} className="text-sky-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Veracity Core</h2>
              </div>
              <VeracityWidget />
            </div>
          </div>

          <footer className="py-12 border-t border-slate-800 text-center opacity-40">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">
               VittaDrishti systems // Core V3 // Unified Intelligence Layer
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
