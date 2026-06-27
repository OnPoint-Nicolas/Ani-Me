import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useFriends } from "@/hooks/useFriends";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const useStories = () => {
  const { user } = useAuth();
  const { friendIds } = useFriends();
  const [stories, setStories] = useState([]);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [viewedStoryIds, setViewedStoryIds] = useState(() => {
    if (typeof window === "undefined" || !user?.uid) return [];

    try {
      return JSON.parse(window.localStorage.getItem(`viewedStories:${user.uid}`) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!user?.uid) {
      setViewedStoryIds([]);
      return;
    }

    try {
      setViewedStoryIds(JSON.parse(window.localStorage.getItem(`viewedStories:${user.uid}`) || "[]"));
    } catch {
      setViewedStoryIds([]);
    }
  }, [user?.uid]);

  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        setError("");
        setStories(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      },
      (snapshotError) => {
        console.error("Stories konnten nicht geladen werden:", snapshotError);
        setError("Stories konnten nicht geladen werden.");
      }
    );
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleStories = useMemo(() => {
    const activeAfter = now - DAY_IN_MS;
    const allowedAuthorIds = new Set(friendIds);
    if (user?.uid) allowedAuthorIds.add(user.uid);

    return stories
      .filter((story) => {
        const createdAt = story.createdAt?.toDate?.()?.getTime?.() || 0;
        return createdAt >= activeAfter;
      })
      .filter((story) => allowedAuthorIds.has(story.authorUid))
      .reduce((latestByAuthor, story) => {
        if (!latestByAuthor.some((item) => item.authorUid === story.authorUid)) {
          latestByAuthor.push({
            ...story,
            isNew: story.authorUid !== user?.uid && !viewedStoryIds.includes(story.id),
          });
        }

        return latestByAuthor;
      }, []);
  }, [friendIds, now, stories, user?.uid, viewedStoryIds]);

  const createStory = async (text, media) => {
    if (!user) return { success: false, error: "Bitte einloggen." };
    if (!text.trim() && !media?.url) return { success: false, error: "Story ist leer." };

    try {
      await addDoc(collection(db, "stories"), {
        authorUid: user.uid,
        authorName: user.name || "Anime Fan",
        authorPhotoURL: user.photoURL || null,
        text: text.trim(),
        mediaUrl: media?.url || null,
        mediaType: media?.type || null,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromMillis(Date.now() + DAY_IN_MS),
      });

      return { success: true };
    } catch (storyError) {
      return {
        success: false,
        error: storyError?.message || "Story konnte nicht gespeichert werden.",
      };
    }
  };

  const markStoryAsViewed = (storyId) => {
    if (!user?.uid || !storyId || viewedStoryIds.includes(storyId)) return;

    const nextViewedStoryIds = [...viewedStoryIds, storyId];
    setViewedStoryIds(nextViewedStoryIds);
    window.localStorage.setItem(`viewedStories:${user.uid}`, JSON.stringify(nextViewedStoryIds));
  };

  return { stories: visibleStories, createStory, markStoryAsViewed, error };
};
