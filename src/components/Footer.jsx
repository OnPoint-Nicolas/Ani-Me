import { Link } from "react-router-dom";
import { Heart, GitBranch, Mail } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-anime-border bg-anime-surface">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-4 text-sm">

        {/* Marke */}
        <div>
          <Link
            to="/"
            className="font-brand text-2xl font-bold text-anime-brand"
          >
            Ani-Me
          </Link>

          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
            Dein deutsches Anime- &amp; Manga-Netzwerk. Entdecken, teilen und diskutieren.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Entdecken</h3>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li><Link to="/" className="hover:text-anime-brand">Newsfeed</Link></li>
            <li><Link to="/manga" className="hover:text-anime-brand">Manga Suche</Link></li>
            <li><Link to="/videos" className="hover:text-anime-brand">Videos</Link></li>
            <li><Link to="/community" className="hover:text-anime-brand">Community</Link></li>
            <li><Link to="/quiz" className="hover:text-anime-brand">Quiz</Link></li>
          </ul>
        </div>

        {/* Rechtliches */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Rechtliches</h3>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li><Link to="/impressum" className="hover:text-anime-brand">Impressum</Link></li>
            <li><Link to="/datenschutz" className="hover:text-anime-brand">Datenschutz</Link></li>
          </ul>
        </div>

        {/* Kontakt */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Kontakt</h3>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              kontakt@ani-me.example
            </li>

            <li className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              GitHub.com/ani-me
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-anime-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <p>
            &copy; {year} Ani-Me · Abschlussprojekt · Alle Rechte vorbehalten.
          </p>

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
