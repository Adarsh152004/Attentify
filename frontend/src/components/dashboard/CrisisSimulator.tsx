"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Zap, 
  Play, 
  Info, 
  Skull,
  BarChart3,
  RefreshCw,
  Activity,
  ShieldAlert,
  Flame,
  Target
} from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Scenario {
  description: string;
}

interface SimulationResult {
  scenario: string;
  description: string;
  total_impact: number;
  impact_percentage: number;
  recovery_estimate_years: number;
  resilience_score: number;
  confidence_interval: string;
  sector_heatmap: Array<{
    sector: string;
    loss_pct: number;
    intensity: number;
  }>;
  details: Array<{
    ticker: string;
    sector: string;
    original_value: number;
    simulated_loss: number;
    new_value: number;
    shock_percentage: number;
    reason?: string;
  }>;
}

export function CrisisSimulator() {
  const [scenarios, setScenarios] = useState<Record<string, Scenario>>({});
  const [selectedScenario, setSelectedScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/scenarios`)
      .then(res => res.json())
      .then(data => setScenarios(data))
      .catch(err => console.error("Failed to load scenarios:", err));
  }, []);

  const runSimulation = async () => {
    const scenarioToRun = customScenario.trim() || selectedScenario;
    if (!scenarioToRun) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/portfolio/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenarioToRun }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data);
    } catch (err) {
      console.error(err);
      alert("Simulation failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scenario Selection */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
            <CardTitle className="text-sm font-bold flex items-center text-rose-500 tracking-tight">
              <Activity className="mr-3 h-4 w-4 text-rose-500" />
              Crisis Simulator
            </CardTitle>
            <CardDescription className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">
              Stress Test Portfolio Resilience
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Select Scenario</p>
              {Object.keys(scenarios).map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setSelectedScenario(name);
                    setCustomScenario("");
                  }}
                  className={cn(
                    "w-full text-left px-4 py-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-wide",
                    selectedScenario === name && !customScenario
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  {name}
                </button>
              ))}
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-900 px-3 text-[9px] uppercase font-bold tracking-widest text-slate-600">OR</span>
                </div>
              </div>
              
              <input 
                type="text"
                placeholder="Custom Shock Description..."
                value={customScenario}
                onChange={(e) => {
                  setCustomScenario(e.target.value);
                  if (e.target.value) setSelectedScenario("");
                }}
                className="w-full bg-slate-950 border border-slate-800 text-xs font-bold uppercase tracking-wide text-white rounded-xl px-4 py-4 focus:outline-none focus:border-sky-500/50 placeholder:text-slate-700"
              />
            </div>

            {selectedScenario && !customScenario && scenarios[selectedScenario] && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {scenarios[selectedScenario].description}
                </p>
              </div>
            )}

            <button
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 text-xs uppercase tracking-widest shadow-lg shadow-rose-900/20"
              disabled={!(selectedScenario || customScenario) || loading}
              onClick={runSimulation}
            >
              {loading ? <Loader2 size={18} className="animate-spin mr-3" /> : <Zap size={18} className="mr-3 fill-current" />}
              Run Simulation
            </button>
          </CardContent>
        </div>

        {/* Results Overview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
            <CardTitle className="text-sm font-bold flex items-center text-white tracking-tight">
              <ShieldAlert className="mr-3 h-4 w-4 text-sky-400" />
              Impact Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!result ? (
              <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl opacity-40">
                 <Target size={48} className="text-slate-700 mb-4" />
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Awaiting Simulation Results</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <p className="text-[9px] text-rose-500 uppercase tracking-widest font-bold mb-1">Max Loss</p>
                    <p className="text-xl font-bold text-white tabular-nums">₹{Math.abs(result.total_impact).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <p className="text-[9px] text-amber-500 uppercase tracking-widest font-bold mb-1">Drawdown</p>
                    <p className="text-xl font-bold text-white tabular-nums">{result.impact_percentage}%</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <p className="text-[9px] text-sky-400 uppercase tracking-widest font-bold mb-1">Resilience</p>
                    <p className="text-xl font-bold text-white tabular-nums">{result.resilience_score}/100</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <p className="text-[9px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Recovery</p>
                    <p className="text-xl font-bold text-white tabular-nums">{result.recovery_estimate_years}Y</p>
                  </div>
                </div>

                <div className="h-[250px] w-full bg-slate-950 rounded-xl p-4 border border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.details} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="ticker" stroke="#475569" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(val) => val.split('.')[0]} />
                      <YAxis stroke="#475569" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}
                      />
                      <Bar dataKey="shock_percentage" name="Loss %" radius={[4, 4, 0, 0]} barSize={24}>
                        {result.details.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.shock_percentage < -40 ? '#f43f5e' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
             <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 size={14} className="text-sky-400" />
                  Sector Vulnerability Heatmap
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {result.sector_heatmap.map((s) => (
                    <div key={s.sector} className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden group">
                       <div className="absolute inset-x-0 bottom-0 bg-rose-500/10 transition-all" style={{ height: `${s.intensity * 10}%` }} />
                       <div className="relative z-10">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{s.sector}</span>
                         <p className="text-lg font-bold text-rose-500 tabular-nums">{s.loss_pct}%</p>
                       </div>
                    </div>
                  ))}
                </div>
             </CardContent>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
             <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
               <CardTitle className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert size={14} />
                 Adaptive Defense Strategy
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="flex gap-4 items-start">
                   <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500 font-bold text-xs">01</div>
                   <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                     Vulnerability Detected: <span className="text-rose-500 font-black underline decoration-rose-500/30 decoration-4 underline-offset-4">{result.sector_heatmap.reduce((prev, curr) => prev.loss_pct < curr.loss_pct ? prev : curr).sector}</span> sector is highly exposed.
                   </p>
                </div>
                <div className="flex gap-4 items-start">
                   <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500 font-bold text-xs">02</div>
                   <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                     Time Horizon: Portfolio requires <span className="text-sky-400 font-black underline decoration-sky-400/30 decoration-4 underline-offset-4">{result.recovery_estimate_years} Years</span> for organic recovery.
                   </p>
                </div>
             </CardContent>
           </div>

           <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
             <CardHeader className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Post-Shock Damage Log</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs">
                   <thead>
                     <tr className="bg-slate-950 text-slate-500">
                       <th className="py-4 px-6 font-bold uppercase tracking-widest border-b border-slate-800">Asset</th>
                       <th className="py-4 px-6 font-bold uppercase tracking-widest border-b border-slate-800 text-right">Pre-Shock</th>
                       <th className="py-4 px-6 font-bold uppercase tracking-widest border-b border-slate-800 text-right">Loss Vector</th>
                       <th className="py-4 px-6 font-bold uppercase tracking-widest border-b border-slate-800 text-right text-emerald-500">New Value</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                     {result.details.map((item) => (
                       <tr key={item.ticker} className="hover:bg-slate-800/50 transition-colors">
                         <td className="py-4 px-6">
                             <div className="flex items-center gap-3">
                               <div className="h-6 w-1 rounded-full bg-rose-500/50" />
                               <div>
                                 <span className="font-bold text-white uppercase tracking-tight">{item.ticker.split('.')[0]}</span>
                                 <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">{item.sector}</p>
                               </div>
                             </div>
                             {item.reason && (
                               <p className="mt-2 text-[9px] text-slate-500 font-medium uppercase leading-relaxed max-w-lg">
                                 <span className="text-rose-500/60 font-bold mr-1">Analysis:</span> {item.reason}
                               </p>
                             )}
                         </td>
                         <td className="py-4 px-6 text-right font-medium text-slate-500 tabular-nums">₹{item.original_value.toLocaleString()}</td>
                         <td className="py-4 px-6 text-right font-bold text-rose-500 tabular-nums">
                             <div className="flex flex-col items-end">
                                <span>-₹{Math.abs(item.simulated_loss).toLocaleString()}</span>
                                <span className="text-[9px] opacity-50">({item.shock_percentage}%)</span>
                             </div>
                         </td>
                         <td className="py-4 px-6 text-right font-bold text-white tabular-nums bg-slate-950/20">₹{item.new_value.toLocaleString()}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </CardContent>
           </div>
        </div>
      )}
    </div>
  );
}
