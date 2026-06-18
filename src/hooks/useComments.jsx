import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export const useComments = (postId, enabled = true) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!enabled || !postId) return undefined;

    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  }, [enabled, postId]);

  const addComment = async (text) => {
    if (!user) return { success: false, error: "Bitte einloggen." };
    if (!postId) return { success: false, error: "Post fehlt." };
    if (!text.trim()) return { success: false, error: "Kommentar ist leer." };

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: text.trim(),
        authorUid: user.uid,
        authorName: user.name || "Anime Fan",
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "Kommentar konnte nicht gespeichert werden.",
      };
    }
  };

  return { comments, addComment };
};
