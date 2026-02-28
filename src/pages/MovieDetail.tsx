import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Trash2, Pencil, Check, X, Heart } from "lucide-react";
import Header from "@/components/Header";
import RatingMeter from "@/components/RatingMeter";
import ReviewForm from "@/components/ReviewForm";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getTMDBImage } from "@/lib/tmdb";

const ratingColorMap: Record<string, string> = {
  Perfection: "bg-accent text-accent-foreground",
  "Go for it": "bg-meter-goforit text-foreground",
  Timepass: "bg-meter-timepass text-background",
  Skip: "bg-meter-skip text-foreground",
};

const ratingColorValues: Record<string, string> = {
  Skip: "hsl(var(--meter-skip))",
  Timepass: "hsl(var(--meter-timepass))",
  "Go for it": "hsl(var(--meter-goforit))",
  Perfection: "hsl(var(--meter-perfection))",
};

const ratingLabels = ["Skip", "Timepass", "Go for it", "Perfection"];

interface Review {
  _id?: string;
  user: string;
  rating: string;
  text: string;
  likes: number;
  likedBy?: string[];
  createdAt?: string;
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

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type Rating = "Skip" | "Timepass" | "Go for it" | "Perfection";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Most Liked");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<Rating>("Skip");
  const [editText, setEditText] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const hasUserReviewed = user ? reviews.some((r) => r.user === user.username) : false;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const movieRes = await api.get(`/movies/${id}`);
        setMovie({
          title: movieRes.data.title,
          image: getTMDBImage(movieRes.data.poster_path, "w342"),
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
    if (hasUserReviewed) {
      toast({
        title: "Duplicate review",
        description: "You have already reviewed this movie",
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
      const res = await api.post("/reviews", newReview);
      setReviews((prevReviews) => [res.data, ...prevReviews]);
      toast({
        title: "Review posted",
        description: "Thanks for sharing your thoughts!",
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to post review. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;
    try {
      await api.delete(`/reviews/${reviewId}`, { data: { user: user.username } });
      setReviews((prevReviews) => prevReviews.filter((r) => r._id !== reviewId));
      toast({
        title: "Review deleted",
        description: "Your review has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    }
  };

  const startEditReview = (review: Review) => {
    if (!review._id) return;
    setEditingReviewId(review._id);
    setEditRating(review.rating as Rating);
    setEditText(review.text);
  };

  const cancelEditReview = () => {
    setEditingReviewId(null);
    setEditRating("Skip");
    setEditText("");
  };

  const handleEditReview = async (reviewId: string) => {
    if (!user) return;
    try {
      const res = await api.put(`/reviews/${reviewId}`, {
        user: user.username,
        rating: editRating,
        text: editText,
      });
      setReviews((prevReviews) =>
        prevReviews.map((r) => (r._id === reviewId ? { ...r, rating: res.data.rating, text: res.data.text } : r))
      );
      setEditingReviewId(null);
      toast({
        title: "Review updated",
        description: "Your review has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review.",
        variant: "destructive",
      });
    }
  };

  const handleLikeReview = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like a review",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await api.post(`/reviews/${reviewId}/like`, { user: user.username });
      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r._id === reviewId ? { ...r, likes: res.data.likes, likedBy: res.data.likedBy } : r
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like review.",
        variant: "destructive",
      });
    }
  };

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortBy === "Most Liked") {
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === "Latest") {
      sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return sorted;
  }, [reviews, sortBy]);

  const { breakdown, totalVotes, dominantFeeling, dominantPercentage } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of reviews) {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    }
    const total = reviews.length;
    const bd = ratingLabels.map((label) => ({
      label,
      value: total > 0 ? Math.round(((counts[label] || 0) / total) * 100) : 0,
      color: ratingColorValues[label],
    }));
    const dominant = bd.length > 0
      ? bd.reduce((max, item) => (item.value > max.value ? item : max), bd[0])
      : null;
    return {
      breakdown: bd,
      totalVotes: total,
      dominantFeeling: total > 0 && dominant ? dominant.label : "",
      dominantPercentage: total > 0 && dominant ? dominant.value : 0,
    };
  }, [reviews]);

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
          <RatingMeter dominantFeeling={dominantFeeling} dominantPercentage={dominantPercentage} totalVotes={totalVotes} breakdown={breakdown} />
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
            {hasUserReviewed ? (
              <div className="bg-card rounded-xl p-6 border border-border text-center text-muted-foreground">
                <p className="text-sm">You have already reviewed this movie.</p>
              </div>
            ) : (
              <ReviewForm onSubmit={handleReviewSubmit} username={user?.username} />
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {sortedReviews.map((review, i) => (
              <div key={review._id || i} className="bg-card rounded-xl p-5 border border-border">
                {editingReviewId === review._id ? (
                  /* Edit mode */
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-semibold">
                          {(review.user && review.user[0]) ? review.user[0].toUpperCase() : "?"}
                        </div>
                        <span className="text-sm font-medium text-foreground">@{review.user}</span>
                      </div>
                      <button
                        onClick={cancelEditReview}
                        className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        aria-label="Cancel edit"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(["Skip", "Timepass", "Go for it", "Perfection"] as Rating[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => setEditRating(r)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                            editRating === r
                              ? ratingColorMap[r] || "bg-secondary"
                              : "bg-secondary text-muted-foreground border-transparent hover:text-foreground"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      maxLength={1000}
                      className="w-full bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none py-2 min-h-[60px] text-sm"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{editText.length}/1000</span>
                      <button
                        onClick={() => review._id && handleEditReview(review._id)}
                        disabled={!editRating || !editText.trim()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        <Check size={12} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-semibold">
                          {(review.user && review.user[0]) ? review.user[0].toUpperCase() : "?"}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">@{review.user}</span>
                          {review.createdAt && (
                            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${ratingColorMap[review.rating] || "bg-secondary"}`}>
                          {review.rating}
                        </span>
                        {user && user.username === review.user && review._id && (
                          <>
                            <button
                              onClick={() => startEditReview(review)}
                              className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              aria-label="Edit review"
                            >
                              <Pencil size={14} />
                            </button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  aria-label="Delete review"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your review.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => review._id && handleDeleteReview(review._id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                    <div className="mt-3 flex items-center gap-1">
                      <button
                        onClick={() => review._id && handleLikeReview(review._id)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Like review"
                      >
                        <Heart
                          size={14}
                          className={
                            user && review.likedBy?.includes(user.username)
                              ? "fill-primary text-primary"
                              : ""
                          }
                        />
                        {review.likes || 0} likes
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MovieDetail;
