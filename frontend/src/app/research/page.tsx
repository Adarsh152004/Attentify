"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ResearchHub } from "@/components/dashboard/ResearchHub";
import { BookOpen, Terminal, Cpu, Database, Globe } from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="h-screen overflow-hidden flex bg-slate-950 text-white font-sans">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="px-10 py-8 border-b border-slate-900 bg-slate-950/80 sticky top-0 z-10 shrink-0">
            <div className="flex items-center justify-between">
                <div>
                   <h1 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-3">
                     <BookOpen size={16} className="text-sky-500" />
                     Research Intelligence Base
                   </h1>
                   <p className="text-slate-500 mt-1 text-[10px] font-bold uppercase tracking-widest opacity-60">
                     Annual Reports • DRHPs • Strategic Memoranda • PDF Index
                   </p>
                </div>
                <div className="flex items-center gap-4 opacity-20 text-slate-500">
                   <Terminal size={14} />
                   <Cpu size={14} />
                </div>
            </div>
          </div>

          <div className="flex-1 p-10 min-h-0">
            <ResearchHub />
          </div>
          
          <footer className="px-10 py-6 border-t border-slate-900 flex items-center justify-between opacity-30">
             <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                <Database size={12} />
                Encrypted Storage Node
             </div>
             <div className="flex items-center gap-3 text-slate-500">
                <Globe size={12} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Global Vector Sync</span>
             </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
