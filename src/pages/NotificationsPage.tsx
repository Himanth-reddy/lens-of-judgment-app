import { Bell, Heart, MessageSquare, Star, UserPlus, Film } from "lucide-react";
import Header from "@/components/Header";

import movie1 from "@/assets/movie-1.jpg";
import movie3 from "@/assets/movie-3.jpg";

type NotifType = "like" | "reply" | "follow" | "rating" | "release";

const notifications: {
  id: number;
  type: NotifType;
  user?: string;
  avatar?: string;
  message: string;
  time: string;
  read: boolean;
  image?: string;
}[] = [
  { id: 1, type: "like", user: "CinemaFan", avatar: "CF", message: "liked your review on Shadow Protocol", time: "2m ago", read: false, image: movie1 },
  { id: 2, type: "reply", user: "MovieBuff", avatar: "MB", message: "replied to your review: \"Totally agree!\"", time: "15m ago", read: false },
  { id: 3, type: "follow", user: "FilmNerd", avatar: "FN", message: "started following you", time: "1h ago", read: false },
  { id: 4, type: "rating", message: "Neon Uprising has reached 91% on the LOJ Meter!", time: "3h ago", read: true, image: movie3 },
  { id: 5, type: "release", message: "Shadow Protocol is now streaming on all platforms", time: "5h ago", read: true, image: movie1 },
  { id: 6, type: "like", user: "ScreenJunkie", avatar: "SJ", message: "liked your review on Sky Realm", time: "1d ago", read: true },
  { id: 7, type: "follow", user: "CriticalEye", avatar: "CE", message: "started following you", time: "2d ago", read: true },
];

const typeIcon: Record<NotifType, { icon: typeof Heart; color: string }> = {
  like: { icon: Heart, color: "text-meter-skip bg-meter-skip/10" },
  reply: { icon: MessageSquare, color: "text-teal bg-teal/10" },
  follow: { icon: UserPlus, color: "text-accent bg-accent/10" },
  rating: { icon: Star, color: "text-meter-timepass bg-meter-timepass/10" },
  release: { icon: Film, color: "text-primary bg-primary/10" },
};

const avatarGradients = ["from-primary to-accent", "from-accent to-teal", "from-teal to-primary", "from-meter-timepass to-primary", "from-primary to-meter-goforit"];

const NotificationsPage = () => {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-1/3 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="text-primary" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unread > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground animate-glow-pulse">
              {unread} new
            </span>
          )}
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>

        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const { icon: Icon, color } = typeIcon[notif.type];
            return (
              <div
                key={notif.id}
                className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 animate-slide-up cursor-pointer ${
                  notif.read
                    ? "bg-card border-border hover:border-border"
                    : "bg-card border-primary/20 hover:border-primary/40"
                }`}
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                {/* Icon or avatar */}
                {notif.avatar ? (
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradients[i % 5]} flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0`}>
                    {notif.avatar}
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={18} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    {notif.user && <span className="font-semibold">{notif.user} </span>}
                    <span className="text-muted-foreground">{notif.message}</span>
                  </p>
                  <span className="text-xs text-muted-foreground/60 mt-1 block">{notif.time}</span>
                </div>

                {notif.image && (
                  <img src={notif.image} alt="" className="w-10 h-14 object-cover rounded-md shrink-0" />
                )}

                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2 animate-glow-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
