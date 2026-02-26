import { Search, TrendingUp, Clock, X } from "lucide-react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing recent searches from localStorage:", e);
        setRecentSearches([]);
      }
    }

    const fetchTrending = async () => {
      try {
        const response = await api.get("/movies/trending");
        setTrendingMovies(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching trending:", error);
      }
    };
    fetchTrending();
  }, []);

  const addRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearch = (term: string) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (query.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get("/movies/search", {
          params: { query },
          signal: abortControllerRef.current.signal
        });
        const movies = response.data.map((m: any) => ({
          id: m.id.toString(),
          title: m.title,
          image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://placehold.co/200x300?text=No+Image",
          tag: "Result",
          rating: m.vote_average,
        }));
        setResults(movies);
        if (query.trim() && movies.length > 0) {
          addRecentSearch(query.trim());
        }
      } catch (error: any) {
        if (error.name !== 'CanceledError') {
             console.error("Error searching movies:", error);
        }
      } finally {
        if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
             setLoading(false);
        }
      }
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => {
        clearTimeout(debounce);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-1/2 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-3xl mx-auto">
        {/* Search bar */}
        <div className="relative mb-8 animate-fade-in">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies, series, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-12 pr-12 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-lg"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Results */}
        {query.length > 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {loading ? "Searching..." : `${results.length} results for "${query}"`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {results.map((movie, i) => (
                <div key={movie.id} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <MovieCard {...movie} />
                </div>
              ))}
            </div>
            {!loading && results.length === 0 && (
              <div className="text-center py-16 text-muted-foreground animate-fade-in">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>No results found for "{query}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Trending */}
            <section className="animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Trending</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingMovies.map((m: any) => (
                  <button
                    key={m.id}
                    onClick={() => setQuery(m.title)}
                    className="px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
                  >
                    {m.title}
                  </button>
                ))}
              </div>
            </section>

            {/* Recent */}
            {recentSearches.length > 0 && (
              <section className="animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent Searches</h2>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((s) => (
                    <div key={s} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200">
                      <button
                        onClick={() => setQuery(s)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <Clock size={14} className="opacity-40" />
                        {s}
                      </button>
                      <button
                        onClick={() => clearRecentSearch(s)}
                        className="text-muted-foreground hover:text-foreground p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
