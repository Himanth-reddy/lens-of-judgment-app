import { User, Settings, Star, MessageSquare, Bookmark, Heart, LogOut, Edit2, Film } from "lucide-react";
import Header from "@/components/Header";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const tabs = ["Reviews", "Watchlist", "Liked"];

const ratingBadge: Record<string, string> = {
  Perfection: "bg-accent/20 text-accent",
  "Go for it": "bg-meter-goforit/20 text-meter-goforit",
  Timepass: "bg-meter-timepass/20 text-meter-timepass",
  Skip: "bg-meter-skip/20 text-meter-skip",
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Reviews");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
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
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/50 transition-colors">
              <Edit2 size={12} className="text-muted-foreground" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{user?.username || "Guest"}</h1>
          <p className="text-muted-foreground text-sm">@{user?.username || "guest"}</p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Edit Profile
            </button>
            <button className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              <Settings size={16} />
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all"
            >
              <LogOut size={16} />
            </button>
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
          <div className="text-center py-16 text-muted-foreground animate-fade-in">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No reviews yet</p>
            <p className="text-sm">Your reviews will appear here after you rate movies.</p>
          </div>
        )}

        {activeTab === "Watchlist" && (
          <div className="text-center py-16 text-muted-foreground animate-fade-in">
            <Bookmark size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">Your watchlist is empty</p>
            <p className="text-sm">Add movies to your watchlist to keep track of what you want to watch.</p>
          </div>
        )}

        {activeTab === "Liked" && (
          <div className="text-center py-16 text-muted-foreground animate-fade-in">
            <Heart size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No liked movies yet</p>
            <p className="text-sm">Movies you like will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
