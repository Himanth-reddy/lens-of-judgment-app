import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import Header from "@/components/Header";
import RatingMeter from "@/components/RatingMeter";
import ReviewForm from "@/components/ReviewForm";
import api from "@/lib/api";

const ratingColorMap: Record<string, string> = {
  Perfection: "bg-accent text-accent-foreground",
  "Go for it": "bg-meter-goforit text-foreground",
  Timepass: "bg-meter-timepass text-background",
  Skip: "bg-meter-skip text-foreground",
};

interface Review {
  user: string;
  rating: string;
  text: string;
  likes: number;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Most Liked");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const movieRes = await api.get(`/movies/${id}`);
        setMovie({
          title: movieRes.data.title,
          image: `https://image.tmdb.org/t/p/w500${movieRes.data.poster_path}`,
          genre: movieRes.data.genres?.map((g: any) => g.name).join(", ") || "Unknown",
          year: movieRes.data.release_date?.split("-")[0] || "Unknown",
        });

        const reviewsRes = await api.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewSubmit = async (rating: string, text: string) => {
    if (!id) return;
    try {
      const newReview = {
        movieId: id,
        user: "You", // Hardcoded user for now
        rating,
        text,
      };
      await api.post("/reviews", newReview);
      setReviews([{ ...newReview, likes: 0 }, ...reviews]);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) {
     return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
            <ReviewForm onSubmit={handleReviewSubmit} />
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <div key={i} className="bg-card rounded-xl p-5 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-semibold">
                      {(review.user && review.user[0]) ? review.user[0].toUpperCase() : "?"}
                    </div>
                    <span className="text-sm font-medium text-foreground">@{review.user}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${ratingColorMap[review.rating] || "bg-secondary"}`}>
                    {review.rating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  ♥ {review.likes || 0} likes
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
