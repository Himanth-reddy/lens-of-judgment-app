import { LayoutGrid, Film, Sword, Heart, Laugh, Ghost, Rocket, Music, Drama } from "lucide-react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";

import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";
import movie7 from "@/assets/movie-7.jpg";
import movie8 from "@/assets/movie-8.jpg";
import { useState } from "react";

const genres = [
  { name: "All", icon: Film, color: "from-primary to-accent" },
  { name: "Action", icon: Sword, color: "from-primary to-meter-timepass" },
  { name: "Romance", icon: Heart, color: "from-accent to-meter-skip" },
  { name: "Comedy", icon: Laugh, color: "from-meter-timepass to-meter-goforit" },
  { name: "Horror", icon: Ghost, color: "from-meter-skip to-accent" },
  { name: "Sci-Fi", icon: Rocket, color: "from-teal to-accent" },
  { name: "Crime", icon: Drama, color: "from-primary to-meter-skip" },
  { name: "Animation", icon: Music, color: "from-meter-goforit to-teal" },
];

const allMovies = [
  { id: "shadow-protocol", title: "Shadow Protocol", image: movie1, tag: "New Movie", genre: "Action" },
  { id: "echoes-of-love", title: "Echoes of Love", image: movie2, tag: "New Movie", genre: "Romance" },
  { id: "neon-uprising", title: "Neon Uprising", image: movie3, tag: "New Movie", genre: "Sci-Fi" },
  { id: "the-hollow", title: "The Hollow", image: movie4, tag: "New Movie", genre: "Horror" },
  { id: "sky-realm", title: "Sky Realm", image: movie5, tag: "New Trailer", genre: "Animation" },
  { id: "blood-money", title: "Blood Money", image: movie6, tag: "New Episode", genre: "Crime" },
  { id: "double-trouble", title: "Double Trouble", image: movie7, tag: "New Movie", genre: "Action" },
  { id: "empires-fall", title: "Empire's Fall", image: movie8, tag: "New Season", genre: "Action" },
];

const CategoriesPage = () => {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? allMovies : allMovies.filter((m) => m.genre === active);

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
          {genres.map((genre, i) => {
            const Icon = genre.icon;
            const isActive = active === genre.name;
            return (
              <button
                key={genre.name}
                onClick={() => setActive(genre.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 animate-scale-in ${
                  isActive
                    ? `bg-gradient-to-r ${genre.color} text-primary-foreground shadow-lg`
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <Icon size={16} />
                {genre.name}
              </button>
            );
          })}
        </div>

        {/* Movies grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((movie, i) => (
            <div key={movie.id + active} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
              <MovieCard id={movie.id} title={movie.title} image={movie.image} tag={movie.tag} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
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
