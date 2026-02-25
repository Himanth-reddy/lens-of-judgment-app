import { Search } from "lucide-react";

const LOJLogo = ({ size = "default" }: { size?: "default" | "small" }) => {
  const iconSize = size === "small" ? 20 : 28;
  const textSize = size === "small" ? "text-xl" : "text-2xl";

  return (
    <div className="flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full group-hover:bg-primary/50 transition-all duration-500" />
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
          <Search className="text-primary-foreground" size={iconSize - 8} strokeWidth={3} />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-display ${textSize} tracking-[0.2em] bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent`}>
          LOJ
        </span>
        <span className="text-[9px] tracking-[0.15em] text-muted-foreground hidden sm:inline uppercase">
          Lens of Judgment
        </span>
      </div>
    </div>
  );
};

export default LOJLogo;
