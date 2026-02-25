import { Search, Bookmark, Bell, Users, LayoutGrid, User, Compass } from "lucide-react";
import LOJLogo from "./LOJLogo";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/">
          <LOJLogo />
        </Link>

        <nav className="flex items-center gap-1">
          <NavItem to="/" label="Explore" active={location.pathname === "/"} icon={<Compass size={18} />} />
          <NavIcon icon={<Bookmark size={18} />} />
          <NavIcon icon={<Users size={18} />} />
          <NavIcon icon={<LayoutGrid size={18} />} />
          <NavIcon icon={<Bell size={18} />} />
          <NavIcon icon={<Search size={18} />} />
          <div className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer">
            <User size={16} className="text-muted-foreground" />
          </div>
        </nav>
      </div>
    </header>
  );
};

const NavItem = ({ to, label, active, icon }: { to: string; label: string; active: boolean; icon: React.ReactNode }) => (
  <Link
    to={to}
    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
    {active && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
    )}
  </Link>
);

const NavIcon = ({ icon }: { icon: React.ReactNode }) => (
  <button className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200 rounded-md hover:bg-primary/5">
    {icon}
  </button>
);

export default Header;
