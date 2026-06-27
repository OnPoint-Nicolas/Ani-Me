import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

const getMemberId = (uid, groupId) => `${uid}_${groupId}`;

const defaultGroupSuggestions = [
  {
    id: "suggestion-shonen-power",
    name: "Shonen Power Club",
    desc: "Für One Piece, Jujutsu Kaisen, Solo Leveling und große Arc-Diskussionen.",
    category: "Diskussion",
    suggested: true,
  },
  {
    id: "suggestion-dark-manga",
    name: "Dark Manga Readers",
    desc: "Berserk, Chainsaw Man und düstere Manga ohne unnötige Spoiler.",
    category: "Manga-Buddy",
    suggested: true,
  },
  {
    id: "suggestion-romance-lounge",
    name: "Romance Manga Lounge",
    desc: "Romance Manga Empfehlungen, Leselisten und Read-Buddys.",
    category: "Empfehlungen",
    suggested: true,
  },
  {
    id: "suggestion-anime-news",
    name: "Anime News Radar",
    desc: "Neue Folgen, Trailer, Manga-Releases und Studio-News.",
    category: "News",
    suggested: true,
  },
];

export const useGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    if (!user) return undefined;
    return onSnapshot(collection(db, "groups"), (snapshot) => {
      setGroups(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    const q = query(collection(db, "groupMembers"), where("uid", "==", user.uid));

    return onSnapshot(q, (snapshot) => {
      setMemberships(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, [user]);

  const joinedGroupIds = useMemo(
    () => memberships.map((membership) => membership.groupId),
    [memberships]
  );

  const groupsWithStatus = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        joined: joinedGroupIds.includes(group.id),
      })),
    [groups, joinedGroupIds]
  );

  const joinedGroups = useMemo(
    () => groupsWithStatus.filter((group) => group.joined),
    [groupsWithStatus]
  );

  const suggestedGroups = useMemo(() => {
    const joinedNames = new Set(joinedGroups.map((group) => group.name.toLowerCase()));
    const realGroupNames = new Set(groupsWithStatus.map((group) => group.name.toLowerCase()));
    const realSuggestions = groupsWithStatus.filter((group) => !group.joined);
    const templateSuggestions = defaultGroupSuggestions.filter(
      (group) => !joinedNames.has(group.name.toLowerCase()) && !realGroupNames.has(group.name.toLowerCase())
    );

    return [...realSuggestions, ...templateSuggestions];
  }, [groupsWithStatus, joinedGroups]);

  const createGroup = async ({ name, desc, category }) => {
    if (!user) return { success: false, error: "Bitte einloggen." };
    if (!name.trim()) return { success: false, error: "Gruppenname fehlt." };

    const groupRef = await addDoc(collection(db, "groups"), {
      name: name.trim(),
      desc: desc.trim(),
      category: category || "Allgemein",
      ownerUid: user.uid,
      ownerName: user.name || "Anime Fan",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "groupMembers", getMemberId(user.uid, groupRef.id)), {
      uid: user.uid,
      groupId: groupRef.id,
      groupName: name.trim(),
      joinedAt: serverTimestamp(),
    });

    return { success: true };
  };

  const joinGroup = async (group) => {
    if (!user || !group?.id) return;

    let groupId = group.id;
    let groupName = group.name;

    if (group.suggested) {
      const groupRef = await addDoc(collection(db, "groups"), {
        name: group.name,
        desc: group.desc || "",
        category: group.category || "Allgemein",
        ownerUid: user.uid,
        ownerName: user.alias || user.name || "Anime Fan",
        createdFromSuggestion: true,
        createdAt: serverTimestamp(),
      });

      groupId = groupRef.id;
      groupName = group.name;
    }

    await setDoc(doc(db, "groupMembers", getMemberId(user.uid, groupId)), {
      uid: user.uid,
      groupId,
      groupName,
      joinedAt: serverTimestamp(),
    });
  };

  const leaveGroup = async (groupId) => {
    if (!user || !groupId) return;
    await deleteDoc(doc(db, "groupMembers", getMemberId(user.uid, groupId)));
  };

  return {
    groups: groupsWithStatus,
    joinedGroups,
    suggestedGroups,
    memberships,
    createGroup,
    joinGroup,
    leaveGroup,
  };
};
