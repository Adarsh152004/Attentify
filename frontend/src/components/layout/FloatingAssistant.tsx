"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Sparkles, Loader2, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function FloatingAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Welcome to **VittaDrishti**. How can I assist with your strategic research today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, use_web: true }),
      });

      if (!response.ok) throw new Error("Neural Link Failure");
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: "bot", content: data.answer || data.response || "Synthesis incomplete." }]);
    } catch (err: unknown) {
      console.error("Error in chat communication:", err);
      setMessages(prev => [...prev, { role: "bot", content: "Error: Neural Link Interrupted." }]);
    } finally {
      setLoading(false);
    }
  };

  if (pathname === "/news") return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-center transition-all active:scale-90 group"
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-10 right-0 bg-slate-900 border border-slate-800 text-[10px] font-black px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest text-slate-300">
            Link_Core_Assistant
          </span>
        </button>
      ) : (
        <div className={cn(
            "bg-slate-900 border border-slate-800 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden transition-all duration-300 animate-in zoom-in-95",
            isMaximized ? 'fixed inset-4 w-auto h-auto' : 'w-[450px] h-[650px]'
        )}>
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-sky-500/10 rounded-xl">
                 <Sparkles className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-tighter">Core Assistant</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">VittaDrishti</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-foreground transition-colors">
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-sky-500" : "bg-slate-900 border border-slate-800"}`}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-sky-400" />}
                </div>
                <div className={cn(
                    "p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] border",
                    msg.role === "user" 
                        ? "bg-slate-800 text-slate-100 border-slate-700" 
                        : "bg-slate-900 text-slate-300 border-slate-800"
                )}>
                   <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 max-w-none">
                     <ReactMarkdown>
                       {msg.content}
                     </ReactMarkdown>
                   </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-sky-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-sky-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-sky-500/50 rounded-full animate-bounce"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-slate-800 bg-slate-950">
            <div className="relative group">
               <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-sky-500/50 transition-colors">
                 <input
                   type="text"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
                   placeholder="Neural Inquiry..."
                   className="flex-1 bg-transparent border-none text-xs font-semibold px-4 py-4 text-foreground placeholder:text-slate-600 focus:ring-0"
                 />
                 <button
                   onClick={handleSend}
                   disabled={loading || !input.trim()}
                   className="p-3 mr-1 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl transition-all active:scale-95"
                 >
                   <Send className="w-4 h-4" />
                 </button>
               </div>
            </div>
            <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest text-center mt-4">
              Secured Link Protocol • Core Synthesis Active
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

