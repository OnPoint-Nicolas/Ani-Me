import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

// ============================================================
// usePosts – Custom Hook für den Firestore-Newsfeed
// ============================================================

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();

          return {
            id: d.id,
            authorUid: data.authorUid || "",
            authorName: data.authorName || "Unbekannt",
            text: data.text || "",
            mediaUrl: data.mediaUrl || data.imageUrl || null,
            mediaType: data.mediaType || (data.imageUrl ? "image" : null),
            createdAt: data.createdAt?.toDate?.() || new Date(),
            likes: data.likes || 0,
          };
        });

        setPosts(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  const createPost = async (text, mediaUrl, mediaType) => {
    if (!user) return { success: false, error: "Bitte einloggen." };

    if (!text?.trim() && !mediaUrl) {
      return { success: false, error: "Post ist leer." };
    }

    try {
      await addDoc(collection(db, "posts"), {
        authorUid: user.uid,
        authorName: user.name,
        text: text?.trim() || "",
        mediaUrl: mediaUrl || null,
        mediaType: mediaUrl ? mediaType || "image" : null,
        likes: 0,
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err?.message || "Fehler beim Speichern.",
      };
    }
  };

  return { posts, loading, createPost };
};
