import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Star, TrendingUp, Users } from "lucide-react";
import Header from "@/components/Header";
import api from "@/lib/api";

interface TopReviewer {
  _id: string;
  reviewsCount: number;
  likesReceived: number;
  score: number;
}

interface CommunityReview {
  _id: string;
  user: string;
  movieId: string;
  rating: string;
  text: string;
  likes: number;
  createdAt?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const CommunityPage = () => {
  const [loading, setLoading] = useState(true);
  const [topReviewers, setTopReviewers] = useState<TopReviewer[]>([]);
  const [latestReviews, setLatestReviews] = useState<CommunityReview[]>([]);
  const [movieTitles, setMovieTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCommunity = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/community/overview");
        const nextTopReviewers = data.topReviewers || [];
        const nextLatestReviews = data.latestReviews || [];
        setTopReviewers(nextTopReviewers);
        setLatestReviews(nextLatestReviews);

        const uniqueMovieIds = [...new Set(nextLatestReviews.map((review: CommunityReview) => review.movieId))];
        const titleEntries = await Promise.all(
          uniqueMovieIds.map(async (movieId) => {
            try {
              const movieRes = await api.get(`/movies/${movieId}`);
              return [movieId, movieRes.data.title] as const;
            } catch {
              return [movieId, `Movie #${movieId}`] as const;
            }
          })
        );

        const nextTitles: Record<string, string> = {};
        for (const [movieId, title] of titleEntries) {
          nextTitles[movieId] = title;
        }
        setMovieTitles(nextTitles);
      } catch (error) {
        setTopReviewers([]);
        setLatestReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-40 left-1/4 w-80 h-80 bg-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="p-2 rounded-lg bg-teal/10 glow-teal">
                <MessageSquare className="text-teal" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Community Activity</h1>
              <div className="flex-1 h-px bg-gradient-to-r from-teal/30 to-transparent ml-2" />
            </div>

            {loading ? (
              <div className="text-center py-16 text-muted-foreground">Loading activity...</div>
            ) : latestReviews.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground animate-fade-in">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-1">No discussions yet</p>
                <p className="text-sm">Be the first to review a movie and start the conversation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {latestReviews.map((review) => (
                  <div key={review._id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-foreground font-medium">@{review.user}</p>
                        <Link to={`/movie/${review.movieId}`} className="text-sm text-primary hover:underline">
                          {movieTitles[review.movieId] || `Movie #${review.movieId}`}
                        </Link>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs bg-secondary text-foreground">
                        {review.rating}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{review.text}</p>
                    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                      <Star size={12} className="fill-muted-foreground" />
                      {review.likes || 0} likes
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80 shrink-0">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="text-accent" size={18} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Top Reviewers</h2>
            </div>

            {loading ? (
              <div className="text-muted-foreground text-sm">Loading leaderboard...</div>
            ) : topReviewers.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground animate-fade-in">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Top reviewers will appear here as the community grows.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topReviewers.map((reviewer, index) => (
                  <div key={reviewer._id} className="bg-card border border-border rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">#{index + 1} @{reviewer._id}</p>
                        <p className="text-xs text-muted-foreground">{reviewer.reviewsCount} reviews</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{reviewer.likesReceived} likes</p>
                        <p className="text-xs text-muted-foreground">Score: {reviewer.score}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
