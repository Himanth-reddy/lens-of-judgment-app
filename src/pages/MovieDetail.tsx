import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import Header from "@/components/Header";
import RatingMeter from "@/components/RatingMeter";
import ReviewForm from "@/components/ReviewForm";

import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";
import movie7 from "@/assets/movie-7.jpg";
import movie8 from "@/assets/movie-8.jpg";

const movieData: Record<string, { title: string; image: string; genre: string; year: string }> = {
  "shadow-protocol": { title: "Shadow Protocol", image: movie1, genre: "Thriller", year: "2026" },
  "echoes-of-love": { title: "Echoes of Love", image: movie2, genre: "Romance", year: "2026" },
  "neon-uprising": { title: "Neon Uprising", image: movie3, genre: "Sci-Fi", year: "2026" },
  "the-hollow": { title: "The Hollow", image: movie4, genre: "Horror", year: "2026" },
  "sky-realm": { title: "Sky Realm", image: movie5, genre: "Animation", year: "2026" },
  "blood-money": { title: "Blood Money", image: movie6, genre: "Crime", year: "2026" },
  "double-trouble": { title: "Double Trouble", image: movie7, genre: "Action", year: "2026" },
  "empires-fall": { title: "Empire's Fall", image: movie8, genre: "Epic", year: "2026" },
};

const sampleReviews: { user: string; rating: string; text: string; likes: number }[] = [
  { user: "CinemaFan", rating: "Perfection", text: "Absolutely stunning! The cinematography alone makes it worth watching.", likes: 24 },
  { user: "MovieBuff", rating: "Go for it", text: "Solid movie with great performances. A few slow moments but overall enjoyable.", likes: 12 },
  { user: "CriticalEye", rating: "Timepass", text: "It's okay for a one-time watch. Nothing groundbreaking.", likes: 5 },
];

const ratingColorMap: Record<string, string> = {
  Perfection: "bg-accent text-accent-foreground",
  "Go for it": "bg-meter-goforit text-foreground",
  Timepass: "bg-meter-timepass text-background",
  Skip: "bg-meter-skip text-foreground",
};

type ReviewRating = "Skip" | "Timepass" | "Go for it" | "Perfection";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movie = movieData[id || ""];
  const [reviews, setReviews] = useState(sampleReviews);
  const [sortBy, setSortBy] = useState("Most Liked");

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Movie not found</h1>
          <Link to="/" className="text-primary mt-4 inline-block">Go back</Link>
        </div>
      </div>
    );
  }

  const breakdown = [
    { label: "Skip", value: 0, color: "hsl(var(--meter-skip))" },
    { label: "Timepass", value: 1, color: "hsl(var(--meter-timepass))" },
    { label: "Go for it", value: 16, color: "hsl(var(--meter-goforit))" },
    { label: "Perfection", value: 83, color: "hsl(var(--meter-perfection))" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 max-w-3xl mx-auto">
        {/* Movie Header */}
        <div className="flex gap-6 mb-8">
          <img src={movie.image} alt={movie.title} className="w-40 h-60 object-cover rounded-lg shadow-lg" />
          <div className="flex-1">
            <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-3">
              <ArrowLeft size={14} /> Back
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">{movie.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.genre}</span>
            </div>
          </div>
        </div>

        {/* LOJ Meter */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">LOJ Meter</h2>
            <button className="text-muted-foreground hover:text-foreground">
              <Share2 size={18} />
            </button>
          </div>
          <RatingMeter percentage={83} votes={2243} totalVotes={2707} breakdown={breakdown} />
        </section>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Reviews */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-secondary text-foreground text-sm rounded-md px-3 py-1.5 border border-border"
              >
                <option>Most Liked</option>
                <option>Latest</option>
              </select>
            </div>
          </div>

          {/* Review Form */}
          <div className="mb-6">
            <ReviewForm onSubmit={(rating, text) => {
              setReviews([{ user: "You", rating, text, likes: 0 }, ...reviews]);
            }} />
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <div key={i} className="bg-card rounded-xl p-5 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-semibold">
                      {review.user[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">@{review.user}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${ratingColorMap[review.rating]}`}>
                    {review.rating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  ♥ {review.likes} likes
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MovieDetail;
