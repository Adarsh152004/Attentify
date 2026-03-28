import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const sentimentConfig = {
  positive: { icon: TrendingUp, class: 'badge-positive', color: 'text-green-400' },
  neutral: { icon: Minus, class: 'badge-neutral', color: 'text-yellow-400' },
  negative: { icon: TrendingDown, class: 'badge-negative', color: 'text-red-400' },
};

export default function NewsFeed({ news = [] }) {
  const displayNews = news.length > 0 ? news : [
    { id: 1, title: 'Fed Signals Rate Cut Amid Cooling Inflation Data', sentiment: 'positive', source: 'Bloomberg', created_at: new Date().toISOString() },
    { id: 2, title: 'Tech Stocks Rally on Strong Earnings Reports', sentiment: 'positive', source: 'Reuters', created_at: new Date().toISOString() },
    { id: 3, title: 'Oil Prices Stabilize After Middle East Tensions Ease', sentiment: 'neutral', source: 'CNBC', created_at: new Date().toISOString() },
    { id: 4, title: 'Banking Sector Faces Headwinds from Regulatory Changes', sentiment: 'negative', source: 'FT', created_at: new Date().toISOString() },
    { id: 5, title: 'Cryptocurrency Markets Show Mixed Signals This Week', sentiment: 'neutral', source: 'CoinDesk', created_at: new Date().toISOString() },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/80">Recent Financial News</h3>
        <span className="text-[10px] text-white/30 uppercase tracking-wider">Live Feed</span>
      </div>
      <div className="space-y-3">
        {displayNews.map((item) => {
          const config = sentimentConfig[item.sentiment] || sentimentConfig.neutral;
          const Icon = config.icon;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors group cursor-pointer"
            >
              <div className={`p-1.5 rounded-md bg-white/5 ${config.color} flex-shrink-0 mt-0.5`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 leading-snug group-hover:text-white transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-white/30">{item.source}</span>
                  <span className="text-[10px] text-white/20">•</span>
                  <span className="text-[10px] text-white/30">{formatDate(item.created_at)}</span>
                  <span className={config.class}>{item.sentiment}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
