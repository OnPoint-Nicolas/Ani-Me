import { useMemo, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Flame,
  MessageCircle,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useFriends } from "@/hooks/useFriends";
import { useGroups } from "@/hooks/useGroups";
import { useUserProfile } from "@/hooks/useUserProfile";
import { db } from "@/lib/firebase";
import { useLocation } from "react-router-dom";

const FAVORITE_OPTIONS = [
  "One Piece",
  "Jujutsu Kaisen",
  "Solo Leveling",
  "Berserk",
  "Romance Manga",
  "Demon Slayer",
  "Attack on Titan",
  "Chainsaw Man",
  "Frieren",
  "Naruto",
  "My Hero Academia",
  "Blue Lock",
];

const FALLBACK_MATCHES = [
  {
    uid: "demo-max",
    name: "Max",
    role: "Watch-Buddy",
    photoURL: null,
    online: true,
    animeFavorites: ["One Piece", "Jujutsu Kaisen", "Solo Leveling", "Berserk", "Blue Lock"],
  },
  {
    uid: "demo-yuna",
    name: "Yuna",
    role: "Manga-Buddy",
    photoURL: null,
    online: true,
    animeFavorites: ["Romance Manga", "Frieren", "Demon Slayer", "Jujutsu Kaisen", "Naruto"],
  },
  {
    uid: "demo-kenji",
    name: "Kenji",
    role: "Diskussionspartner",
    photoURL: null,
    online: false,
    animeFavorites: ["Berserk", "Chainsaw Man", "Attack on Titan", "Solo Leveling", "One Piece"],
  },
];

const TRENDING_DISCUSSIONS = [
  { title: "Jujutsu Kaisen: stärkster aktueller Arc?", tag: "spoilerfrei bis Folge 23", live: 28 },
  { title: "Solo Leveling: Anime vs. Manhwa Tempo", tag: "Read-Buddy gesucht", live: 14 },
  { title: "Romance Manga Empfehlungen ohne Kitsch", tag: "neue Antworten", live: 9 },
];

const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

const normalize = (value) => value.toLowerCase().trim();

const getMatchData = (currentFavorites, targetFavorites = []) => {
  if (currentFavorites.length === 0 || targetFavorites.length === 0) {
    return { percent: 0, shared: [] };
  }

  const targetSet = new Set(targetFavorites.map(normalize));
  const shared = currentFavorites.filter((favorite) => targetSet.has(normalize(favorite)));
  const percent = Math.round((shared.length / Math.max(currentFavorites.length, targetFavorites.length)) * 100);

  return { percent, shared };
};

