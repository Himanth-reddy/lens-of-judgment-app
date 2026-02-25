import { Users, UserPlus, MessageSquare, TrendingUp } from "lucide-react";
import Header from "@/components/Header";

import movie1 from "@/assets/movie-1.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";

const topReviewers = [
  { name: "CinemaFan", handle: "@cinemafan", avatar: "CF", reviews: 342, followers: 1200, following: false },
  { name: "MovieBuff", handle: "@moviebuff", avatar: "MB", reviews: 287, followers: 980, following: true },
  { name: "CriticalEye", handle: "@criticaleye", avatar: "CE", reviews: 215, followers: 756, following: false },
  { name: "FilmNerd", handle: "@filmnerd", avatar: "FN", reviews: 198, followers: 543, following: true },
  { name: "ScreenJunkie", handle: "@screenjunkie", avatar: "SJ", reviews: 176, followers: 432, following: false },
];

const discussions = [
  { user: "CinemaFan", avatar: "CF", title: "Is Shadow Protocol the best thriller of 2026?", replies: 47, likes: 123, time: "2h ago", image: movie1 },
  { user: "MovieBuff", avatar: "MB", title: "Neon Uprising ending explained — what did you think?", replies: 89, likes: 256, time: "5h ago", image: movie3 },
  { user: "CriticalEye", avatar: "CE", title: "The Hollow is underrated. Change my mind.", replies: 34, likes: 87, time: "1d ago", image: movie4 },
];

const avatarGradients = [
  "from-primary to-accent",
  "from-accent to-teal",
  "from-teal to-primary",
  "from-meter-timepass to-primary",
  "from-primary to-meter-goforit",
];

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-40 left-1/4 w-80 h-80 bg-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Discussions */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="p-2 rounded-lg bg-teal/10 glow-teal">
                <MessageSquare className="text-teal" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Discussions</h1>
              <div className="flex-1 h-px bg-gradient-to-r from-teal/30 to-transparent ml-2" />
            </div>

            <div className="space-y-4">
              {discussions.map((post, i) => (
                <div
                  key={i}
                  className="group p-5 rounded-xl bg-card border border-border hover:border-teal/30 transition-all duration-300 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
                >
                  <div className="flex gap-4">
                    <img src={post.image} alt="" className="w-16 h-22 object-cover rounded-lg hidden sm:block" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarGradients[i % 5]} flex items-center justify-center text-[10px] font-bold text-primary-foreground`}>
                          {post.avatar}
                        </div>
                        <span className="text-sm text-muted-foreground">{post.user}</span>
                        <span className="text-xs text-muted-foreground/60">• {post.time}</span>
                      </div>
                      <h3 className="text-foreground font-medium group-hover:text-teal transition-colors mb-3">{post.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>💬 {post.replies} replies</span>
                        <span>❤️ {post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Reviewers Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="text-accent" size={18} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Top Reviewers</h2>
            </div>

            <div className="space-y-3">
              {topReviewers.map((reviewer, i) => (
                <div
                  key={reviewer.handle}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${0.3 + i * 0.06}s`, opacity: 0 }}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradients[i % 5]} flex items-center justify-center text-xs font-bold text-primary-foreground`}>
                    {reviewer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{reviewer.name}</p>
                    <p className="text-xs text-muted-foreground">{reviewer.reviews} reviews</p>
                  </div>
                  <button className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    reviewer.following
                      ? "bg-secondary text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}>
                    <UserPlus size={12} />
                    {reviewer.following ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
