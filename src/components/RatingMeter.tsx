interface RatingMeterProps {
  dominantFeeling: string;
  dominantPercentage: number;
  totalVotes: number;
  breakdown: { label: string; value: number; color: string }[];
}

const RatingMeter = ({ dominantFeeling, dominantPercentage, totalVotes, breakdown }: RatingMeterProps) => {
  const dominantColor = breakdown.find((b) => b.label === dominantFeeling)?.color || "hsl(var(--accent))";

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
            if (item.value === 0) return null;
            const startAngle = breakdown.slice(0, i).reduce((acc, b) => acc + b.value, 0);
            const endAngle = startAngle + item.value;
            const startRad = (Math.PI * (180 - startAngle * 1.8)) / 180;
            const endRad = (Math.PI * (180 - endAngle * 1.8)) / 180;
            const x1 = 100 + 80 * Math.cos(startRad);
            const y1 = 100 - 80 * Math.sin(startRad);
            const x2 = 100 + 80 * Math.cos(endRad);
            const y2 = 100 - 80 * Math.sin(endRad);

            return (
              <path
                key={item.label}
                d={`M ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={item.color}
                strokeWidth="16"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            );
          })}
          {/* Center text — dominant feeling */}
          <text x="100" y="70" textAnchor="middle" className="font-display" fontSize="22" fill={dominantColor}>
            {dominantFeeling || "No Votes"}
          </text>
          <text x="100" y="98" textAnchor="middle" className="fill-muted-foreground" fontSize="11">
            {totalVotes > 0 ? `${dominantPercentage}% · ${totalVotes} vote${totalVotes !== 1 ? "s" : ""}` : "Be the first to rate"}
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
