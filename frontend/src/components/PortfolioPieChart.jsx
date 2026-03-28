import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#6366f1'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-static px-4 py-3">
        <p className="text-sm font-medium text-white">{payload[0].name}</p>
        <p className="text-sm text-accent-teal font-mono">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function PortfolioPieChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { name: 'US Equities', value: 35 },
    { name: 'Int\'l Equities', value: 20 },
    { name: 'Bonds', value: 20 },
    { name: 'Real Estate', value: 10 },
    { name: 'Commodities', value: 8 },
    { name: 'Crypto', value: 5 },
    { name: 'Cash', value: 2 },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/80 mb-4">Portfolio Allocation</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            animationBegin={200}
            animationDuration={1000}
          >
            {chartData.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-white/60">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
