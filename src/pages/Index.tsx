import { Flame, Heart, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import MostInterestedCard from "@/components/MostInterestedCard";

import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";
import movie7 from "@/assets/movie-7.jpg";
import movie8 from "@/assets/movie-8.jpg";

const movies = [
  { id: "shadow-protocol", title: "Shadow Protocol", image: movie1, tag: "New Movie" },
  { id: "echoes-of-love", title: "Echoes of Love", image: movie2, tag: "New Movie" },
  { id: "neon-uprising", title: "Neon Uprising", image: movie3, tag: "New Movie" },
  { id: "the-hollow", title: "The Hollow", image: movie4, tag: "New Movie" },
  { id: "sky-realm", title: "Sky Realm", image: movie5, tag: "New Trailer" },
  { id: "blood-money", title: "Blood Money", image: movie6, tag: "New Episode" },
  { id: "double-trouble", title: "Double Trouble", image: movie7, tag: "New Movie" },
  { id: "empires-fall", title: "Empire's Fall", image: movie8, tag: "New Season" },
];

const mostInterested = [
  { rank: 1, title: "Shadow Protocol", date: "20 Feb, 2026", status: "In Theatre", interested: 593, image: movie1 },
  { rank: 2, title: "Neon Uprising", date: "20 Feb, 2026", status: "In Theatre", interested: 391, image: movie3 },
  { rank: 3, title: "The Hollow", date: "25 Feb, 2026", status: "Streaming", interested: 284, image: movie4 },
];

const editorsPickMovies = movies.slice(0, 5);

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 right-0 w-64 h-64 bg-teal/5 rounded-full blur-[100px] pointer-events-none" />

      <Header />

      <main className="container py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Talk of the Town */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <div className="p-2 rounded-lg bg-primary/10 glow-primary">
                  <Flame className="text-primary" size={22} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Talk Of The Town</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.slice(0, 5).map((movie, i) => (
                  <div key={movie.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {movies.slice(5, 8).map((movie, i) => (
                  <div key={movie.id} className="animate-slide-up" style={{ animationDelay: `${(i + 5) * 0.08}s`, opacity: 0 }}>
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>
            </section>

            {/* Gradient Divider */}
            <div className="my-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Editor's Pick */}
            <section>
              <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <div className="p-2 rounded-lg bg-accent/10 glow-accent">
                  <Heart className="text-accent" size={22} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Editor's Pick Of The Week</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent ml-2" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {editorsPickMovies.map((movie, i) => (
                  <div key={movie.id + "-pick"} className="animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <TrendingUp className="text-primary" size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Most Interested</h3>
                </div>
                <select className="bg-secondary text-foreground text-xs rounded-md px-2 py-1 border border-border focus:border-primary/50 focus:outline-none transition-colors">
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="space-y-3">
                {mostInterested.map((item, i) => (
                  <div key={item.rank} className="animate-slide-up" style={{ animationDelay: `${0.4 + i * 0.1}s`, opacity: 0 }}>
                    <MostInterestedCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Index;
