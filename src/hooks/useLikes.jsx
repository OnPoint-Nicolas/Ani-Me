import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export const useLikes = (postId, enabled = true, initialCount = 0) => {
  const { user } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled || !postId) return undefined;

    return onSnapshot(
      collection(db, "posts", postId, "likes"),
      (snapshot) => {
        setError("");
        setCount(snapshot.size);
        setLiked(Boolean(user && snapshot.docs.some((item) => item.id === user.uid)));
      },
      (snapshotError) => {
        console.error("Likes konnten nicht geladen werden:", snapshotError);
        setError("Likes konnten nicht geladen werden.");
      }
    );
  }, [enabled, postId, user]);

  const toggleLike = async () => {
    if (!user || !postId) {
      setError("Bitte einloggen, um zu liken.");
      return;
    }

    const likeRef = doc(db, "posts", postId, "likes", user.uid);
    const nextLiked = !liked;

    setError("");
    setLiked(nextLiked);
    setCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));

    try {
      if (!nextLiked) {
        await deleteDoc(likeRef);
        return;
      }

      await setDoc(likeRef, {
        authorUid: user.uid,
        authorName: user.name || "Anime Fan",
        createdAt: serverTimestamp(),
      });
    } catch (likeError) {
      console.error("Like konnte nicht gespeichert werden:", likeError);
      setLiked(liked);
      setCount((current) => Math.max(0, current + (nextLiked ? -1 : 1)));
      setError("Like konnte nicht gespeichert werden. Prüfe Firestore-Regeln.");
    }
  };

  return { count, liked, error, toggleLike };
};
