
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import AniMe from "./pages/AniMe.jsx";
import Landing from "./pages/Landing.jsx";
import MangaSearch from "./pages/MangaSearch.jsx";
import MangaDetail from "./pages/MangaDetail.jsx";
import Videos from "./pages/Videos.jsx";
import Community from "./pages/Community.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

import ProfilePage from "./pages/ProfilePage.jsx";
// import QuizPage from "./pages/QuizPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

import Impressum from "./pages/Impressum.jsx";
import Datenschutz from "./pages/Datenschutz.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "@/hooks/useAuth";
import backgroundImage from "@/assets/group-16.jpg";

// ----------------------------------------------------------------
// HomeGate – entscheidet, was auf "/" angezeigt wird:
// - Eingeloggte Nutzer sehen ihr Dashboard (AniMe-Feed)
// - Gäste sehen die öffentliche Landing-Page mit Marketing-Inhalt
// ----------------------------------------------------------------
const HomeGate = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Lade...</p>
      </div>
    );
  }
  return user ? <AniMe /> : <Landing />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="relative isolate min-h-screen overflow-x-hidden">
          <div
            className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
          />
          <div className="fixed inset-0 -z-10 bg-background/45" />

          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Öffentlich zugänglich: Auth + Pflicht-Seiten */}
              <Route path="/auth" element={<AuthPage />} />

              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />

              {/* Alle weiteren Seiten sind nur nach Login sichtbar */}
              <Route path="/" element={<HomeGate />} />
              <Route path="/dashboard" element={<ProtectedRoute><AniMe /></ProtectedRoute>} />
              <Route path="/manga" element={<ProtectedRoute><MangaSearch /></ProtectedRoute>} />
              <Route path="/manga/:id" element={<ProtectedRoute><MangaDetail /></ProtectedRoute>} />
              <Route path="/videos" element={<ProtectedRoute><Videos /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              {/* <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
