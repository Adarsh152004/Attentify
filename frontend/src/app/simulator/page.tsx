"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { CrisisSimulator } from "@/components/dashboard/CrisisSimulator";
import { ShieldAlert, Activity, Cpu, Database, Globe } from "lucide-react";

export default function SimulatorPage() {
  return (
    <div className="h-screen overflow-hidden flex bg-slate-950 text-white font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto py-12 px-8 space-y-12">
          {/* Header Section */}
          <header className="relative p-12 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <ShieldAlert size={200} />
             </div>
             
             <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center">
                     <ShieldAlert size={18} className="text-rose-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     System stress terminal
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-6 tracking-tight leading-tight uppercase">
                  Portfolio <br/>
                  <span className="text-rose-500">Crisis Simulator</span>
                </h1>
                
                <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xl">
                  Run simulated market shock scenarios and systemic black swan events to evaluate 
                  your portfolio's resilience. Identify mission-critical vulnerabilities before 
                  they manifest in live markets.
                </p>

                <div className="mt-10 flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Core Active</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Activity size={14} className="text-slate-700" />
                      <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">V2.1 Linked</span>
                   </div>
                </div>
             </div>
          </header>

          {/* Simulator Core */}
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-xs font-bold flex items-center gap-2 text-white uppercase tracking-widest">
                   <Activity size={16} className="text-rose-500" />
                   Simulation Engine
                </h2>
                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                   <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                   <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Vector Sync Active</span>
                </div>
             </div>
             
             <div className="min-h-[500px]">
                <CrisisSimulator />
             </div>
          </div>

          <footer className="py-20 border-t border-slate-900 flex flex-col items-center justify-center text-center gap-4">
             <div className="flex items-center gap-6 opacity-20 text-slate-500">
                <Globe size={14} />
                <Database size={14} />
                <Cpu size={14} />
             </div>
             <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest leading-relaxed max-w-lg">
               Subsystem Analysis: theoretical projections based on weighted sector-shocks. 
               Not financial advice.
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
