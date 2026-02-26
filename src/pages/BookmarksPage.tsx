import { Bookmark, Clock, Film } from "lucide-react";
import Header from "@/components/Header";

const BookmarksPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-20 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <Header />

      <main className="container py-8 max-w-4xl mx-auto">
        {/* Watchlist */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bookmark className="text-primary" size={20} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">My Watchlist</h1>
            <span className="text-sm text-muted-foreground">(0)</span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
          </div>

          <div className="text-center py-16 text-muted-foreground animate-fade-in">
            <Film size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">Your watchlist is empty</p>
            <p className="text-sm">Browse movies and add them to your watchlist to keep track of what you want to watch.</p>
          </div>
        </section>

        {/* Watched */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <section>
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="p-2 rounded-lg bg-meter-goforit/10">
              <Clock className="text-meter-goforit" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Already Watched</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-meter-goforit/30 to-transparent ml-2" />
          </div>

          <div className="text-center py-16 text-muted-foreground animate-fade-in">
            <Clock size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No watched movies yet</p>
            <p className="text-sm">Movies you've watched and rated will appear here.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BookmarksPage;
