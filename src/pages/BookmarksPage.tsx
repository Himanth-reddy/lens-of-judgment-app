import { Bookmark, Clock, Star, Trash2 } from "lucide-react";
import Header from "@/components/Header";

import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie7 from "@/assets/movie-7.jpg";

const bookmarkedMovies = [
  { id: "shadow-protocol", title: "Shadow Protocol", image: movie1, genre: "Thriller", rating: 83, addedDate: "2 days ago" },
  { id: "echoes-of-love", title: "Echoes of Love", image: movie2, genre: "Romance", rating: 76, addedDate: "5 days ago" },
  { id: "neon-uprising", title: "Neon Uprising", image: movie3, genre: "Sci-Fi", rating: 91, addedDate: "1 week ago" },
  { id: "sky-realm", title: "Sky Realm", image: movie5, genre: "Animation", rating: 88, addedDate: "2 weeks ago" },
  { id: "double-trouble", title: "Double Trouble", image: movie7, genre: "Action", rating: 72, addedDate: "3 weeks ago" },
];

const watchedMovies = [
  { id: "echoes-of-love", title: "Echoes of Love", image: movie2, genre: "Romance", yourRating: "Perfection", watchedDate: "Jan 15, 2026" },
  { id: "sky-realm", title: "Sky Realm", image: movie5, genre: "Animation", yourRating: "Go for it", watchedDate: "Jan 10, 2026" },
];

const ratingBadge: Record<string, string> = {
  Perfection: "bg-accent/20 text-accent",
  "Go for it": "bg-meter-goforit/20 text-meter-goforit",
  Timepass: "bg-meter-timepass/20 text-meter-timepass",
  Skip: "bg-meter-skip/20 text-meter-skip",
};

const BookmarksPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-20 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-4xl mx-auto">
        {/* Watchlist */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bookmark className="text-primary" size={20} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">My Watchlist</h1>
            <span className="text-sm text-muted-foreground">({bookmarkedMovies.length})</span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
          </div>

          <div className="space-y-3">
            {bookmarkedMovies.map((movie, i) => (
              <div
                key={movie.id}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
              >
                <img src={movie.image} alt={movie.title} className="w-14 h-20 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-medium group-hover:text-primary transition-colors">{movie.title}</h3>
                  <p className="text-xs text-muted-foreground">{movie.genre}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">{movie.rating}%</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{movie.addedDate}</span>
                <button className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Watched */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <section>
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="p-2 rounded-lg bg-meter-goforit/10">
              <Clock className="text-meter-goforit" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Already Watched</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-meter-goforit/30 to-transparent ml-2" />
          </div>

          <div className="space-y-3">
            {watchedMovies.map((movie, i) => (
              <div
                key={movie.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border animate-slide-up"
                style={{ animationDelay: `${0.4 + i * 0.06}s`, opacity: 0 }}
              >
                <img src={movie.image} alt={movie.title} className="w-14 h-20 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-medium">{movie.title}</h3>
                  <p className="text-xs text-muted-foreground">{movie.genre}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ratingBadge[movie.yourRating]}`}>
                  {movie.yourRating}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">{movie.watchedDate}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BookmarksPage;
