import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SENTIMENT_COLORS = {
  positive: '#10b981',
  neutral: '#f59e0b',
  negative: '#ef4444',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-static px-4 py-3">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-xs text-white/60">
            <span className="capitalize">{p.name}</span>: <span className="font-mono text-white">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SentimentBarChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { sector: 'Technology', positive: 65, neutral: 20, negative: 15 },
    { sector: 'Healthcare', positive: 45, neutral: 35, negative: 20 },
    { sector: 'Finance', positive: 40, neutral: 30, negative: 30 },
    { sector: 'Energy', positive: 30, neutral: 25, negative: 45 },
    { sector: 'Consumer', positive: 55, neutral: 25, negative: 20 },
    { sector: 'Real Estate', positive: 35, neutral: 40, negative: 25 },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/80 mb-4">Sector Sentiment Analysis</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="sector"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="positive" stackId="a" fill={SENTIMENT_COLORS.positive} radius={[0, 0, 0, 0]} />
          <Bar dataKey="neutral" stackId="a" fill={SENTIMENT_COLORS.neutral} />
          <Bar dataKey="negative" stackId="a" fill={SENTIMENT_COLORS.negative} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4">
        {Object.entries(SENTIMENT_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-white/50 capitalize">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
