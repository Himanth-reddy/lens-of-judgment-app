import { LayoutGrid, Film } from "lucide-react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { getTMDBImage } from "@/lib/tmdb";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: string;
  title: string;
  image: string;
  tag: string;
  rating?: number;
}

const CategoriesPage = () => {
  const [active, setActive] = useState<string>("All");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const genresRef = useRef<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get("/movies/genres");
        genresRef.current = response.data;
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let response;
        if (active === "All") {
          response = await api.get("/movies/popular");
        } else {
          const genre = genresRef.current.find((g) => g.name === active);
          if (genre) {
            response = await api.get("/movies/discover", { params: { genre: genre.id } });
          }
        }
        if (response) {
          const mapped = response.data.map((m: any) => ({
            id: m.id.toString(),
            title: m.title,
            image: getTMDBImage(m.poster_path, "w342"),
            tag: active === "All" ? "Popular" : active,
            rating: m.vote_average,
          }));
          setMovies(mapped);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [active]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <Header />

      <main className="container py-8">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="p-2 rounded-lg bg-primary/10">
            <LayoutGrid className="text-primary" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActive("All")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              active === "All"
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            <Film size={16} />
            All
          </button>
          {genres.map((genre, i) => {
            const isActive = active === genre.name;
            return (
              <button
                key={genre.id}
                onClick={() => setActive(genre.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 animate-scale-in ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                {genre.name}
              </button>
            );
          })}
        </div>

        {/* Movies grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground animate-fade-in">
            <p>Loading movies...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie, i) => (
              <div key={movie.id + active} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <MovieCard id={movie.id} title={movie.title} image={movie.image} tag={movie.tag} rating={movie.rating} />
              </div>
            ))}
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center py-20 text-muted-foreground animate-fade-in">
            <Film size={48} className="mx-auto mb-4 opacity-30" />
            <p>No movies found in this category</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoriesPage;
