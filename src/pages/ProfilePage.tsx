import { Settings, MessageSquare, Bookmark, Heart, LogOut, Edit2, X, Tag, Pencil, Check, Clock, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getTMDBImage } from "@/lib/tmdb";

const tabs = ["Reviews", "Watchlist", "Liked"];

const DEFAULT_TAGS = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Documentary"];

const MAX_TAGS = 3;

type Rating = "Skip" | "Timepass" | "Go for it" | "Perfection";

const ratingBadge: Record<string, string> = {
  Perfection: "bg-accent/20 text-accent",
  "Go for it": "bg-meter-goforit/20 text-meter-goforit",
  Timepass: "bg-meter-timepass/20 text-meter-timepass",
  Skip: "bg-meter-skip/20 text-meter-skip",
};

interface UserReview {
  _id: string;
  movieId: string;
  user: string;
  rating: string;
  text: string;
  likes: number;
  createdAt: string;
}

type BookmarkStatus = "watchlist" | "watched";

interface BookmarkItem {
  movieId: string;
  status: BookmarkStatus;
  addedAt?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Reviews");
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [likedReviews, setLikedReviews] = useState<UserReview[]>([]);
  const [likedLoading, setLikedLoading] = useState(false);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [movieTitles, setMovieTitles] = useState<Record<string, string>>({});
  const [moviePosters, setMoviePosters] = useState<Record<string, string>>({});
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<Rating>("Skip");
  const [editText, setEditText] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  // Fetch user reviews
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user?.username) return;
      setReviewsLoading(true);
      try {
        const res = await api.get(`/reviews/user/${user.username}`);
        setUserReviews(res.data);
      } catch (error) {
        console.error("Failed to fetch user reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchUserReviews();
  }, [user?.username]);

  useEffect(() => {
    const fetchProfileLists = async () => {
      if (!user?.username) return;

      setBookmarksLoading(true);
      setLikedLoading(true);
      try {
        const [bookmarksRes, likedRes] = await Promise.all([
          api.get("/bookmarks"),
          api.get("/reviews/liked/me"),
        ]);
        setBookmarks((bookmarksRes.data || []).map((item: any) => ({
          movieId: item.movieId,
          status: item.status,
          addedAt: item.addedAt,
        })));
        setLikedReviews(likedRes.data || []);
      } catch (error) {
        console.error("Failed to fetch profile lists:", error);
      } finally {
        setBookmarksLoading(false);
        setLikedLoading(false);
      }
    };

    fetchProfileLists();
  }, [user?.username]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const uniqueMovieIds = [
        ...new Set([
          ...userReviews.map((review) => review.movieId),
          ...bookmarks.map((bookmark) => bookmark.movieId),
          ...likedReviews.map((review) => review.movieId),
        ]),
      ];

      const missingIds = uniqueMovieIds.filter((movieId) => !movieTitles[movieId]);
      if (missingIds.length === 0) return;

      const newTitles: Record<string, string> = {};
      const newPosters: Record<string, string> = {};
      await Promise.all(
        missingIds.map(async (movieId) => {
          try {
            const res = await api.get(`/movies/${movieId}`);
            newTitles[movieId] = res.data.title;
            newPosters[movieId] = getTMDBImage(res.data.poster_path, "w185");
          } catch {
            newTitles[movieId] = `Movie #${movieId}`;
            newPosters[movieId] = getTMDBImage(null, "w185");
          }
        })
      );

      setMovieTitles((prev) => ({ ...prev, ...newTitles }));
      setMoviePosters((prev) => ({ ...prev, ...newPosters }));
    };

    if (userReviews.length > 0 || bookmarks.length > 0 || likedReviews.length > 0) {
      fetchMovieDetails();
    }
  }, [userReviews, bookmarks, likedReviews, movieTitles]);

  // Load user tags from user data
  useEffect(() => {
    if (user && user.tags) {
      setUserTags(user.tags);
    }
  }, [user]);

  const handleAddTag = async (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    if (userTags.includes(trimmedTag)) {
      toast({ title: "Tag already added", variant: "destructive" });
      return;
    }
    if (userTags.length >= MAX_TAGS) {
      toast({ title: `Maximum ${MAX_TAGS} tags allowed`, variant: "destructive" });
      return;
    }
    const updatedTags = [...userTags, trimmedTag];
    try {
      await api.put("/auth/tags", { tags: updatedTags });
      setUserTags(updatedTags);
      toast({ title: "Tag added" });
    } catch (error) {
      toast({ title: "Failed to add tag", variant: "destructive" });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    const updatedTags = userTags.filter((t) => t !== tag);
    try {
      await api.put("/auth/tags", { tags: updatedTags });
      setUserTags(updatedTags);
      toast({ title: "Tag removed" });
    } catch (error) {
      toast({ title: "Failed to remove tag", variant: "destructive" });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;
    try {
      await api.delete(`/reviews/${reviewId}`, { data: { user: user.username } });
      setUserReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast({ title: "Review deleted", description: "Your review has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete review.", variant: "destructive" });
    }
  };

  const startEditReview = (review: UserReview) => {
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
      setUserReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, rating: res.data.rating, text: res.data.text } : r))
      );
      setEditingReviewId(null);
      toast({ title: "Review updated", description: "Your review has been updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update review.", variant: "destructive" });
    }
  };

  const updateBookmarkStatus = async (movieId: string, status: BookmarkStatus) => {
    try {
      const { data } = await api.put(`/bookmarks/${movieId}`, { status });
      setBookmarks(data.bookmarks || []);
      toast({ title: status === "watched" ? "Marked as watched" : "Moved to watchlist" });
    } catch (error) {
      toast({ title: "Failed to update bookmark", variant: "destructive" });
    }
  };

  const removeBookmark = async (movieId: string) => {
    try {
      const { data } = await api.delete(`/bookmarks/${movieId}`);
      setBookmarks(data.bookmarks || []);
      toast({ title: "Removed from bookmarks" });
    } catch (error) {
      toast({ title: "Failed to remove bookmark", variant: "destructive" });
    }
  };

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
              {user?.username ? user.username[0].toUpperCase() : "G"}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label="Edit Profile Picture"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                >
                  <Edit2 size={12} className="text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Profile Picture</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{user?.username || "Guest"}</h1>
          <p className="text-muted-foreground text-sm">@{user?.username || "guest"}</p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Edit Profile
            </button>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label="Settings"
                  className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                >
                  <Settings size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSignOut}
                  aria-label="Log Out"
                  className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all"
                >
                  <LogOut size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Log Out</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* User Tags */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <Tag size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">My Tags ({userTags.length}/{MAX_TAGS})</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-3">
              {userTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive transition-colors" aria-label={`Remove tag ${tag}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            {/* Default tag suggestions */}
            {userTags.length < MAX_TAGS && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                {DEFAULT_TAGS.filter((t) => !userTags.includes(t)).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-xs hover:text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            )}
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
          <div className="animate-fade-in">
            {reviewsLoading ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-sm">Loading reviews...</p>
              </div>
            ) : userReviews.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-1">No reviews yet</p>
                <p className="text-sm">Your reviews will appear here after you rate movies.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div key={review._id} className="bg-card rounded-xl p-5 border border-border">
                    {editingReviewId === review._id ? (
                      /* Edit mode */
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Link to={`/movie/${review.movieId}`} className="text-sm font-medium text-primary hover:underline">
                            {movieTitles[review.movieId] || `Movie #${review.movieId}`}
                          </Link>
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
                                  ? ratingBadge[r]
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
                            onClick={() => handleEditReview(review._id)}
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
                            <Link to={`/movie/${review.movieId}`} className="text-sm font-medium text-primary hover:underline">
                              {movieTitles[review.movieId] || `Movie #${review.movieId}`}
                            </Link>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${ratingBadge[review.rating] || "bg-secondary"}`}>
                              {review.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => startEditReview(review)}
                                  className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                  aria-label="Edit review"
                                >
                                  <Pencil size={14} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit review</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  aria-label="Delete review"
                                >
                                  <X size={14} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete review</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>♥ {review.likes || 0} likes</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Watchlist" && (
          <div className="animate-fade-in">
            {bookmarksLoading ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-sm">Loading watchlist...</p>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Bookmark size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-1">Your watchlist is empty</p>
                <p className="text-sm">Add movies to your watchlist to keep track of what you want to watch.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <div key={`${bookmark.movieId}-${bookmark.status}`} className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex gap-3">
                      <img
                        src={moviePosters[bookmark.movieId] || getTMDBImage(null, "w185")}
                        alt={movieTitles[bookmark.movieId] || `Movie #${bookmark.movieId}`}
                        className="w-14 h-20 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/movie/${bookmark.movieId}`} className="text-sm font-medium text-primary hover:underline truncate block">
                          {movieTitles[bookmark.movieId] || `Movie #${bookmark.movieId}`}
                        </Link>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                              bookmark.status === "watched"
                                ? "bg-meter-goforit/20 text-meter-goforit"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {bookmark.status === "watched" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {bookmark.status === "watched" ? "Watched" : "Watchlist"}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {bookmark.status === "watchlist" ? (
                            <button
                              onClick={() => updateBookmarkStatus(bookmark.movieId, "watched")}
                              className="text-xs px-2.5 py-1.5 rounded-full bg-meter-goforit/20 text-meter-goforit hover:bg-meter-goforit/30"
                            >
                              Mark Watched
                            </button>
                          ) : (
                            <button
                              onClick={() => updateBookmarkStatus(bookmark.movieId, "watchlist")}
                              className="text-xs px-2.5 py-1.5 rounded-full bg-secondary text-foreground hover:bg-secondary/80"
                            >
                              Move to Watchlist
                            </button>
                          )}
                          <button
                            onClick={() => removeBookmark(bookmark.movieId)}
                            className="text-xs px-2.5 py-1.5 rounded-full bg-destructive/15 text-destructive hover:bg-destructive/25"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Liked" && (
          <div className="animate-fade-in">
            {likedLoading ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-sm">Loading liked reviews...</p>
              </div>
            ) : likedReviews.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Heart size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-1">No liked reviews yet</p>
                <p className="text-sm">Reviews you like will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {likedReviews.map((review) => (
                  <div key={review._id} className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between gap-2">
                      <Link to={`/movie/${review.movieId}`} className="text-sm font-medium text-primary hover:underline">
                        {movieTitles[review.movieId] || `Movie #${review.movieId}`}
                      </Link>
                      <span className="text-xs text-muted-foreground">by @{review.user}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ratingBadge[review.rating] || "bg-secondary"}`}>
                        {review.rating}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{review.text}</p>
                    <div className="mt-2 text-xs text-muted-foreground">♥ {review.likes || 0} likes</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
