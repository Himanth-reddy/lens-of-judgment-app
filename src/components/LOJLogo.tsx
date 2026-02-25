import { Eye } from "lucide-react";

const LOJLogo = ({ size = "default" }: { size?: "default" | "small" }) => {
  const iconSize = size === "small" ? 20 : 28;
  const textSize = size === "small" ? "text-xl" : "text-2xl";

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Eye className="text-primary" size={iconSize} strokeWidth={2.5} />
        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
      </div>
      <span className={`font-display ${textSize} tracking-wider text-foreground`}>
        LOJ
      </span>
      <span className="text-xs text-muted-foreground hidden sm:inline">
        Lens of Judgment
      </span>
    </div>
  );
};

export default LOJLogo;
