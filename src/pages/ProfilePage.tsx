import { User, Settings, Star, MessageSquare, Bookmark, Heart, LogOut, Edit2 } from "lucide-react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";

import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie5 from "@/assets/movie-5.jpg";
import { useState } from "react";

const tabs = ["Reviews", "Watchlist", "Liked"];

const userReviews = [
  { movie: "Shadow Protocol", image: movie1, rating: "Perfection", text: "Absolutely stunning! The cinematography alone makes it worth watching.", likes: 24, date: "Feb 20, 2026" },
  { movie: "Neon Uprising", image: movie3, rating: "Go for it", text: "Great visuals but the story could be tighter. Still a solid watch.", likes: 15, date: "Feb 18, 2026" },
];

const watchlist = [
  { id: "echoes-of-love", title: "Echoes of Love", image: movie2, tag: "New Movie" },
  { id: "sky-realm", title: "Sky Realm", image: movie5, tag: "New Trailer" },
];

const liked = [
  { id: "shadow-protocol", title: "Shadow Protocol", image: movie1, tag: "New Movie" },
  { id: "neon-uprising", title: "Neon Uprising", image: movie3, tag: "New Movie" },
  { id: "sky-realm", title: "Sky Realm", image: movie5, tag: "New Trailer" },
];

const ratingBadge: Record<string, string> = {
  Perfection: "bg-accent/20 text-accent",
  "Go for it": "bg-meter-goforit/20 text-meter-goforit",
  Timepass: "bg-meter-timepass/20 text-meter-timepass",
  Skip: "bg-meter-skip/20 text-meter-skip",
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Reviews");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-teal flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
              U
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/50 transition-colors">
              <Edit2 size={12} className="text-muted-foreground" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-foreground">User</h1>
          <p className="text-muted-foreground text-sm">@user</p>

          <div className="flex items-center justify-center gap-8 mt-6">
            <Stat label="Reviews" value="12" />
            <Stat label="Followers" value="234" />
            <Stat label="Following" value="89" />
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Edit Profile
            </button>
            <button className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              <Settings size={16} />
            </button>
            <button className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Reviews" && (
          <div className="space-y-4">
            {userReviews.map((review, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-xl bg-card border border-border animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
              >
                <img src={review.image} alt={review.movie} className="w-16 h-24 object-cover rounded-lg shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{review.movie}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ratingBadge[review.rating]}`}>
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.text}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart size={12} /> {review.likes}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Watchlist" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {watchlist.map((movie, i) => (
              <div key={movie.id} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <MovieCard {...movie} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "Liked" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {liked.map((movie, i) => (
              <div key={movie.id} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <MovieCard {...movie} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <p className="text-xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default ProfilePage;
