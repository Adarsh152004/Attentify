"use client";

import { useState, useEffect } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Cpu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketDataPoint {
  time: string;
  value: number;
}

export function MarketOverview() {
  const [chartData, setChartData] = useState<MarketDataPoint[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [pctChange, setPctChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch("http://localhost:8000/api/market")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setChartData(data.data);
          setCurrent(data.current);
          setPctChange(data.pct_change);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isPositive = pctChange >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl group">
      <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center text-white tracking-tight">
              <Cpu className="mr-3 h-4 w-4 text-sky-400" />
              Nifty 50 Index
              {current > 0 && (
                <span className="ml-4 text-lg font-bold text-sky-400 tabular-nums">
                  ₹{current.toLocaleString('en-IN')}
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">
              Live Intraday Stream • Yahoo Finance Verified
            </CardDescription>
          </div>
          {!loading && (
            <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider",
                isPositive 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-500"
            )}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}{pctChange}%
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="h-[250px] w-full relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-900/50 backdrop-blur-sm rounded-xl">
              <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-4">Syncing...</p>
            </div>
          )}
          
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ dy: 10 }}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value.toLocaleString('en-IN')}`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-6 flex items-center justify-between text-[10px] font-medium text-slate-500">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 bg-sky-500 rounded-full animate-pulse" />
                    Live Feed
                </div>
                <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-amber-500" />
                    Low Latency
                </div>
            </div>
            <span className="opacity-50">VittaDrishti v3.0</span>
        </div>
      </CardContent>
    </div>
  );
}
