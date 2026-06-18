

import { useState } from "react";
import { Search, Home, Play, Users, Settings, User, Brain, Menu, X, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useAuth } from "@/hooks/useAuth";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Search, path: "/manga", label: "Manga Suche" },
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
    <nav className="flex items-center justify-between px-4 py-2 border-b border-anime-border bg-anime-surface relative">
      <Link to="/" className="font-brand text-3xl font-bold text-anime-brand">Ani-Me</Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={item.label}
            className={`transition-colors ${
              location.pathname === item.path
                ? "text-anime-brand"
                : "text-muted-foreground hover:text-foreground"
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
          className="md:hidden p-1.5 rounded-md bg-secondary text-foreground"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-anime-surface border-b border-anime-border md:hidden animate-in slide-in-from-top-2 duration-200">
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
