import { Flame, Heart } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Talk of the Town */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Flame className="text-primary" size={22} />
                <h2 className="text-xl font-semibold text-foreground">Talk Of The Town</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.slice(0, 5).map((movie, i) => (
                  <div key={movie.id} style={{ animationDelay: `${i * 0.1}s` }}>
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {movies.slice(5, 8).map((movie, i) => (
                  <div key={movie.id} style={{ animationDelay: `${(i + 5) * 0.1}s` }}>
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-border my-8" />

            {/* Editor's Pick */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Heart className="text-primary" size={22} />
                <h2 className="text-xl font-semibold text-foreground">Editor's Pick Of The Week</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {editorsPickMovies.map((movie, i) => (
                  <div key={movie.id + "-pick"} style={{ animationDelay: `${i * 0.1}s` }}>
                    <MovieCard {...movie} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="text-primary" size={18} />
                  <h3 className="text-lg font-semibold text-foreground">Most Interested</h3>
                </div>
                <select className="bg-secondary text-foreground text-xs rounded-md px-2 py-1 border border-border">
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="space-y-3">
                {mostInterested.map((item) => (
                  <MostInterestedCard key={item.rank} item={item} />
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
