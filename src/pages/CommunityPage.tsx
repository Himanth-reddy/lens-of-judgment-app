import { Users, MessageSquare, TrendingUp } from "lucide-react";
import Header from "@/components/Header";

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

            <div className="text-center py-16 text-muted-foreground animate-fade-in">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1">No discussions yet</p>
              <p className="text-sm">Be the first to start a discussion about a movie you've watched!</p>
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

            <div className="text-center py-10 text-muted-foreground animate-fade-in">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Top reviewers will appear here as the community grows.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
