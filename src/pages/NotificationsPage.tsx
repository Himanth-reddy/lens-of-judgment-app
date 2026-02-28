import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface NotificationItem {
  _id: string;
  actor: string;
  type: "review_like";
  reviewId: string;
  movieId: string;
  read: boolean;
  createdAt?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NotificationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data || []);
    } catch (error) {
      toast({
        title: "Failed to load notifications",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.username]);

  const markOneAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((item) => (item._id === notificationId ? { ...item, read: true } : item))
      );
    } catch (error) {
      toast({
        title: "Could not mark as read",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      toast({ title: "All notifications marked as read" });
    } catch (error) {
      toast({
        title: "Could not mark all as read",
        variant: "destructive",
      });
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-1/3 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="text-primary" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {user && <span className="text-sm text-muted-foreground">({unreadCount} unread)</span>}
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
          {user && notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-secondary/80"
            >
              <CheckCheck size={12} />
              Mark all read
            </button>
          )}
        </div>

        {!user ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2 text-foreground">Sign in to see notifications</p>
            <Link to="/auth" className="inline-flex px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm">
              Go to Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground animate-fade-in">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No notifications yet</p>
            <p className="text-sm">When someone likes your reviews, you will see it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-xl border p-4 ${
                  notification.read ? "bg-card border-border" : "bg-primary/5 border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">@{notification.actor}</span> liked your review.
                    </p>
                    <Link to={`/movie/${notification.movieId}`} className="text-xs text-primary hover:underline">
                      Open movie discussion
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markOneAsRead(notification._id)}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground hover:bg-secondary/80"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
