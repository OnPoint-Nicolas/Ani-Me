import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

const getFriendshipId = (uidA, uidB) => [uidA, uidB].sort().join("_");

const isOnline = (lastSeen) => {
  const date = lastSeen?.toDate?.();
  if (!date) return false;

  return Date.now() - date.getTime() < 2 * 60 * 1000;
};

export const useFriends = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendships, setFriendships] = useState([]);

  useEffect(() => {
    if (!user) return undefined;

    return onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(
        snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .filter((item) => item.uid !== user.uid)
      );
    });
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const q = query(
      collection(db, "friendRequests"),
      where("toUid", "==", user.uid),
      where("status", "==", "pending")
    );

    return onSnapshot(q, (snapshot) => {
      setIncomingRequests(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const q = query(
      collection(db, "friendRequests"),
      where("fromUid", "==", user.uid),
      where("status", "==", "pending")
    );

    return onSnapshot(q, (snapshot) => {
      setSentRequests(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const q = query(
      collection(db, "friendships"),
      where("members", "array-contains", user.uid)
    );

    return onSnapshot(q, (snapshot) => {
      setFriendships(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, [user]);

  const friendIds = useMemo(() => {
    return friendships.flatMap((friendship) =>
      friendship.members.filter((uid) => uid !== user?.uid)
    );
  }, [friendships, user]);

  const friends = useMemo(() => {
    return users
      .filter((item) => friendIds.includes(item.uid))
      .map((item) => ({ ...item, online: isOnline(item.lastSeen) }));
  }, [friendIds, users]);

  const suggestions = useMemo(() => {
    const requestedIds = sentRequests.map((request) => request.toUid);
    const incomingIds = incomingRequests.map((request) => request.fromUid);

    return users
      .filter((item) => !friendIds.includes(item.uid))
      .filter((item) => !requestedIds.includes(item.uid))
      .filter((item) => !incomingIds.includes(item.uid))
      .slice(0, 4);
  }, [friendIds, incomingRequests, sentRequests, users]);

  const sendRequest = async (targetUser) => {
    if (!user) return;

    const requestId = `${user.uid}_${targetUser.uid}`;

    await setDoc(doc(db, "friendRequests", requestId), {
      fromUid: user.uid,
      fromName: user.name,
      fromPhotoURL: user.photoURL || null,
      toUid: targetUser.uid,
      toName: targetUser.name,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  };

  const acceptRequest = async (request) => {
    if (!user) return;

    const friendshipId = getFriendshipId(request.fromUid, request.toUid);
    const batch = writeBatch(db);

    batch.set(doc(db, "friendships", friendshipId), {
      members: [request.fromUid, request.toUid],
      createdAt: serverTimestamp(),
    });
    batch.update(doc(db, "friendRequests", request.id), {
      status: "accepted",
      acceptedAt: serverTimestamp(),
    });

    await batch.commit();
  };

  const declineRequest = async (request) => {
    await updateDoc(doc(db, "friendRequests", request.id), {
      status: "declined",
      declinedAt: serverTimestamp(),
    });
  };

  return {
    friends,
    friendIds,
    suggestions,
    incomingRequests,
    sentRequests,
    sendRequest,
    acceptRequest,
    declineRequest,
  };
};
