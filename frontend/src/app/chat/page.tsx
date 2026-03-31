"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ChatAssistant } from "@/components/dashboard/ChatAssistant";
import { MessageSquare, Terminal, Cpu } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="h-screen overflow-hidden flex bg-slate-950 text-slate-200 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900 shadow-md transition-all">
          <div className="flex items-center justify-between">
              <div>
                 <h1 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-3">
                   <MessageSquare size={18} className="text-sky-400" />
                   AI Intelligence Assistant
                 </h1>
                 <p className="text-slate-500 mt-1 text-[10px] font-bold uppercase tracking-wider">
                   Powered by VittaDrishti Neural Core · Secure Session
                 </p>
              </div>
              <div className="flex items-center gap-4 text-slate-600 opacity-50">
                 <Terminal size={14} />
                 <Cpu size={14} />
              </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-slate-950">
          <ChatAssistant />
        </div>
      </main>
    </div>
  );
}
