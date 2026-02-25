import { Link } from "react-router-dom";

interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  tag: string;
}

const MovieCard = ({ id, title, image, tag }: MovieCardProps) => {
  return (
    <Link to={`/movie/${id}`} className="group block animate-fade-in">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-secondary">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-foreground truncate">{title}</h3>
      <p className="text-xs text-muted-foreground">{tag}</p>
    </Link>
  );
};

export default MovieCard;
