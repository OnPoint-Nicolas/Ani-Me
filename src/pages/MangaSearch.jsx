import { useState, useEffect, useCallback } from "react";
import Footer from "@/components/Footer";
import {
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";

const MangaSearch = () => {
  const [query, setQuery] = useState("");
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Top Manga beim Laden
  useEffect(() => {
    fetchTopManga();
  }, []);

  const fetchTopManga = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://api.jikan.moe/v4/top/manga?limit=12"
      );

      if (!res.ok) {
        throw new Error(`API Fehler: ${res.status} – ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Ungültige API-Antwort.");
      }

      setMangaList(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
    } finally {
      setLoading(false);
    }
  };

  const searchManga = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      fetchTopManga();
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(
          searchQuery
        )}&limit=12`
      );

      if (!res.ok) {
        throw new Error(`API Fehler: ${res.status} – ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Ungültige API-Antwort.");
      }

      setMangaList(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 3) {
        searchManga(query);
      } else if (query.length === 0 && hasSearched) {
        fetchTopManga();
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchManga, hasSearched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchManga(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Search */}
      <div className="bg-anime-surface border-b border-anime-border py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 text-anime-brand" />
            Manga News & Suche
          </h1>

          <p className="text-sm text-muted-foreground mb-6">
            Durchsuche tausende Manga – powered by Jikan API
          </p>

          <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Manga suchen... (z.B. One Piece, Naruto, Attack on Titan)"
              className="w-full pl-10 pr-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-lg border border-anime-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
            )}
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            {hasSearched
              ? `Ergebnisse für "${query}"`
              : "🔥 Top Manga"}
          </h2>

          <button
            onClick={fetchTopManga}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Zurücksetzen
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />

              <div>
                <p className="text-sm font-semibold text-destructive">
                  Fehler beim Laden
                </p>

                <p className="text-xs text-destructive/80 mt-1">
                  {error}
                </p>

                <button
                  onClick={() => searchManga(query)}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:opacity-90"
                >
                  <RefreshCw className="w-3 h-3" />
                  Erneut versuchen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Lade Manga...</span>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mangaList.map((manga) => (
              <Link
                key={manga.mal_id}
                to={`/manga/${manga.mal_id}`}
                className="block rounded-lg bg-anime-surface border border-anime-border p-4 hover:bg-anime-surface-hover transition-colors"
              >
                <div className="flex gap-4">
                  <img
                    src={manga.images.jpg.image_url}
                    alt={manga.title}
                    className="w-20 h-28 rounded-md object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {manga.title}
                    </h3>

                    {manga.authors.length > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        von {manga.authors.map((a) => a.name).join(", ")}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {manga.genres.slice(0, 3).map((g) => (
                        <span
                          key={g.name}
                          className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-medium"
                        >
                          {g.name}
                        </span>
                      ))}

                      {manga.score && (
                        <span className="px-2 py-0.5 rounded bg-anime-brand/20 text-anime-brand text-[10px] font-medium">
                          ⭐ {manga.score}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {manga.synopsis || "Keine Beschreibung verfügbar."}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      {manga.chapters && (
                        <span>{manga.chapters} Kapitel</span>
                      )}
                      {manga.volumes && (
                        <span>{manga.volumes} Bände</span>
                      )}
                      <span>{manga.status}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          mangaList.length === 0 &&
          hasSearched && (
            <p className="text-center text-sm text-muted-foreground py-12">
              Keine Manga gefunden für „{query}“.
            </p>
          )}
      </div>

      <Footer />
    </div>
  );
};

export default MangaSearch;