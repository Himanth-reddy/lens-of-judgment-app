import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  tag: string;
  rating?: number;
}

const tagColors: Record<string, string> = {
  "New Movie": "bg-primary/90 text-primary-foreground",
  "New Trailer": "bg-accent/90 text-accent-foreground",
  "New Episode": "bg-teal/90 text-primary-foreground",
  "New Season": "bg-meter-timepass/90 text-background",
};

const MovieCard = ({ id, title, image, tag, rating }: MovieCardProps) => {
  return (
    <Link to={`/movie/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-secondary">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Tag badge */}
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColors[tag] || "bg-secondary text-foreground"}`}>
            {tag}
          </span>
        </div>

        {/* Hover glow border */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300" />
        
        {/* Rating on hover */}
        {rating != null && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Star size={12} className="text-meter-timepass fill-meter-timepass" />
            <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">{title}</h3>
      <p className="text-xs text-muted-foreground">{tag}</p>
    </Link>
  );
};

export default MovieCard;
