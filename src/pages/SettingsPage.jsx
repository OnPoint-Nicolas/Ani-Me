import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Check,
  X
} from "lucide-react";
import NavBar from "@/components/NavBar";

const SETTINGS_KEY = "ani-me-settings";

const getStoredSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const settingsSections = [
  {
    icon: User,
    title: "Profil",
    desc: "Name, Bio und Profilbild bearbeiten",
    items: [
      { key: "username_change", label: "Benutzername ändern" },
      { key: "bio_edit", label: "Bio bearbeiten" },
      { key: "avatar_upload", label: "Profilbild hochladen" },
    ],
  },
  {
    icon: Bell,
    title: "Benachrichtigungen",
    desc: "Push- und E-Mail-Benachrichtigungen verwalten",
    items: [
      { key: "push_notif", label: "Push-Benachrichtigungen" },
      { key: "email_notif", label: "E-Mail-Benachrichtigungen" },
      { key: "msg_notif", label: "Nachrichtenbenachrichtigungen" },
    ],
  },
  {
    icon: Shield,
    title: "Privatsphäre",
    desc: "Kontrolliere wer dein Profil sehen kann",
    items: [
      { key: "private_profile", label: "Privates Profil" },
      { key: "hide_activity", label: "Aktivitätsstatus verbergen" },
      { key: "block_users", label: "Blockierte Nutzer anzeigen" },
    ],
  },
  {
    icon: Palette,
    title: "Darstellung",
    desc: "Design und Farben anpassen",
    items: [
      { key: "dark_mode", label: "Dark Mode" },
      { key: "compact_mode", label: "Kompakte Ansicht" },
      { key: "animations", label: "Animationen aktivieren" },
    ],
  },
  {
    icon: Globe,
    title: "Sprache & Region",
    desc: "Sprache und regionale Einstellungen",
    items: [
      { key: "lang_de", label: "Sprache: Deutsch" },
      { key: "timezone_cet", label: "Zeitzone: CET" },
      { key: "date_format", label: "24h Zeitformat" },
    ],
  },
];

const SettingsPage = () => {
  const [settings, setSettings] = useState(getStoredSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-anime-brand" />
            <h1 className="text-xl font-bold text-foreground">
              Einstellungen
            </h1>
          </div>

          <button
            onClick={saveSettings}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
              saved
                ? "bg-anime-online/20 text-anime-online"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Gespeichert!
              </>
            ) : (
              "Speichern"
            )}
          </button>
        </div>

        <div className="space-y-4">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              className="rounded-lg bg-anime-surface border border-anime-border p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <section.icon className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-[10px] text-muted-foreground">
                    {section.desc}
                  </p>
                </div>
              </div>

              <div className="space-y-2 ml-8">
                {section.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2 border-b border-anime-border last:border-0"
                  >
                    <span className="text-xs text-foreground">
                      {item.label}
                    </span>

                    <button
                      onClick={() => toggleSetting(item.key)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        settings[item.key] ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${
                          settings[item.key]
                            ? "left-[22px] bg-primary-foreground"
                            : "left-0.5 bg-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-6">
          💾 Einstellungen werden im localStorage gespeichert.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;