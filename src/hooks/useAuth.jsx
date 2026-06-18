// ============================================================
// useAuth – dünner Wrapper um useAuthContext
// ----------------------------------------------------------------
// Damit alle bestehenden Komponenten weiter `useAuth()` nutzen
// können, leiten wir hier einfach auf den Firebase-Context weiter.
// So gibt es nur EINE Wahrheit für den eingeloggten Benutzer.
// ============================================================
export { useAuthContext as useAuth } from "@/context/AuthContext";