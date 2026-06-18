import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, Mail, User, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";

const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const { user, loading, register, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, navigate, redirectTo, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (busy) return;

    if (!isValidEmail(email)) {
      setError("Bitte gib eine gültige E-Mail ein.");
      return;
    }

    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    if (mode === "register") {
      if (name.trim().length < 2) {
        setError("Der Benutzername muss mindestens 2 Zeichen haben.");
        return;
      }
    }

    setBusy(true);

    if (mode === "register") {
      const result = await register(name.trim(), email.trim(), password);
      if (result.success) {
        setSuccess("Registrierung erfolgreich. Du wirst weitergeleitet...");
        setTimeout(() => navigate(redirectTo, { replace: true }), 700);
      } else {
        setError(result.error || "Fehler bei der Registrierung.");
      }
    } else {
      const result = await login(email.trim(), password);
      if (result.success) {
        setSuccess("Login erfolgreich!");
        setTimeout(() => navigate(redirectTo, { replace: true }), 500);
      } else {
        setError(result.error || "Login fehlgeschlagen.");
      }
    }

    setBusy(false);
  };

  const handleGoogle = async () => {
    setError("");
    setSuccess("");
    setBusy(true);

    const result = await loginWithGoogle();
    if (result.success) {
      setSuccess("Login erfolgreich!");
      setTimeout(() => navigate(redirectTo, { replace: true }), 500);
    } else {
      setError(result.error || "Google-Login fehlgeschlagen.");
    }

    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-brand text-4xl font-bold text-anime-brand">Ani-Me</h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {mode === "login"
                ? "Melde dich an und öffne deinen Anime-Feed."
                : "Erstelle deinen Account für Community, Manga und Posts."}
            </p>
          </div>

          <div className="rounded-lg bg-anime-surface border border-anime-border p-6 shadow-xl">
            <div className="grid grid-cols-2 mb-6 rounded-lg bg-secondary p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
                className={`rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anmelden
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccess("");
                }}
                className={`rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "register"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Registrieren
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-md border border-anime-online/30 bg-anime-online/10 px-3 py-2 text-sm text-anime-online">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Benutzername
                  </span>
                  <div className="flex items-center gap-2 rounded-md border border-anime-border bg-secondary px-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="z. B. AnimeCreator99"
                      className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  E-Mail
                </span>
                <div className="flex items-center gap-2 rounded-md border border-anime-border bg-secondary px-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="du@example.com"
                    className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Passwort
                </span>
                <div className="flex items-center gap-2 rounded-md border border-anime-border bg-secondary px-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mindestens 6 Zeichen"
                    className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={busy}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-anime-brand px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />
                {busy ? "Bitte warten..." : mode === "login" ? "Anmelden" : "Account erstellen"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-anime-border" />
              <span className="text-xs text-muted-foreground">oder</span>
              <div className="h-px flex-1 bg-anime-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-anime-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-anime-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Mail className="h-4 w-4 text-anime-brand" />
              Mit Google anmelden
            </button>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {mode === "login" ? "Noch kein Konto?" : "Du hast schon ein Konto?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setSuccess("");
                }}
                className="font-medium text-anime-brand hover:underline"
              >
                {mode === "login" ? "Registrieren" : "Anmelden"}
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
