import { Flame } from "lucide-react";

interface MostInterestedItem {
  rank: number;
  title: string;
  date: string;
  status: string;
  interested: number;
  image: string;
}

const rankGradients = [
  "from-primary to-accent",
  "from-accent to-teal",
  "from-teal to-primary",
];

const MostInterestedCard = ({ item }: { item: MostInterestedItem }) => (
  <div className="group flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/40 hover:bg-card/80 transition-all duration-300 hover:translate-x-1">
    <span className={`font-display text-3xl w-8 bg-gradient-to-b ${rankGradients[(item.rank - 1) % 3]} bg-clip-text text-transparent`}>
      {item.rank}
    </span>
    <img
      src={item.image}
      alt={item.title}
      className="w-12 h-16 object-cover rounded transition-transform duration-300 group-hover:scale-105"
    />
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{item.title}</h4>
      <p className="text-xs text-muted-foreground">{item.date} • {item.status}</p>
      <div className="flex items-center gap-1 mt-1">
        <Flame size={12} className="text-primary animate-glow-pulse" />
        <span className="text-xs text-primary font-medium">{item.interested} Interested</span>
      </div>
    </div>
  </div>
);

export default MostInterestedCard;
