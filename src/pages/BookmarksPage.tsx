import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkX, CheckCircle2, Clock, Film } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { getTMDBImage } from "@/lib/tmdb";

type BookmarkStatus = "watchlist" | "watched";

interface BookmarkItem {
  movieId: string;
  status: BookmarkStatus;
  addedAt?: string;
}

interface MovieDetails {
  id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
}

const formatYear = (dateString?: string) => {
  if (!dateString) return "Unknown year";
  return dateString.split("-")[0];
};

const BookmarksPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [movieMap, setMovieMap] = useState<Record<string, MovieDetails>>({});

  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      setMovieMap({});
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/bookmarks");
      const nextBookmarks: BookmarkItem[] = (data || []).map((item: any) => ({
        movieId: item.movieId,
        status: item.status,
        addedAt: item.addedAt,
      }));
      setBookmarks(nextBookmarks);

      const uniqueMovieIds = [...new Set(nextBookmarks.map((item) => item.movieId))];
      const detailsEntries = await Promise.all(
        uniqueMovieIds.map(async (movieId) => {
          try {
            const res = await api.get(`/movies/${movieId}`);
            return [movieId, res.data] as const;
          } catch {
            return [movieId, null] as const;
          }
        })
      );

      const nextMovieMap: Record<string, MovieDetails> = {};
      for (const [movieId, details] of detailsEntries) {
        if (details) {
          nextMovieMap[movieId] = details;
        }
      }
      setMovieMap(nextMovieMap);
    } catch (error) {
      toast({
        title: "Failed to load bookmarks",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user?.username]);

  const watchlist = useMemo(
    () => bookmarks.filter((item) => item.status === "watchlist"),
    [bookmarks]
  );
  const watched = useMemo(
    () => bookmarks.filter((item) => item.status === "watched"),
    [bookmarks]
  );

  const updateStatus = async (movieId: string, status: BookmarkStatus) => {
    try {
      const { data } = await api.put(`/bookmarks/${movieId}`, { status });
      setBookmarks(data.bookmarks || []);
      toast({ title: status === "watched" ? "Moved to Watched" : "Moved to Watchlist" });
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Could not update bookmark status.",
        variant: "destructive",
      });
    }
  };

  const removeBookmark = async (movieId: string) => {
    try {
      const { data } = await api.delete(`/bookmarks/${movieId}`);
      setBookmarks(data.bookmarks || []);
      toast({ title: "Removed from bookmarks" });
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Could not remove bookmark.",
        variant: "destructive",
      });
    }
  };

  const renderGrid = (items: BookmarkItem[], isWatchedSection: boolean) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-16 text-muted-foreground animate-fade-in">
          {isWatchedSection ? <Clock size={48} className="mx-auto mb-4 opacity-30" /> : <Film size={48} className="mx-auto mb-4 opacity-30" />}
          <p className="text-lg font-medium mb-1">{isWatchedSection ? "No watched movies yet" : "Your watchlist is empty"}</p>
          <p className="text-sm">
            {isWatchedSection
              ? "Movies you mark as watched will appear here."
              : "Browse movies and add them to your watchlist to keep track of what you want to watch."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const details = movieMap[item.movieId];
          const title = details?.title || `Movie #${item.movieId}`;
          const poster = getTMDBImage(details?.poster_path, "w342");
          const rating = details?.vote_average ? details.vote_average.toFixed(1) : "N/A";
          const year = formatYear(details?.release_date);

          return (
            <div key={`${item.movieId}-${item.status}`} className="bg-card border border-border rounded-xl p-3">
              <Link to={`/movie/${item.movieId}`} className="flex gap-3 group">
                <img
                  src={poster}
                  alt={title}
                  className="w-16 h-24 rounded-md object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{year}</p>
                  <p className="text-xs text-muted-foreground mt-1">TMDB: {rating}</p>
                </div>
              </Link>
              <div className="flex flex-wrap gap-2 mt-3">
                {isWatchedSection ? (
                  <button
                    onClick={() => updateStatus(item.movieId, "watchlist")}
                    className="text-xs px-2.5 py-1.5 rounded-full bg-secondary text-foreground hover:bg-secondary/80"
                  >
                    Move to Watchlist
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(item.movieId, "watched")}
                    className="text-xs px-2.5 py-1.5 rounded-full bg-meter-goforit/20 text-meter-goforit hover:bg-meter-goforit/30"
                  >
                    Mark Watched
                  </button>
                )}
                <button
                  onClick={() => removeBookmark(item.movieId)}
                  className="text-xs px-2.5 py-1.5 rounded-full bg-destructive/15 text-destructive hover:bg-destructive/25"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-20 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-5xl mx-auto">
        {!user ? (
          <div className="text-center py-24 text-muted-foreground">
            <Bookmark size={52} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium text-foreground mb-2">Sign in to manage your bookmarks</p>
            <Link to="/auth" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm">
              Go to Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading bookmarks...</div>
        ) : (
          <>
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bookmark className="text-primary" size={20} />
                </div>
                <h1 className="text-2xl font-bold text-foreground">My Watchlist</h1>
                <span className="text-sm text-muted-foreground">({watchlist.length})</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
              </div>
              {renderGrid(watchlist, false)}
            </section>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <section>
              <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <div className="p-2 rounded-lg bg-meter-goforit/10">
                  <CheckCircle2 className="text-meter-goforit" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Already Watched</h2>
                <span className="text-sm text-muted-foreground">({watched.length})</span>
                <div className="flex-1 h-px bg-gradient-to-r from-meter-goforit/30 to-transparent ml-2" />
              </div>
              {renderGrid(watched, true)}
            </section>

            {bookmarks.length > 0 && (
              <div className="mt-8 text-xs text-muted-foreground flex items-center gap-2">
                <BookmarkX size={14} />
                Tip: use "Mark Watched" to move movies between sections.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BookmarksPage;
