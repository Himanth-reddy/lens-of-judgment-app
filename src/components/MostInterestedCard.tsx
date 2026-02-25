import { Flame } from "lucide-react";

interface MostInterestedItem {
  rank: number;
  title: string;
  date: string;
  status: string;
  interested: number;
  image: string;
}

const MostInterestedCard = ({ item }: { item: MostInterestedItem }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
    <span className="font-display text-3xl text-primary w-8">{item.rank}</span>
    <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded" />
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-foreground truncate">{item.title}</h4>
      <p className="text-xs text-muted-foreground">{item.date} • {item.status}</p>
      <div className="flex items-center gap-1 mt-1">
        <Flame size={12} className="text-primary" />
        <span className="text-xs text-primary font-medium">{item.interested} Interested</span>
      </div>
    </div>
  </div>
);

export default MostInterestedCard;
