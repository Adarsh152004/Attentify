import { useMemo } from 'react';

export default function RiskGauge({ score = 45 }) {
  const { label, color, rotation } = useMemo(() => {
    const s = Math.max(0, Math.min(100, score));
    const rot = -90 + (s / 100) * 180;
    let lbl, clr;
    if (s <= 30) { lbl = 'Low Risk'; clr = '#10b981'; }
    else if (s <= 60) { lbl = 'Moderate'; clr = '#f59e0b'; }
    else if (s <= 80) { lbl = 'High Risk'; clr = '#f97316'; }
    else { lbl = 'Very High'; clr = '#ef4444'; }
    return { label: lbl, color: clr, rotation: rot };
  }, [score]);

  const circumference = Math.PI * 80;
  const progress = (score / 100) * circumference;

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/80 mb-4">Risk Score</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-28 overflow-hidden">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
            />
            {/* Center text */}
            <text x="100" y="85" textAnchor="middle" className="text-3xl font-bold" fill="white" fontSize="32" fontFamily="Inter">
              {score}
            </text>
            <text x="100" y="105" textAnchor="middle" fill={color} fontSize="12" fontFamily="Inter" fontWeight="600">
              {label}
            </text>
          </svg>
        </div>
        <div className="flex justify-between w-full mt-3 px-4">
          <span className="text-[10px] text-green-400 font-medium">LOW</span>
          <span className="text-[10px] text-yellow-400 font-medium">MED</span>
          <span className="text-[10px] text-red-400 font-medium">HIGH</span>
        </div>
      </div>
    </div>
  );
}
