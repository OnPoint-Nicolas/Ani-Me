import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Star, BookOpen, Calendar } from "lucide-react";
import NavBar from "@/components/NavBar";

// ============================================================
// Detail-Ansicht für einen einzelnen Manga (Master/Detail-Pattern)
// ============================================================

const MangaDetailPage = () => {
  const { id } = useParams();

  const [manga, setManga] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
        if (!res.ok) throw new Error(`API Fehler: ${res.status}`);

        const data = await res.json();
        setManga(data.data);

        const newsRes = await fetch(`https://api.jikan.moe/v4/manga/${id}/news`);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(Array.isArray(newsData.data) ? newsData.data.slice(0, 3) : []);
        } else {
          setNews([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-4xl mx-auto p-4">
        <Link
          to="/manga"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück zur Suche
        </Link>

        {loading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Lade Manga-Details...
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Fehler</p>
              <p className="text-xs text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {manga && !loading && (
          <div className="rounded-lg bg-anime-surface border border-anime-border p-6">
            <div className="grid md:grid-cols-[200px_1fr] gap-6">
              <img
                src={manga.images.jpg.large_image_url}
                alt={manga.title}
                className="w-full rounded-lg object-cover"
              />

              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {manga.title}
                </h1>

                {manga.title_japanese && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {manga.title_japanese}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {manga.score && (
                    <span className="px-2 py-1 rounded bg-anime-brand/20 text-anime-brand text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {manga.score} ({manga.scored_by?.toLocaleString()})
                    </span>
                  )}

                  <span className="px-2 py-1 rounded bg-secondary text-xs">
                    {manga.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {manga.genres?.map((g) => (
                    <span
                      key={g.name}
                      className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-medium"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5" />
                    {manga.chapters ?? "?"} Kapitel · {manga.volumes ?? "?"} Bände
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {manga.published?.string}
                  </div>
                </div>

                {manga.authors?.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Autor: {manga.authors.map((a) => a.name).join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-foreground mb-2">
                Beschreibung
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {manga.synopsis || "Keine Beschreibung verfügbar."}
              </p>
            </div>

            <a
              href={manga.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
            >
              Auf MyAnimeList ansehen →
            </a>

            <div className="mt-8 border-t border-anime-border pt-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Neuigkeiten
              </h2>

              {news.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Für diesen Manga wurden keine aktuellen News gefunden.
                </p>
              ) : (
                <div className="space-y-3">
                  {news.map((item) => (
                    <a
                      key={item.mal_id || item.url}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md border border-anime-border bg-background p-3 hover:bg-anime-surface-hover"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {item.excerpt || "News auf MyAnimeList öffnen."}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaDetailPage;
