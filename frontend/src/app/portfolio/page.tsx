"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  RefreshCw, 
  CheckCircle,
  Terminal,
  Cpu,
  Database,
  Globe,
  Activity,
  Zap,
  ChevronRight
} from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Holding {
  ticker: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  value: number;
  pl: number;
  pl_pct: number;
  daily_change_pct: number;
  sector: string;
}

interface PortfolioStatus {
  holdings: Holding[];
  total_value: number;
  daily_change_pct: number;
}

const COLORS = ['#38bdf8', '#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#8b5cf6'];

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newTicker, setNewTicker] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/portfolio/status");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const savePortfolio = async (updatedHoldings: any[]) => {
    try {
      await fetch("http://localhost:8000/api/portfolio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdings: updatedHoldings }),
      });
      fetchStatus();
    } catch (err) {
      alert("Failed to save portfolio");
    }
  };

  const handleAdd = () => {
    if (!newTicker || !newQty || !newPrice) return;
    const current = data?.holdings || [];
    const updated = [...current.map(h => ({ ticker: h.ticker, quantity: h.quantity, purchase_price: h.purchase_price })), { 
      ticker: newTicker.toUpperCase(), 
      quantity: Number(newQty), 
      purchase_price: Number(newPrice) 
    }];
    savePortfolio(updated);
    setNewTicker(""); setNewQty(""); setNewPrice("");
    setIsAdding(false);
  };

  const handleDelete = (ticker: string) => {
    const updated = (data?.holdings || [])
      .filter(h => h.ticker !== ticker)
      .map(h => ({ ticker: h.ticker, quantity: h.quantity, purchase_price: h.purchase_price }));
    savePortfolio(updated);
  };

  const getSectorData = () => {
    if (!data) return [];
    const map: Record<string, number> = {};
    data.holdings.forEach((h: Holding) => {
      map[h.sector] = (map[h.sector] || 0) + h.value;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const getPLData = () => {
    if (!data) return [];
    return data.holdings.map((h: Holding) => ({ name: h.ticker, pl: h.pl }));
  };

  return (
    <div className="h-screen overflow-hidden flex bg-slate-950 text-white font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto py-12 px-8 space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-900">
            <div>
              <h1 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-3">
                <Wallet size={16} className="text-sky-500" />
                Institutional Portfolio Pulse
              </h1>
              <p className="text-slate-500 mt-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 opacity-60">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                Live Real-time Grid Active
              </p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                className="h-10 bg-slate-900 border border-slate-800 text-slate-500 px-4 rounded-lg flex items-center hover:bg-slate-800 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                onClick={fetchStatus}
                disabled={loading}
               >
                 <RefreshCw size={14} className={cn("mr-2", loading && "animate-spin")} />
                 Sync
               </button>
               <button 
                 className="h-10 bg-sky-500 hover:bg-sky-600 text-white border border-sky-400 px-6 rounded-lg flex items-center transition-all text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/10"
                 onClick={() => setIsAdding(!isAdding)}
               >
                 <Plus size={14} className="mr-2" />
                 Add Holding
               </button>
            </div>
          </header>

          {isAdding && (
            <div className="animate-in fade-in duration-500">
               <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                 <div className="mb-6">
                   <h2 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Database size={14} />
                     Provision New Position
                   </h2>
                 </div>
                 
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                   <div className="space-y-3">
                     <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1 block">Ticker ID</label>
                     <input 
                       placeholder="E.G. RELIANCE"
                       className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs font-bold tracking-widest text-white placeholder:text-slate-800 focus:border-sky-500/50 outline-none transition-all uppercase"
                       value={newTicker} onChange={e => setNewTicker(e.target.value)}
                     />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1 block">Quantity</label>
                     <input 
                       type="number"
                       placeholder="0"
                       className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs font-bold tracking-widest text-white placeholder:text-slate-800 focus:border-sky-500/50 outline-none transition-all"
                       value={newQty} onChange={e => setNewQty(e.target.value)}
                     />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest ml-1 block">Acq. Price</label>
                     <input 
                       type="number"
                       placeholder="0.00"
                       className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs font-bold tracking-widest text-white placeholder:text-slate-800 focus:border-sky-500/50 outline-none transition-all"
                       value={newPrice} onChange={e => setNewPrice(e.target.value)}
                     />
                   </div>
                   <button 
                     className="h-12 bg-sky-500 text-white rounded-lg px-6 font-bold transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:bg-sky-600 active:scale-[0.98] flex items-center justify-center gap-2" 
                     onClick={handleAdd}
                   >
                     Submit
                     <ChevronRight size={14} />
                   </button>
                </div>
               </div>
            </div>
          )}

          {data && data.holdings.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-1 space-y-8">
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl group">
                    <div className="mb-4 flex items-center justify-between">
                       <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Total Valuation</p>
                       <Zap size={12} className="text-sky-400 opacity-60" />
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">
                       ₹{data.total_value.toLocaleString()}
                    </p>
                    <div className={cn("inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest", 
                      data.daily_change_pct >= 0 ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20" : "text-rose-500 bg-rose-500/10 border border-rose-500/20")}>
                      {data.daily_change_pct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{data.daily_change_pct}% 24h</span>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="mb-6">
                       <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Sector Dispersion</p>
                    </div>
                    <div className="h-48">
                       <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie
                             data={getSectorData()}
                             cx="50%" cy="50%"
                             innerRadius={40}
                             outerRadius={65}
                             paddingAngle={5}
                             dataKey="value"
                             stroke="none"
                           >
                             {getSectorData().map((entry: any, index: number) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                           </Pie>
                           <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#0f172a', 
                                border: '1px solid #1e293b', 
                                borderRadius: '8px', 
                                fontSize: '9px', 
                                fontWeight: 'bold',
                                color: '#fff',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                padding: '12px'
                            }}
                           />
                         </PieChart>
                       </ResponsiveContainer>
                    </div>
                  </div>
               </div>

               <div className="lg:col-span-3 p-8 bg-slate-900 border border-slate-800 rounded-2xl">
                 <div className="mb-8 flex items-center justify-between">
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Profit/Loss Analytics Engine</p>
                    <div className="flex items-center gap-4 text-slate-800">
                       <Activity size={14} />
                       <Terminal size={14} />
                    </div>
                 </div>
                 <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={getPLData()} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                       <XAxis 
                         dataKey="name" 
                         stroke="#334155" 
                         fontSize={9} 
                         fontWeight="bold" 
                         axisLine={false} 
                         tickLine={false}
                         dy={10}
                       />
                       <YAxis 
                         stroke="#334155" 
                         fontSize={9} 
                         fontWeight="bold" 
                         axisLine={false} 
                         tickLine={false}
                       />
                       <Tooltip 
                         contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            border: '1px solid #1e293b', 
                            borderRadius: '8px', 
                            fontSize: '9px', 
                            fontWeight: 'bold',
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            padding: '12px'
                         }}
                         cursor={{ fill: '#1e293b' }}
                       />
                       <Bar dataKey="pl" radius={[4, 4, 0, 0]} barSize={32}>
                         {getPLData().map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={entry.pl >= 0 ? '#10b981' : '#f43f5e'} />
                         ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
            </div>
          )}

          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center gap-4">
                <Loader2 size={32} className="text-sky-500 animate-spin" />
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest animate-pulse">Syncing nodes</p>
             </div>
          ) : !data || data.holdings.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center gap-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="h-20 w-20 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center">
                <Wallet size={32} className="text-slate-800" />
              </div>
              <div className="space-y-3">
                 <h2 className="text-xl font-bold text-white tracking-widest uppercase">Portfolio Empty</h2>
                 <p className="text-slate-500 max-w-xs mx-auto font-bold text-[10px] uppercase tracking-widest opacity-60 leading-relaxed">
                   Sync your acquisition nodes to begin tracking.
                 </p>
              </div>
              <button 
                className="bg-sky-500 hover:bg-sky-600 text-white border border-sky-400 px-10 py-4 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-sky-500/10"
                onClick={() => setIsAdding(true)}
              >
                Launch Portfolio
              </button>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-3">
                     <Activity size={14} className="text-sky-500" />
                     Live Holding Inventory
                  </h3>
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                     <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest underline decoration-sky-500/30">V2.1.2 Secure Sync</span>
                  </div>
               </div>

               <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl overflow-x-auto">
                 <table className="w-full text-left text-[11px] border-collapse">
                   <thead>
                     <tr className="bg-slate-950/50 text-slate-500 border-b border-slate-800 font-bold">
                       <th className="py-6 px-8 uppercase tracking-widest">Asset Identifier</th>
                       <th className="py-6 px-6 uppercase tracking-widest">Sector Node</th>
                       <th className="py-6 px-6 uppercase tracking-widest">Qty</th>
                       <th className="py-6 px-6 uppercase tracking-widest text-right">Price</th>
                       <th className="py-6 px-6 uppercase tracking-widest text-right">Total Val</th>
                       <th className="py-6 px-6 uppercase tracking-widest text-right">P/L Delta</th>
                       <th className="py-6 px-8 w-16"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                     {data.holdings.map((h: Holding) => (
                       <tr key={h.ticker} className="hover:bg-slate-950 transition-all group border-b border-slate-800 last:border-0 font-medium">
                         <td className="py-6 px-8">
                           <div className="flex flex-col">
                             <span className="font-bold text-white tracking-widest text-[12px]">{h.ticker.split('.')[0]}</span>
                             <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">{h.ticker}</span>
                           </div>
                         </td>
                         <td className="py-6 px-6">
                           <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-[8px] font-bold text-slate-500 uppercase tracking-widest">{h.sector}</span>
                         </td>
                         <td className="py-6 px-6 text-slate-400 tabular-nums">{h.quantity}</td>
                         <td className="py-6 px-6 text-right tabular-nums">
                           <span className="text-slate-300">₹{h.current_price.toLocaleString()}</span>
                         </td>
                         <td className="py-6 px-6 text-right tabular-nums">
                           <span className="text-sky-400 font-bold">₹{h.value.toLocaleString()}</span>
                         </td>
                         <td className="py-6 px-6 text-right">
                            <div className={`flex flex-col items-end`}>
                               <div className={cn("font-bold flex items-center gap-1 text-[11px] tabular-nums", h.pl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                 {h.pl >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                 ₹{Math.abs(h.pl).toLocaleString()}
                               </div>
                               <div className={cn("text-[9px] font-bold uppercase tracking-widest mt-0.5", h.pl >= 0 ? "text-emerald-500/60" : "text-rose-500/60")}>
                                 {h.pl >= 0 ? "+" : ""}{h.pl_pct}%
                               </div>
                            </div>
                         </td>
                         <td className="py-6 px-8 text-right">
                             <button 
                               onClick={() => handleDelete(h.ticker)} 
                               className="opacity-0 group-hover:opacity-100 transition-all text-slate-700 hover:text-rose-500 p-2 hover:bg-rose-500/10 rounded-md"
                             >
                               <Trash2 size={14} />
                             </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {data && data.holdings.length > 0 && (
            <div className="flex items-center gap-4 p-6 bg-slate-900 border border-slate-800 rounded-xl animate-in slide-in-from-bottom-2 duration-500">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Integrity established</p>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed opacity-60">Global nodes synchronized. Secure link active.</p>
              </div>
            </div>
          )}

          <footer className="py-16 flex flex-col items-center justify-center text-center gap-6 opacity-20 border-t border-slate-900">
             <div className="flex items-center gap-8 text-slate-500">
                <Globe size={16} />
                <Terminal size={16} />
                <Database size={16} />
                <Cpu size={16} />
             </div>
             <p className="text-slate-700 text-[9px] font-bold uppercase tracking-[0.4em] leading-relaxed max-w-xl">
               Attentify OS // Portfolio Subsystem // Secure Node 0xAF
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
