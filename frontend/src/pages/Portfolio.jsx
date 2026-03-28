import { useState } from 'react';
import usePortfolio from '../hooks/usePortfolio';
import PortfolioPieChart from '../components/PortfolioPieChart';
import RiskGauge from '../components/RiskGauge';
import { Loader2, Plus, RefreshCw, Layers } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Portfolio() {
  const { portfolios, loading, generatePortfolio } = usePortfolio();
  const [params, setParams] = useState({
    investment_amount: 10000,
    risk_level: 'moderate',
    investment_duration: 10
  });
  const [generating, setGenerating] = useState(false);

  // Use the latest portfolio for display if available
  const activePortfolio = portfolios[0];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await generatePortfolio(params);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Generator</h1>
          <p className="text-white/50">AI-optimized asset allocation based on your risk profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
             <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent-teal" />
                Parameters
             </h3>

             <form onSubmit={handleGenerate} className="space-y-5">
               <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                     Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    name="investment_amount"
                    value={params.investment_amount}
                    onChange={handleChange}
                    min="1000"
                    step="1000"
                    className="input-glass"
                    required
                  />
               </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                     Risk Tolerance
                  </label>
                  <select
                    name="risk_level"
                    value={params.risk_level}
                    onChange={handleChange}
                    className="input-glass appearance-none"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
               </div>

               <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                     Time Horizon (Years)
                  </label>
                  <input
                    type="number"
                    name="investment_duration"
                    value={params.investment_duration}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    className="input-glass"
                    required
                  />
               </div>

               <button
                  type="submit"
                  disabled={generating}
                  className="btn-gradient w-full flex items-center justify-center mt-4"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate Portfolio
                    </>
                  )}
                </button>
             </form>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-6">
          {activePortfolio ? (
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RiskGauge score={activePortfolio.risk_score || 50} />
                  <div className="glass-card p-6 flex flex-col justify-center items-center">
                    <h3 className="text-sm font-semibold text-white/80 border-b border-white/10 pb-4 w-full text-center mb-6">Generated Metadata</h3>
                    
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                            <span className="text-white/60 text-sm">Total Value</span>
                            <span className="text-white font-mono font-bold text-lg">{formatCurrency(activePortfolio.investment_amount || params.investment_amount)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                            <span className="text-white/60 text-sm">Time Horizon</span>
                            <span className="text-white font-mono">{activePortfolio.investment_duration || params.investment_duration} Years</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                            <span className="text-white/60 text-sm">Created</span>
                            <span className="text-white font-mono">{formatDate(activePortfolio.created_at)}</span>
                        </div>
                    </div>
                  </div>
               </div>
               
               {/* Extract allocation array for chart */}
               <PortfolioPieChart data={
                  activePortfolio.allocation_json?.allocations || 
                  Object.entries(activePortfolio.allocation_json || {}).map(([name, value]) => ({ name, value }))
               } />
            </>
          ) : (
             <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                   <Plus className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Portfolio Generated Yet</h3>
                <p className="text-sm text-white/50 max-w-sm">
                   Set your parameters on the left and click 'Generate Portfolio' to evaluate AI-optimized asset allocation strategies.
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
