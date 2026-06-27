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
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const getDefaultAlias = (uid) => {
  if (!uid) return "Anime Fan";
  return `AnimeFan-${uid.slice(0, 5)}`;
};

const mapUser = (fbUser, alias) => {
  if (!fbUser) return null;

  return {
    uid: fbUser.uid,
    email: fbUser.email,
    name: alias || getDefaultAlias(fbUser.uid),
    alias: alias || getDefaultAlias(fbUser.uid),
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

const saveUserProfile = async (fbUser, alias) => {
  if (!fbUser) return;

  const userData = mapUser(fbUser, alias);

  await setDoc(
    doc(db, "users", fbUser.uid),
    {
      uid: userData.uid,
      email: userData.email,
      photoURL: userData.photoURL || null,
      ...(alias ? { name: userData.name, alias: userData.alias } : {}),
      showEmail: false,
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
        getDoc(doc(db, "users", fbUser.uid))
          .then((snapshot) => {
            const profile = snapshot.exists() ? snapshot.data() : null;
            const alias = profile?.alias || profile?.name;
            if (alias) setUser(mapUser(fbUser, alias));
            return saveUserProfile(fbUser);
          })
          .catch(console.error);
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
      const alias = name.trim();
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: alias });
      await saveUserProfile({ ...credential.user, displayName: alias }, alias);
      setUser(mapUser({ ...credential.user, displayName: alias }, alias));
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error) };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const profileSnapshot = await getDoc(doc(db, "users", credential.user.uid));
      const existingProfile = profileSnapshot.exists() ? profileSnapshot.data() : null;
      const alias = existingProfile?.alias || existingProfile?.name || getDefaultAlias(credential.user.uid);
      if (credential.user.displayName !== alias) {
        await updateProfile(credential.user, { displayName: alias });
      }
      await saveUserProfile({ ...credential.user, displayName: alias }, alias);
      setUser(mapUser({ ...credential.user, displayName: alias }, alias));
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error) };
    }
  };

  const updatePhoto = async (photoURL) => {
    if (!auth.currentUser) return { success: false, error: "Nicht eingeloggt." };

    try {
      await updateProfile(auth.currentUser, { photoURL });
      const alias = user?.alias || user?.name;
      await saveUserProfile({ ...auth.currentUser, photoURL }, alias);
      setUser(mapUser({ ...auth.currentUser, photoURL }, alias));
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error) };
    }
  };

  const updateUserProfile = async ({ name, photoURL, bio, settings }) => {
    if (!auth.currentUser) return { success: false, error: "Nicht eingeloggt." };

    try {
      const authUpdate = {};
      if (name !== undefined) authUpdate.displayName = name;
      if (photoURL !== undefined) authUpdate.photoURL = photoURL;

      if (Object.keys(authUpdate).length > 0) {
        await updateProfile(auth.currentUser, authUpdate);
      }

      const alias = name ?? user?.alias ?? user?.name;
      const nextUser = mapUser(
        {
          ...auth.currentUser,
          displayName: alias,
          photoURL: photoURL ?? auth.currentUser.photoURL,
        },
        alias
      );

      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          ...nextUser,
          ...(name !== undefined ? { alias: name } : {}),
          ...(bio !== undefined ? { bio } : {}),
          ...(settings !== undefined ? { settings } : {}),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setUser(nextUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error) };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updatePhoto, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
