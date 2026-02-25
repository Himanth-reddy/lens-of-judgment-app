import { useMemo } from "react";

interface RatingMeterProps {
  percentage: number;
  votes: number;
  totalVotes: number;
  breakdown: { label: string; value: number; color: string }[];
}

const RatingMeter = ({ percentage, votes, totalVotes, breakdown }: RatingMeterProps) => {
  const circumference = 2 * Math.PI * 80;
  const halfCircumference = circumference / 2;
  const strokeDashoffset = halfCircumference - (halfCircumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-64 h-36 overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Colored arcs based on breakdown */}
          {breakdown.map((item, i) => {
            const startAngle = breakdown.slice(0, i).reduce((acc, b) => acc + b.value, 0);
            const endAngle = startAngle + item.value;
            const startRad = (Math.PI * (180 - startAngle * 1.8)) / 180;
            const endRad = (Math.PI * (180 - endAngle * 1.8)) / 180;
            const x1 = 100 + 80 * Math.cos(startRad);
            const y1 = 100 - 80 * Math.sin(startRad);
            const x2 = 100 + 80 * Math.cos(endRad);
            const y2 = 100 - 80 * Math.sin(endRad);
            const largeArc = item.value > 50 ? 1 : 0;

            return (
              <path
                key={item.label}
                d={`M ${x1} ${y1} A 80 80 0 ${largeArc} 0 ${x2} ${y2}`}
                fill="none"
                stroke={item.color}
                strokeWidth="16"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            );
          })}
          {/* Center text */}
          <text x="100" y="75" textAnchor="middle" className="fill-accent font-display text-4xl" fontSize="36">
            {percentage}%
          </text>
          <text x="100" y="98" textAnchor="middle" className="fill-muted-foreground" fontSize="11">
            {votes}/{totalVotes} Votes
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm">
        {breakdown.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground">{item.label}</span>
            <span className="text-foreground font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingMeter;