const Avatar = ({ person, size = "md" }) => {
  const dimension = size === "lg" ? "w-14 h-14" : "w-12 h-12";

  return (
    <div className="relative shrink-0">
      {person.photoURL ? (
        <img src={person.photoURL} alt={person.name} className={`${dimension} rounded-full object-cover ring-2 ring-white/10`} />
      ) : (
        <div className={`${dimension} grid place-items-center rounded-full bg-[linear-gradient(135deg,hsl(var(--anime-brand)),hsl(var(--primary)))] text-sm font-bold text-white shadow-lg shadow-primary/20`}>
          {getInitial(person.name)}
        </div>
      )}
      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-anime-surface ${person.online ? "bg-anime-online" : "bg-anime-offline"}`} />
    </div>
  );
};

const MatchRing = ({ percent }) => (
  <div
    className="grid h-14 w-14 place-items-center rounded-full text-xs font-black text-white shadow-lg shadow-primary/20"
    style={{
      background: `conic-gradient(hsl(var(--anime-brand)) ${percent * 3.6}deg, hsl(var(--secondary)) 0deg)`,
    }}
  >
    <span className="grid h-11 w-11 place-items-center rounded-full bg-background/90">{percent}%</span>
  </div>
);

const Community = () => {
  const location = useLocation();
  const initialTab = new URLSearchParams(location.search).get("tab") || "match";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(["match", "mitglieder", "gruppen", "aktivitaet"].includes(initialTab) ? initialTab : "match");
  const [favoriteDraft, setFavoriteDraft] = useState("");
  const [groupForm, setGroupForm] = useState({ name: "", desc: "", category: "Allgemein" });
  const [groupError, setGroupError] = useState("");
  const [busyGroupId, setBusyGroupId] = useState("");
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const {
    discoverUsers,
    incomingRequests,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
  } = useFriends();
  const { groups, joinedGroups, suggestedGroups, memberships, createGroup, joinGroup, leaveGroup } = useGroups();

  const myFavorites = profile?.animeFavorites?.length ? profile.animeFavorites : FAVORITE_OPTIONS.slice(0, 5);

  const saveFavorites = async (nextFavorites) => {
    if (!user?.uid) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        animeFavorites: nextFavorites.slice(0, 5),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const toggleFavorite = (favorite) => {
    const exists = myFavorites.some((item) => normalize(item) === normalize(favorite));
    const nextFavorites = exists
      ? myFavorites.filter((item) => normalize(item) !== normalize(favorite))
      : [...myFavorites, favorite].slice(0, 5);

    saveFavorites(nextFavorites);
  };

  const addCustomFavorite = (event) => {
    event.preventDefault();
    const nextFavorite = favoriteDraft.trim();
    if (!nextFavorite || myFavorites.length >= 5) return;

    saveFavorites([...myFavorites, nextFavorite]);
    setFavoriteDraft("");
  };

  const submitGroup = async (event) => {
    event.preventDefault();
    setGroupError("");

    const result = await createGroup(groupForm);
    if (!result.success) {
      setGroupError(result.error || "Gruppe konnte nicht erstellt werden.");
      return;
    }

    setGroupForm({ name: "", desc: "", category: "Allgemein" });
  };

  const selectGroup = async (group) => {
    setGroupError("");
    setBusyGroupId(group.id);

    try {
      await joinGroup(group);
    } catch {
      setGroupError("Gruppe konnte nicht ausgewählt werden.");
    } finally {
      setBusyGroupId("");
    }
  };

  const unselectGroup = async (groupId) => {
    setGroupError("");
    setBusyGroupId(groupId);

    try {
      await leaveGroup(groupId);
    } catch {
      setGroupError("Gruppe konnte nicht abgewählt werden.");
    } finally {
      setBusyGroupId("");
    }
  };

  const matchedUsers = useMemo(() => {
    const sourceUsers = discoverUsers.length > 0 ? discoverUsers : FALLBACK_MATCHES;

    return sourceUsers
      .map((person, index) => {
        const fallbackFavorites = FALLBACK_MATCHES[index % FALLBACK_MATCHES.length]?.animeFavorites || [];
        const favorites = person.animeFavorites?.length ? person.animeFavorites : fallbackFavorites;
        const match = getMatchData(myFavorites, favorites);

        return { ...person, animeFavorites: favorites, matchPercent: match.percent, sharedFavorites: match.shared };
      })
      .sort((a, b) => b.matchPercent - a.matchPercent);
  }, [discoverUsers, myFavorites]);

  const topMatches = matchedUsers.slice(0, 5);
  const bestMatch = topMatches[0];

  const recommendedGroups = useMemo(() => {
    const realGroups = [...joinedGroups, ...suggestedGroups]
      .map((group) => {
        const text = `${group.name || ""} ${group.desc || ""} ${group.category || ""}`.toLowerCase();
        const shared = myFavorites.filter((favorite) => text.includes(normalize(favorite).split(" ")[0]));

        return { ...group, matchPercent: shared.length ? 86 : 64, sharedFavorites: shared };
      })
      .sort((a, b) => b.matchPercent - a.matchPercent);

    if (realGroups.length > 0) return realGroups.slice(0, 3);

    return suggestedGroups.slice(0, 3).map((group, index) => ({
      ...group,
      matchPercent: 92 - index * 8,
      sharedFavorites: myFavorites.slice(0, Math.max(1, 2 - index)),
    }));
  }, [joinedGroups, myFavorites, suggestedGroups]);

  const filteredUsers = matchedUsers.filter(
    (person) =>
      person.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.animeFavorites?.some((favorite) => favorite.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupSearchValue = searchQuery.toLowerCase();

  const matchesGroupSearch = (group) =>
    group.name?.toLowerCase().includes(groupSearchValue) ||
    group.category?.toLowerCase().includes(groupSearchValue) ||
    group.desc?.toLowerCase().includes(groupSearchValue);

  const filteredJoinedGroups = joinedGroups.filter(matchesGroupSearch);
  const filteredSuggestedGroups = suggestedGroups.filter(matchesGroupSearch);
  const filteredGroups = groups.filter(
    (group) =>
      group.name?.toLowerCase().includes(groupSearchValue) ||
      group.category?.toLowerCase().includes(groupSearchValue) ||
      group.desc?.toLowerCase().includes(groupSearchValue)
  );

  const activities = [
    ...incomingRequests.map((request) => ({
      id: `request-${request.id}`,
      user: request.fromName,
      action: "hat dir eine Freundschaftsanfrage gesendet",
      time: "neu",
    })),
    ...discoverUsers
      .filter((person) => person.isFriend)
      .map((person) => ({
        id: `friend-${person.uid}`,
        user: person.name,
        action: person.online ? "ist gerade online" : "ist in deiner Freundesliste",
        time: person.online ? "jetzt" : "Freund",
      })),
    ...memberships.map((membership) => ({
      id: `group-${membership.id}`,
      user: "Du",
      action: `bist in der Gruppe "${membership.groupName}"`,
      time: "Gruppe",
    })),
  ];

  const tabs = [
    { key: "match", label: "Match Feed", icon: Sparkles },
    { key: "mitglieder", label: "Mitglieder", icon: Users },
    { key: "gruppen", label: "Gruppen", icon: Shield },
    { key: "aktivitaet", label: "Aktivität", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="anime-hero-panel mb-6 overflow-hidden rounded-lg border border-white/10 p-5 shadow-2xl shadow-black/30 md:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-anime-brand">
                <Sparkles className="h-4 w-4" />
                Anime Match Feed
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight text-foreground md:text-5xl">
                Finde Leute, Gruppen und Diskussionen, die wirklich zu deinem Anime-Geschmack passen.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Ani-Me vergleicht deine fünf Favoriten mit anderen Profilen. Daraus entstehen Match-Prozente, gemeinsame Serien und direkte Buddy-Vorschläge.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-background/45 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Bester Match</p>
                  <h2 className="text-xl font-black text-foreground">{bestMatch?.name || "Noch kein Match"}</h2>
                </div>
                <MatchRing percent={bestMatch?.matchPercent || 0} />
              </div>
              <div className="flex flex-wrap gap-2">
                {(bestMatch?.sharedFavorites?.length ? bestMatch.sharedFavorites : myFavorites.slice(0, 3)).map((favorite) => (
                  <span key={favorite} className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-foreground">
                    {favorite}
                  </span>
                ))}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-bold text-black shadow-lg shadow-white/10 transition-transform hover:-translate-y-0.5">
                Watch-/Read-Buddy Chat starten
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nutzer, Gruppen oder Lieblingsanime suchen..."
              className="h-12 w-full rounded-lg border border-white/10 bg-anime-surface/75 pl-10 pr-4 text-sm text-foreground shadow-xl shadow-black/10 backdrop-blur-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-anime-surface/75 px-4 py-3 text-xs text-muted-foreground shadow-xl shadow-black/10 backdrop-blur-xl md:min-w-64">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {discoverUsers.length + 1} Mitglieder
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> {joinedGroups.length} ausgewählt
            </span>
          </div>
        </div>

        <div className="mb-6 grid gap-2 rounded-lg border border-white/10 bg-black/20 p-1 shadow-xl shadow-black/10 backdrop-blur-xl sm:grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex h-11 items-center justify-center gap-2 rounded-md text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "match" && (
          <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <section className="rounded-lg border border-white/10 bg-anime-surface/80 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">Dein Match-Profil</h2>
                  <p className="text-xs text-muted-foreground">Wähle bis zu 5 Favoriten.</p>
                </div>
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">{myFavorites.length}/5</span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {FAVORITE_OPTIONS.map((favorite) => {
                  const active = myFavorites.some((item) => normalize(item) === normalize(favorite));
                  return (
                    <button
                      key={favorite}
                      type="button"
                      onClick={() => toggleFavorite(favorite)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? "border-anime-brand bg-anime-brand text-white shadow-lg shadow-anime-brand/20"
                          : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      {favorite}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={addCustomFavorite} className="flex gap-2">
                <input
                  value={favoriteDraft}
                  onChange={(event) => setFavoriteDraft(event.target.value)}
                  disabled={myFavorites.length >= 5}
                  placeholder={myFavorites.length >= 5 ? "Limit erreicht" : "Eigenen Titel hinzufügen"}
                  className="min-w-0 flex-1 rounded-md border border-white/10 bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
                <button type="submit" disabled={myFavorites.length >= 5} className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-40">
                  <Plus className="h-4 w-4" />
                </button>
              </form>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-anime-surface/80 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-black">Diese Nutzer passen zu dir</h2>
                  <Flame className="h-5 w-5 text-anime-brand" />
                </div>
                <div className="space-y-3">
                  {topMatches.map((person) => (
                    <div key={person.uid} className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition-all hover:-translate-y-0.5 hover:bg-white/[0.08]">
                      <Avatar person={person} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold">{person.name}</p>
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">{person.matchPercent}% Match</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          Gemeinsam: {person.sharedFavorites.length ? person.sharedFavorites.join(", ") : "Geschmack wird noch gelernt"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => sendRequest(person)}
                        disabled={person.uid?.startsWith("demo-") || person.isFriend || person.requestSent || person.requestIncoming || person.requestDisabled}
                        className="grid h-9 w-9 place-items-center rounded-md bg-white text-black transition-transform group-hover:scale-105 disabled:opacity-40"
                        title="Anfrage senden"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border border-white/10 bg-anime-surface/80 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
                  <h2 className="mb-3 text-lg font-black">Passende Gruppen</h2>
                  <div className="space-y-3">
                    {recommendedGroups.map((group) => (
                      <div key={group.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">{group.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{group.desc}</p>
                          </div>
                          <span className="rounded-full bg-anime-online/15 px-2 py-1 text-[10px] font-bold text-anime-online">{group.matchPercent}%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => (group.joined ? unselectGroup(group.id) : selectGroup(group))}
                          disabled={busyGroupId === group.id}
                          className={`mt-3 rounded-md px-3 py-1.5 text-[10px] font-bold transition-colors ${
                            group.joined ? "bg-anime-online/20 text-anime-online" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {busyGroupId === group.id ? "Speichert..." : group.joined ? "Ausgewählt" : "Auswählen"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-anime-surface/80 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
                  <h2 className="mb-3 text-lg font-black">Diskussionen jetzt</h2>
                  <div className="space-y-3">
                    {TRENDING_DISCUSSIONS.map((discussion) => (
                      <button key={discussion.title} className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left transition-colors hover:bg-white/[0.08]">
                        <BookOpenCheck className="h-5 w-5 shrink-0 text-anime-brand" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold">{discussion.title}</span>
                          <span className="text-xs text-muted-foreground">{discussion.tag}</span>
                        </span>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-muted-foreground">{discussion.live} live</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "mitglieder" && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {incomingRequests.map((request) => (
              <div key={request.id} className="flex items-center gap-3 rounded-lg border border-anime-border bg-anime-surface/85 p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
                <Avatar person={{ name: request.fromName, photoURL: request.fromPhotoURL, online: false }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{request.fromName}</p>
                  <p className="text-[10px] text-muted-foreground">möchte befreundet sein</p>
                </div>
                <button type="button" onClick={() => acceptRequest(request)} className="rounded-md bg-anime-online/20 p-2 text-anime-online" title="Annehmen">
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => declineRequest(request)} className="rounded-md bg-destructive/10 p-2 text-destructive" title="Ablehnen">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {filteredUsers.map((person) => (
              <div
                key={person.uid}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-anime-surface/85 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-anime-surface-hover"
              >
                <Avatar person={person} size="lg" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{person.name}</p>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">{person.matchPercent}% Match</span>
                  </div>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {person.sharedFavorites.length ? person.sharedFavorites.join(", ") : person.isFriend ? "Freund" : person.requestSent ? "Anfrage gesendet" : person.requestIncoming ? "Anfrage offen" : person.role || "Anime-Fan"}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button className="rounded-md bg-secondary p-2 transition-colors hover:bg-primary hover:text-primary-foreground" title="Buddy Chat">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </button>

                  {person.isFriend ? (
                    <button type="button" onClick={() => removeFriend(person.uid)} className="rounded-md bg-destructive/10 p-2 text-destructive" title="Freund entfernen">
                      <UserMinus className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => sendRequest(person)} disabled={person.uid?.startsWith("demo-") || person.requestSent || person.requestIncoming || person.requestDisabled} className="rounded-md bg-secondary p-2 transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50" title={person.requestDisabled ? "Anfragen deaktiviert" : "Anfrage senden"}>
                      <UserPlus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && incomingRequests.length === 0 && (
              <p className="text-sm text-muted-foreground">Keine Nutzer gefunden.</p>
            )}
          </div>
        )}

        {activeTab === "gruppen" && (
          <>
            <form onSubmit={submitGroup} className="mb-4 grid gap-2 rounded-lg border border-white/10 bg-anime-surface/85 p-4 shadow-xl shadow-black/10 backdrop-blur-xl md:grid-cols-[1fr_1fr_160px_auto]">
              <input
                value={groupForm.name}
                onChange={(event) => setGroupForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Gruppenname"
                className="rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                value={groupForm.desc}
                onChange={(event) => setGroupForm((prev) => ({ ...prev, desc: event.target.value }))}
                placeholder="Kurze Beschreibung"
                className="rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select
                value={groupForm.category}
                onChange={(event) => setGroupForm((prev) => ({ ...prev, category: event.target.value }))}
                className="rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>Allgemein</option>
                <option>Kreativ</option>
                <option>Diskussion</option>
                <option>Manga-Buddy</option>
                <option>News</option>
              </select>
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                Erstellen
              </button>
              {groupError && <p className="text-xs text-destructive md:col-span-4">{groupError}</p>}
            </form>

            <section className="mb-5 rounded-lg border border-white/10 bg-anime-surface/85 p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">Deine ausgewählten Gruppen</h2>
                  <p className="text-xs text-muted-foreground">Diese Gruppen erscheinen automatisch auf deinem Dashboard.</p>
                </div>
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">{joinedGroups.length}</span>
              </div>

              {filteredJoinedGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {joinedGroups.length === 0 ? "Du hast noch keine Gruppe ausgewählt." : "Keine ausgewählte Gruppe passt zur Suche."}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filteredJoinedGroups.map((group) => (
                    <div key={group.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{group.name}</h3>
                          <span className="rounded bg-anime-online/20 px-1.5 py-0.5 text-[9px] text-anime-online">{group.category}</span>
                        </div>
                        <Check className="h-4 w-4 text-anime-online" />
                      </div>
                      <p className="min-h-8 text-[10px] text-muted-foreground">{group.desc || "Keine Beschreibung vorhanden."}</p>
                      <button
                        type="button"
                        onClick={() => unselectGroup(group.id)}
                        disabled={busyGroupId === group.id}
                        className="mt-3 rounded-md bg-destructive/10 px-3 py-1 text-[10px] font-bold text-destructive disabled:opacity-50"
                      >
                        {busyGroupId === group.id ? "Speichert..." : "Abwählen"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-5 rounded-lg border border-white/10 bg-anime-surface/85 p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
              <div className="mb-3">
                <h2 className="text-lg font-black">Vorgeschlagene Gruppen</h2>
                <p className="text-xs text-muted-foreground">Hier wählst du Gruppen aus. Danach tauchen sie bei “Deine Gruppen” und auf dem Dashboard auf.</p>
              </div>

              {filteredSuggestedGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">Keine vorgeschlagene Gruppe passt zur Suche.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSuggestedGroups.map((group) => (
                    <div key={group.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition-all hover:-translate-y-0.5 hover:bg-white/[0.08]">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{group.name}</h3>
                          <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary">{group.category}</span>
                        </div>
                        <Star className="h-4 w-4 text-anime-brand" />
                      </div>
                      <p className="min-h-8 text-[10px] text-muted-foreground">{group.desc || "Keine Beschreibung vorhanden."}</p>
                      <button
                        type="button"
                        onClick={() => selectGroup(group)}
                        disabled={busyGroupId === group.id}
                        className="mt-3 rounded-md bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground disabled:opacity-50"
                      >
                        {busyGroupId === group.id ? "Speichert..." : "Auswählen"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <h2 className="mb-3 text-lg font-black">Alle Gruppen</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredGroups.map((g) => (
                <div
                  key={g.id}
                  className="rounded-lg border border-white/10 bg-anime-surface/85 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-anime-surface-hover"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{g.name}</h3>
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary">{g.category}</span>
                    </div>

                    <Star className="h-4 w-4 cursor-pointer text-muted-foreground transition-colors hover:text-anime-brand" />
                  </div>

                  <p className="mt-2 text-[10px] text-muted-foreground">{g.desc}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="h-3 w-3" /> Gruppe
                    </span>

                    <button
                      onClick={() => (g.joined ? unselectGroup(g.id) : selectGroup(g))}
                      disabled={busyGroupId === g.id}
                      className={`flex items-center gap-1 rounded-md px-3 py-1 text-[10px] font-medium transition-colors ${
                        g.joined
                          ? "bg-anime-online/20 text-anime-online"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {busyGroupId === g.id ? (
                        "Speichert..."
                      ) : g.joined ? (
                        <>
                          <Check className="h-3 w-3" /> Beigetreten
                        </>
                      ) : (
                        "Beitreten"
                      )}
                    </button>
                  </div>
                </div>
              ))}
              {filteredGroups.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {groups.length === 0 ? "Noch keine echten Gruppen vorhanden. Wähle oben eine vorgeschlagene Gruppe oder erstelle eine neue." : "Keine Gruppe passt zur Suche."}
                </p>
              )}
            </div>
          </>
        )}

        {activeTab === "aktivitaet" && (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-anime-surface/85 p-3 shadow-xl shadow-black/10 backdrop-blur-xl"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {activity.user.charAt(0)}
                </div>

                <div className="flex-1">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-[9px] text-muted-foreground">{activity.time}</p>
                </div>

                <TrendingUp className="h-3 w-3 text-muted-foreground" />
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-sm text-muted-foreground">Noch keine Aktivitäten vorhanden.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Community;
