import { useState } from "react";
import { Home, Play, Users, Settings, User, Brain, Menu, X, LogIn, LogOut, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useAuth } from "@/hooks/useAuth";

const MangaSearchIcon = ({ className = "w-5 h-5" }) => (
  <span className={`relative inline-grid place-items-center ${className}`} aria-hidden="true">
    <span className="absolute left-[2px] top-[3px] h-[14px] w-[11px] rounded-[2px] border border-current opacity-90" />
    <span className="absolute left-[7px] top-[3px] h-[14px] w-[11px] rounded-[2px] border border-current bg-current/5 opacity-90" />
    <span className="absolute left-[5px] top-[6px] h-[1px] w-[4px] rounded-full bg-current opacity-70" />
    <span className="absolute left-[5px] top-[9px] h-[1px] w-[5px] rounded-full bg-current opacity-50" />
    <Search className="absolute -right-[1px] bottom-0 h-[10px] w-[10px] stroke-[2.7]" />
  </span>
);

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: MangaSearchIcon, path: "/manga", label: "Manga Suche" },
    { icon: Play, path: "/videos", label: "Videos" },
    { icon: Users, path: "/community", label: "Community" },
    { icon: Brain, path: "/quiz", label: "Quiz" },
    { icon: Settings, path: "/settings", label: "Einstellungen" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-anime-surface/80 px-4 py-2 shadow-2xl shadow-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-anime-surface/65">
      <Link to="/" className="font-brand text-3xl font-bold text-anime-brand drop-shadow-[0_0_18px_hsl(var(--anime-brand)/0.35)]">Ani-Me</Link>

      {/* Desktop Nav */}
      <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1 shadow-inner shadow-white/5 md:flex">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={item.label}
            className={`grid h-10 w-10 place-items-center rounded-full transition-all ${
              location.pathname === item.path
                ? "bg-white text-black shadow-lg shadow-white/10"
                : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <ThemeToggle />

        {/* Auth Status */}
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/profile" className="hidden md:flex items-center gap-1.5 text-sm text-foreground hover:text-anime-brand transition-colors">
              <User className="w-4 h-4" />
              <span className="max-w-[80px] truncate">{user.name}</span>
            </Link>
            <Link to="/profile" className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              title="Abmelden"
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-anime-brand text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Anmelden</span>
          </Link>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md bg-white/10 p-1.5 text-foreground md:hidden"
          title="Menü"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-white/10 bg-anime-surface/95 shadow-2xl shadow-black/30 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-anime-brand font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <User className="w-4 h-4" /> {user.name}
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Abmelden
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-anime-brand font-medium hover:bg-primary/10"
              >
                <LogIn className="w-4 h-4" /> Anmelden
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
