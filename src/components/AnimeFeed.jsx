import { useState, useEffect } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

const AnimeFeed = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=6");
      if (!response.ok) throw new Error(`API Fehler: ${response.status}`);

      const data = await response.json();
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Ungültige API-Antwort");
      }

      setAnimeList(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Lade Anime-Newsfeed...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4">
        <AlertCircle className="w-5 h-5 text-destructive" />
        <p>{error}</p>
        <button onClick={fetchAnime} className="mt-3">
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {animeList.map((anime) => (
        <div key={anime.mal_id}>
          <h3>{anime.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default AnimeFeed;