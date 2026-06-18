import { Link } from "react-router-dom";
import { Sparkles, Users, Play, Brain, TrendingUp, Heart, MessageCircle, Rocket, Shield, Globe } from "lucide-react";
import Footer from "@/components/Footer";

// ============================================================
// Landing – öffentliche Startseite für nicht-eingeloggte Besucher
// ----------------------------------------------------------------
// Zeigt, was Ani-Me ist: eine Social-Media-Plattform für Anime-
// und Manga-Fans, mit besonderem Fokus auf Creator, die auf
// Instagram / Facebook / TikTok zu wenig Reichweite bekommen.
// Eingeloggte Nutzer landen direkt auf dem Dashboard (AniMe).
// ============================================================

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------- Mini-Navbar (öffentlich, ohne geschützte Links) ---------- */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-anime-border bg-anime-surface">
        <Link to="/" className="font-brand text-3xl font-bold text-anime-brand">Ani-Me</Link>
        <div className="flex items-center gap-3">
          <a href="#features" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors">
            Projekt
          </a>
          <Link
            to="/auth"
            className="px-4 py-1.5 rounded-md bg-anime-brand text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Anmelden
          </Link>
        </div>
      </nav>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        {/* Hintergrund-Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-anime-brand/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="mx-auto max-w-4xl rounded-lg border border-anime-border bg-anime-surface/50 px-6 py-10 shadow-2xl md:px-10 md:py-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-anime-surface/80 border border-anime-border text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3 h-3 text-anime-brand" />
              Die Social-Plattform für Anime &amp; Manga-Fans
            </span>
            <h1 className="font-brand text-5xl md:text-7xl font-bold leading-tight">
              Wo <span className="text-anime-brand">Anime-Fans</span><br />
              sich wirklich finden.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Ani-Me ist dein Feed, deine Community und deine Bühne – komplett rund um Anime, Manga und japanische Popkultur. Folge Creators, teile Clips, diskutiere die neuste Folge und tritt im Quiz an.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/auth"
                className="px-6 py-3 rounded-md bg-anime-brand text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Kostenlos starten
              </Link>
              <a
                href="#features"
                className="px-6 py-3 rounded-md border border-anime-border bg-anime-surface text-foreground font-medium hover:bg-anime-surface-hover transition-colors"
              >
                Projekt ansehen
              </a>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% kostenlos</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Made in Germany</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURE-GRID ---------- */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20">
        <h2 className="font-brand text-3xl md:text-4xl font-bold text-center mb-12">
          Was du auf Ani-Me findest
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, title: "Anime Newsfeed", text: "Top-Anime der Saison – live aus der Jikan-API. Immer aktuell, nie verpasst." },
            { icon: Users, title: "Community", text: "Diskutiere, like und kommentiere mit anderen Fans. Echte Gespräche statt Algorithmus-Müll." },
            { icon: Play, title: "Video-Clips", text: "Teile deine Edits, AMVs und Reactions. Unterstützt Bilder und Videos bis 50 MB." },
            { icon: Brain, title: "Anime-Quiz", text: "10 Fragen, Streak-System, Highscores. Beweise wie viel du wirklich weißt." },
            { icon: MessageCircle, title: "Manga-Suche", text: "Finde jedes Werk per Live-Suche. Mit Cover, Score und Beschreibung." },
            { icon: Heart, title: "Dein Profil", text: "Eigenes Profilbild, Bio, Posts und Bookmarks – alles an einem Ort." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-lg bg-anime-surface border border-anime-border p-5 hover:bg-anime-surface-hover hover:border-anime-brand/40 transition-all"
            >
              <div className="w-10 h-10 rounded-md bg-anime-brand/15 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-anime-brand" />
              </div>
              <h3 className="font-brand text-lg font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CREATOR-SEKTION ---------- */}
      <section className="border-y border-anime-border bg-anime-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-anime-brand/10 border border-anime-brand/30 text-xs text-anime-brand mb-4">
              <Rocket className="w-3 h-3" /> Für Creator
            </span>
            <h2 className="font-brand text-3xl md:text-4xl font-bold leading-tight">
              Keine Reichweite auf Instagram, TikTok oder Facebook?
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Große Plattformen begraben Nischen-Content unter generischem Trash. Auf Ani-Me ist dein Publikum schon hier – jeder, der scrollt, liebt Anime. Du musst dich nicht gegen Koch-Reels und Tanz-Trends durchsetzen.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-anime-brand mt-0.5">✓</span><span>100% Anime-Publikum – kein Algorithmus, der deine Nische verbirgt</span></li>
              <li className="flex items-start gap-2"><span className="text-anime-brand mt-0.5">✓</span><span>Lade Videos, Bilder &amp; Text-Posts direkt hoch</span></li>
              <li className="flex items-start gap-2"><span className="text-anime-brand mt-0.5">✓</span><span>Bald: Creator-Bereich mit Analytics &amp; Premium-Profil</span></li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Link
                to="/auth"
                className="px-5 py-2.5 rounded-md bg-anime-brand text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Jetzt Account anlegen
              </Link>
              <span className="px-5 py-2.5 rounded-md border border-dashed border-anime-border text-xs text-muted-foreground self-center">
                Creator-Login folgt bald
              </span>
            </div>
          </div>

          {/* Mock-Vorschau */}
          <div className="relative">
            <div className="rounded-xl border border-anime-border bg-background p-4 shadow-2xl">
              <div className="flex items-center gap-2 pb-3 border-b border-anime-border">
                <div className="w-8 h-8 rounded-full bg-anime-brand/30 flex items-center justify-center text-xs font-bold text-anime-brand">A</div>
                <div>
                  <p className="text-sm font-semibold">AnimeCreator99</p>
                  <p className="text-[10px] text-muted-foreground">vor 2 Minuten</p>
                </div>
              </div>
              <p className="text-sm mt-3">Mein neuer AMV zu Chainsaw Man ist online 🔥 Was meint ihr?</p>
              <div className="mt-3 aspect-video rounded-md bg-gradient-to-br from-anime-brand/30 via-primary/20 to-anime-brand/10 flex items-center justify-center">
                <Play className="w-10 h-10 text-anime-brand" />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-anime-brand" /> 1.2k</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 84</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-xl bg-anime-brand/20 blur-2xl" />
          </div>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { v: "100%", l: "Anime-Fokus" },
            { v: "0 €", l: "Mitgliedschaft" },
            { v: "24/7", l: "Live-Feed" },
            { v: "∞", l: "Diskussionen" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-anime-surface border border-anime-border p-6">
              <p className="font-brand text-3xl md:text-4xl font-bold text-anime-brand">{s.v}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-brand text-3xl md:text-5xl font-bold leading-tight">
          Bereit für deinen <span className="text-anime-brand">Anime-Feed</span>?
        </h2>
        <p className="mt-4 text-muted-foreground">
          In 30 Sekunden registriert. Kostenlos. Ohne Werbung. Ohne Algorithmus, der dich nicht versteht.
        </p>
        <Link
          to="/auth"
          className="inline-block mt-8 px-8 py-3.5 rounded-md bg-anime-brand text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Jetzt einsteigen →
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
