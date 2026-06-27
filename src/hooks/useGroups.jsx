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

    await setDoc(doc(db, "groupMembers", getMemberId(user.uid, group.id)), {
      uid: user.uid,
      groupId: group.id,
      groupName: group.name,
      joinedAt: serverTimestamp(),
    });
  };

  const leaveGroup = async (groupId) => {
    if (!user || !groupId) return;
    await deleteDoc(doc(db, "groupMembers", getMemberId(user.uid, groupId)));
  };

  return { groups: groupsWithStatus, memberships, createGroup, joinGroup, leaveGroup };
};
