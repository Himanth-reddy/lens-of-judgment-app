import { Bell } from "lucide-react";
import Header from "@/components/Header";

const NotificationsPage = () => {
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
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>

        <div className="text-center py-20 text-muted-foreground animate-fade-in">
          <Bell size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">No notifications yet</p>
          <p className="text-sm">When someone interacts with your reviews or follows you, you'll see it here.</p>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
