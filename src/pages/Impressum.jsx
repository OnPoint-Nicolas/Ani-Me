import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// ============================================================
// Impressum – Pflicht-Seite nach § 5 TMG (Telemediengesetz).
// Platzhalter-Daten sollten vor Live-Schaltung ersetzt werden.
// ============================================================

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="max-w-3xl mx-auto p-4 flex-1 w-full">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Zurück
        </Link>

        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
          <Scale className="w-6 h-6 text-anime-brand" /> Impressum
        </h1>

        <div className="space-y-6 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="font-semibold text-foreground mb-1">Angaben gemäß § 5 TMG</h2>
            <p className="text-muted-foreground">
              Max Mustermann<br />
              Musterstraße 1<br />
              12345 Musterstadt<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">Kontakt</h2>
            <p className="text-muted-foreground">
              Telefon: +49 (0) 000 000 0000<br />
              E-Mail: kontakt@ani-me.example
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="text-muted-foreground">Max Mustermann (Anschrift wie oben)</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">Haftung für Inhalte</h2>
            <p className="text-muted-foreground">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
              Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf
              eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">Haftung für Links</h2>
            <p className="text-muted-foreground">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">Urheberrecht</h2>
            <p className="text-muted-foreground">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Anime- und Manga-Daten werden über die öffentliche Jikan API (MyAnimeList) bezogen und
              gehören den jeweiligen Rechteinhabern.
            </p>
          </section>

          <section className="text-xs text-muted-foreground italic border-t border-anime-border pt-4">
            Hinweis: Dies ist ein Schulprojekt. Die obigen Daten sind Platzhalter und müssen vor einer echten
            Veröffentlichung durch reale Angaben ersetzt werden.
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Impressum;