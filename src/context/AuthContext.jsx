import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const mapUser = (fbUser) => {
  if (!fbUser) return null;

  return {
    uid: fbUser.uid,
    email: fbUser.email,
    name: fbUser.displayName || fbUser.email?.split("@")[0] || "Anime Fan",
    photoURL: fbUser.photoURL,
  };
};

const getAuthError = (error) => {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-Mail oder Passwort ist falsch.";
    case "auth/email-already-in-use":
      return "Diese E-Mail ist schon registriert.";
    case "auth/weak-password":
      return "Das Passwort ist zu schwach. Nutze mindestens 6 Zeichen.";
    case "auth/popup-closed-by-user":
      return "Google-Anmeldung wurde abgebrochen.";
    case "auth/unauthorized-domain":
      return "Diese Domain ist in Firebase Auth noch nicht erlaubt.";
    default:
      return error?.message || "Bei der Anmeldung ist etwas schiefgelaufen.";
  }
};

const saveUserProfile = async (fbUser) => {
  if (!fbUser) return;

  const userData = mapUser(fbUser);

  await setDoc(
    doc(db, "users", fbUser.uid),
    {
      ...userData,
      lastSeen: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (fbUser) => {
      setUser(mapUser(fbUser));
      setLoading(false);

      if (fbUser) {
        saveUserProfile(fbUser).catch(console.error);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const touchUser = () => saveUserProfile(auth.currentUser).catch(console.error);
    const timer = window.setInterval(touchUser, 60_000);

    return () => window.clearInterval(timer);
  }, [user]);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error) };
    }
  };

  const register = async (name, email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await saveUserProfile({ ...credential.user, displayName: name });
      setUser(mapUser({ ...credential.user, displayName: name }));
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error) };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await saveUserProfile(credential.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error) };
    }
  };

  const updatePhoto = async (photoURL) => {
    if (!auth.currentUser) return { success: false, error: "Nicht eingeloggt." };

    try {
      await updateProfile(auth.currentUser, { photoURL });
      await saveUserProfile({ ...auth.currentUser, photoURL });
      setUser(mapUser({ ...auth.currentUser, photoURL }));
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error) };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updatePhoto }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
