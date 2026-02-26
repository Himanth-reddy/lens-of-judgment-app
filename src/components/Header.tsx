import { Search, Bookmark, Bell, Users, LayoutGrid, User, Compass } from "lucide-react";
import LOJLogo from "./LOJLogo";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <LOJLogo />
        </Link>

        <nav className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:flex items-center gap-1">
            <NavItem to="/" label="Explore" active={path === "/"} icon={<Compass size={18} />} />
            <NavItem to="/bookmarks" label="Bookmarks" active={path === "/bookmarks"} icon={<Bookmark size={18} />} />
            <NavItem to="/community" label="Discussion" active={path === "/community"} icon={<Users size={18} />} />
            <NavItem to="/categories" label="Categories" active={path === "/categories"} icon={<LayoutGrid size={18} />} />
          </div>

          <div className="flex items-center gap-2">
            <NavItem to="/search" active={path === "/search"} icon={<Search size={18} />} />
            <NavItem to="/notifications" active={path === "/notifications"} icon={<Bell size={18} />} />

            <Link
              to={user ? "/profile" : "/auth"}
              className={`ml-2 w-9 h-9 rounded-full bg-gradient-to-br ${user ? "from-primary to-accent" : "from-secondary to-secondary/80"} flex items-center justify-center border border-border hover:border-primary/50 transition-all duration-300 shadow-sm`}
            >
              {user ? (
                <span className="text-primary-foreground font-semibold text-xs">
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </span>
              ) : (
                <User size={16} className="text-muted-foreground" />
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

const NavItem = ({ to, label, active, icon }: { to: string; label?: string; active: boolean; icon: React.ReactNode }) => (
  <Link
    to={to}
    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      active ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
    }`}
  >
    {icon}
    {label && (
      <span
        className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
          active ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        {label}
      </span>
    )}
    {active && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
    )}
  </Link>
);

export default Header;
