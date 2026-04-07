"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Loader2, Globe, FileText, Cpu, Terminal, ShieldCheck, Zap } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  context_chunks?: number;
}

const SUGGESTED_QUESTIONS = [
  "Nifty 50 Technical Analysis",
  "RBI Policy Impact",
  "Portfolio Hedging Strategies",
  "Growth Sectors 2026",
];

export function ChatAssistant({ hideHeader = false }: { hideHeader?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "**Intelligence Core Initialized**\n\nI am your private financial analyst. I can help you analyze documents, live market feeds, and portfolio metrics.\n\n*How can I assist your strategy today?*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [useWeb, setUseWeb] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, use_web: useWeb }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: typeof data.answer === "string" ? data.answer : JSON.stringify(data.answer),
        sources: data.sources ?? [],
        context_chunks: data.context_chunks ?? 0,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error communicating with AI core:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚠️ **Connection Failure** — Unable to reach intelligence core. Please check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl", hideHeader && "bg-transparent border-none shadow-none")}>
      {!hideHeader && (
        <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center text-white tracking-tight">
              <Cpu className="mr-3 h-4 w-4 text-sky-400" />
              AI Intelligence Assistant
              <span className="ml-4 text-[9px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Active Node
              </span>
            </CardTitle>
            <button
              onClick={() => setUseWeb((v) => !v)}
              className={cn(
                "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all",
                useWeb
                   ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                   : "bg-slate-950 border-slate-800 text-slate-500"
              )}
            >
              <Globe size={14} />
              Web Search {useWeb ? "On" : "Off"}
            </button>
          </div>
        </CardHeader>
      )}

      {/* Message area */}
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0 custom-scrollbar bg-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-4 group items-start", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div
              className={cn(
                "flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-all",
                msg.role === "user"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-800 border border-slate-700 text-sky-400"
              )}
            >
              {msg.role === "user" ? (
                <User size={18} />
              ) : (
                <Terminal size={18} />
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-5 py-4 border transition-all",
                msg.role === "user"
                  ? "bg-slate-800 border-slate-700 text-white rounded-tr-sm"
                  : "bg-slate-900 border-slate-800 text-slate-300 rounded-tl-sm shadow-sm"
              )}
            >
              <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-strong:text-white prose-a:text-sky-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Verification Sources</p>
                  <div className="grid gap-1">
                    {msg.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] text-sky-500/70 hover:text-sky-400 truncate font-medium transition-all"
                      >
                        <ShieldCheck size={12} className="shrink-0" />
                        {src}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {msg.context_chunks !== undefined && msg.context_chunks > 0 && (
                <div className="mt-3 flex items-center justify-between text-[8px] font-bold text-slate-600 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded">
                  <span className="flex items-center gap-1.5">
                    <FileText size={10} />
                    {msg.context_chunks} Context Nodes Referenced
                  </span>
                  <Zap size={10} className="text-sky-500/30" />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center bg-slate-800 border border-slate-700 text-sky-400">
              <Bot size={18} className="animate-pulse" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3">
              <Loader2 size={14} className="text-sky-500 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Synthesizing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </CardContent>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-[9px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <div className="relative flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-2 focus-within:border-sky-500/50 transition-all">
          <input
            className="flex-1 bg-transparent border-none text-white placeholder:text-slate-700 text-xs py-2 px-3 outline-none font-medium selection:bg-sky-500/30"
            placeholder="TYPE YOUR COMMAND..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-600 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-all shadow-lg shadow-sky-500/20 active:scale-95"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        
        <div className="mt-4 flex items-center justify-between px-1 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                    Neural Cluster Active
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Secure Session
                </div>
            </div>
            <div className="opacity-50">
               Latency: 24ms
            </div>
        </div>
      </div>
    </div>
  );
}
