import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// ============================================================
// Datenschutzerklärung – vereinfachte Version für das Projekt.
// ============================================================

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="max-w-3xl mx-auto p-4 flex-1 w-full">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Zurück
        </Link>

        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
          <ShieldCheck className="w-6 h-6 text-anime-brand" /> Datenschutzerklärung
        </h1>

        <div className="space-y-6 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="font-semibold text-foreground mb-1">1. Verantwortlicher</h2>
            <p className="text-muted-foreground">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist der im{" "}
              <Link to="/impressum" className="text-anime-brand hover:underline">Impressum</Link>{" "}
              genannte Betreiber.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">2. Erhobene Daten</h2>
            <ul className="text-muted-foreground list-disc list-inside space-y-1">
              <li><strong>Registrierung:</strong> E-Mail-Adresse, Benutzername und Passwort (gehasht durch Firebase Auth).</li>
              <li><strong>Profilbild &amp; Uploads:</strong> Bilder/Videos, die du freiwillig hochlädst (Firebase Storage).</li>
              <li><strong>Beiträge &amp; Kommentare:</strong> Texte, die du veröffentlichst (Firestore Datenbank).</li>
              <li><strong>Technische Daten:</strong> IP-Adresse, Browsertyp und Zugriffszeit (zur Sicherheit).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">3. Zweck der Verarbeitung</h2>
            <p className="text-muted-foreground">
              Die Daten werden ausschließlich zum Betrieb der Plattform verwendet: Anmeldung, Darstellung deines Profils,
              Veröffentlichung deiner Beiträge sowie Schutz vor Missbrauch. Eine Weitergabe an Dritte erfolgt nicht.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">4. Eingesetzte Dienste</h2>
            <ul className="text-muted-foreground list-disc list-inside space-y-1">
              <li><strong>Google Firebase</strong> (Authentication, Firestore, Storage) – Server in der EU.</li>
              <li><strong>Jikan API</strong> (öffentliche MyAnimeList-Schnittstelle) – nur lesender Zugriff.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">5. Cookies &amp; lokaler Speicher</h2>
            <p className="text-muted-foreground">
              Wir verwenden technisch notwendige Cookies und den lokalen Browser-Speicher (LocalStorage) für
              Login-Sitzungen, Theme-Auswahl (Dark/Light) und Bookmarks.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">6. Deine Rechte (Art. 15–22 DSGVO)</h2>
            <p className="text-muted-foreground">
              Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
              Datenübertragbarkeit sowie Widerspruch. Kontaktiere uns dafür über die im Impressum genannten Daten.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1">7. Account löschen</h2>
            <p className="text-muted-foreground">
              Du kannst deinen Account jederzeit in den Einstellungen löschen. Dabei werden alle deine personenbezogenen
              Daten unwiderruflich entfernt.
            </p>
          </section>

          <section className="text-xs text-muted-foreground italic border-t border-anime-border pt-4">
            Hinweis: Dies ist ein Schulprojekt. Diese Datenschutzerklärung ist vereinfacht und ersetzt keine
            rechtsverbindliche Beratung.
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Datenschutz;
