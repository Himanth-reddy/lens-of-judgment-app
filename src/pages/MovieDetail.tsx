import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import Header from "@/components/Header";
import RatingMeter from "@/components/RatingMeter";
import ReviewForm from "@/components/ReviewForm";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

interface Movie {
  title: string;
  image: string;
  genre: string;
  year: string;
}

interface Genre {
  name: string;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Most Liked");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const movieRes = await api.get(`/movies/${id}`);
        setMovie({
          title: movieRes.data.title,
          image: movieRes.data.poster_path ? `https://image.tmdb.org/t/p/w500${movieRes.data.poster_path}` : "https://placehold.co/200x300?text=No+Image",
          genre: movieRes.data.genres?.map((g: Genre) => g.name).join(", ") || "Unknown",
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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a review",
        variant: "destructive",
      });
      return;
    }
    try {
      const newReview = {
        movieId: id,
        user: user.username,
        rating,
        text,
      };
      await api.post("/reviews", newReview);
      setReviews((prevReviews) => [{ ...newReview, likes: 0 }, ...prevReviews]);
      toast({
        title: "Review posted",
        description: "Thanks for sharing your thoughts!",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to post review. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 max-w-3xl mx-auto">
          {/* Skeleton Header */}
          <div className="flex gap-6 mb-8">
            <Skeleton className="w-40 h-60 rounded-lg" />
            <div className="flex-1 space-y-4 py-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>

          {/* Skeleton Meter */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
          </section>

          <Skeleton className="h-px w-full my-8" />

          {/* Skeleton Reviews */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-40 mb-6" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </main>
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

  const ratingLabels = ["Skip", "Timepass", "Go for it", "Perfection"];

  const breakdown = ratingLabels.map((label) => {
    const count = reviews.filter((r) => r.rating === label).length;
    const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    const colorMap: Record<string, string> = {
      Skip: "hsl(var(--meter-skip))",
      Timepass: "hsl(var(--meter-timepass))",
      "Go for it": "hsl(var(--meter-goforit))",
      Perfection: "hsl(var(--meter-perfection))",
    };
    return { label, value: percentage, color: colorMap[label] };
  });

  const totalVotes = reviews.length;
  const perfectionVotes = reviews.filter((r) => r.rating === "Perfection").length;
  const goForItVotes = reviews.filter((r) => r.rating === "Go for it").length;
  const positiveVotes = perfectionVotes + goForItVotes;
  const percentage = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 max-w-3xl mx-auto">
        {/* Movie Header */}
        <div className="flex gap-6 mb-8">
          <img src={movie.image} alt={movie.title} className="w-40 h-60 object-cover rounded-lg shadow-lg" />
          <div className="flex-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-3"
              aria-label="Go back"
            >
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
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary/50 transition-colors"
                  aria-label="Share this movie"
                >
                  <Share2 size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this movie</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <RatingMeter percentage={percentage} votes={positiveVotes} totalVotes={totalVotes} breakdown={breakdown} />
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
                aria-label="Sort reviews by"
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
