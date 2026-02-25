import { Search, Bookmark, Bell, Users, LayoutGrid, User, Eye } from "lucide-react";
import LOJLogo from "./LOJLogo";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/">
          <LOJLogo />
        </Link>

        <nav className="flex items-center gap-1">
          <NavItem to="/" label="Explore" active={location.pathname === "/"} icon={<Eye size={18} />} />
          <NavIcon icon={<Bookmark size={18} />} />
          <NavIcon icon={<Users size={18} />} />
          <NavIcon icon={<LayoutGrid size={18} />} />
          <NavIcon icon={<Bell size={18} />} />
          <NavIcon icon={<Search size={18} />} />
          <div className="ml-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
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
    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </Link>
);

const NavIcon = ({ icon }: { icon: React.ReactNode }) => (
  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md">
    {icon}
  </button>
);

export default Header;
