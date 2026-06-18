import { useState } from "react";
import Footer from "@/components/Footer.jsx";
import { Play, TrendingUp, Heart, MessageCircle, Filter, Search } from "lucide-react";
import NavBar from "@/components/NavBar.jsx";

const videos = [
  { id: 1, title: "Top 10 Anime Fights 2025", views: "1.2M", duration: "12:34", category: "Action", likes: 4523, comments: 234 },
  { id: 2, title: "Manga vs Anime: Die größten Unterschiede", views: "845K", duration: "18:22", category: "Vergleich", likes: 2341, comments: 156 },
  { id: 3, title: "Anime Opening Compilation", views: "2.1M", duration: "25:00", category: "Musik", likes: 6789, comments: 432 },
  { id: 4, title: "Cosplay Tutorial: Naruto", views: "432K", duration: "15:45", category: "Tutorial", likes: 1234, comments: 89 },
  { id: 5, title: "One Piece Theorie: Das Ende", views: "1.8M", duration: "22:10", category: "Theorie", likes: 5678, comments: 567 },
  { id: 6, title: "Anime Drawing Speed Art", views: "678K", duration: "8:30", category: "Kunst", likes: 3456, comments: 198 },
  { id: 7, title: "Best Anime Soundtracks 2025", views: "1.5M", duration: "30:00", category: "Musik", likes: 8901, comments: 345 },
  { id: 8, title: "Demon Slayer Season 5 Review", views: "2.3M", duration: "16:20", category: "Review", likes: 7890, comments: 678 },
];

const categories = ["Alle", "Action", "Musik", "Tutorial", "Theorie", "Kunst", "Vergleich", "Review"];

const Videos = () => {
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("views");

  const filteredVideos = videos
    .filter((v) => activeCategory === "Alle" || v.category === activeCategory)
    .filter((v) => v.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-anime-brand" />
            <h1 className="text-xl font-bold text-foreground">Videos</h1>
            <span className="text-xs text-muted-foreground ml-2">
              {filteredVideos.length} Videos
            </span>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Videos durchsuchen..."
              className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground placeholder:text-muted-foreground rounded-lg border border-anime-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["views", "likes", "newest"]).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  sortBy === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-anime-surface-hover"
                }`}
              >
                {s === "views" ? "Beliebt" : s === "likes" ? "Top Likes" : "Neueste"}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-anime-surface-hover"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVideos.map((v) => (
            <div
              key={v.id}
              className="rounded-lg bg-anime-surface border border-anime-border overflow-hidden hover:bg-anime-surface-hover transition-colors cursor-pointer group"
            >
              <div className="aspect-video bg-secondary flex items-center justify-center relative overflow-hidden">
                <Play className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-background/80 text-foreground text-[10px]">
                  {v.duration}
                </span>
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary/90 text-primary-foreground text-[9px] font-medium">
                  {v.category}
                </span>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">
                  {v.title}
                </h3>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {v.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {v.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> {v.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">
            Keine Videos in dieser Kategorie gefunden.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Videos;