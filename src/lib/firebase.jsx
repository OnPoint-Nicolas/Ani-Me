import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Config (öffentlich – kein Geheimnis, auch wenn es sich so anfühlt)
const firebaseConfig = {
  apiKey: "AIzaSyDnIQa5-vErgdKnScd1DMYNd2KhrA8b_EA",
  authDomain: "anime-sandbox.firebaseapp.com",
  databaseURL: "https://anime-sandbox-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "anime-sandbox",
  storageBucket: "anime-sandbox.firebasestorage.app",
  messagingSenderId: "548551806508",
  appId: "1:548551806508:web:319e69ff57ad93a3ce4b89",
  measurementId: "G-DVZ2DD4W7F"
};

// App initialisieren
const app = initializeApp(firebaseConfig);

// Services exportieren
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
