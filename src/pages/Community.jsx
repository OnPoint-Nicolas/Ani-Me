import { useState } from "react";
import Footer from "@/components/Footer";
import {
  Users,
  MessageCircle,
  UserPlus,
  UserMinus,
  Search,
  TrendingUp,
  Shield,
  Star,
  Check,
  X,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { useFriends } from "@/hooks/useFriends";

const groups = [
  { name: "Manga Creators", members: 1234, desc: "Für alle die Manga zeichnen und schreiben", joined: false, category: "Kreativ" },
  { name: "Cosplay Freunde", members: 876, desc: "Teile deine Cosplay Projekte", joined: true, category: "Hobby" },
  { name: "Anime Reviewer", members: 2341, desc: "Diskutiere die neuesten Anime Serien", joined: false, category: "Diskussion" },
  { name: "Figure Collectors", members: 567, desc: "Anime Figuren sammeln und tauschen", joined: false, category: "Hobby" },
  { name: "Fan Art Gallery", members: 1890, desc: "Zeige und bewerte Fan Art Werke", joined: true, category: "Kreativ" },
  { name: "Anime News", members: 3456, desc: "Aktuelle Nachrichten aus der Anime Welt", joined: false, category: "News" },
];

const activities = [
  { user: "Sakura Tanaka", action: "hat ein neues Manga-Panel geteilt", time: "vor 10 Min", type: "post" },
  { user: "Tim Schau", action: "ist 'Cosplay Freunde' beigetreten", time: "vor 25 Min", type: "group" },
  { user: "Jason Lee", action: "hat eine neue Review geschrieben", time: "vor 1 Std", type: "post" },
  { user: "Max Müller", action: "hat 3 neue Figuren hinzugefügt", time: "vor 2 Std", type: "post" },
];

const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

const Avatar = ({ person }) => (
  <div className="relative">
    {person.photoURL ? (
      <img src={person.photoURL} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
    ) : (
      <div className="grid w-12 h-12 place-items-center rounded-full bg-secondary text-sm font-bold text-anime-brand">
        {getInitial(person.name)}
      </div>
    )}
    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-anime-surface ${person.online ? "bg-anime-online" : "bg-anime-offline"}`} />
  </div>
);

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedGroups, setJoinedGroups] = useState(
    groups.filter((g) => g.joined).map((g) => g.name)
  );
  const [activeTab, setActiveTab] = useState("mitglieder");
  const {
    discoverUsers,
    incomingRequests,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
  } = useFriends();

  const toggleJoin = (groupName) => {
    setJoinedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((n) => n !== groupName)
        : [...prev, groupName]
    );
  };

  const filteredUsers = discoverUsers.filter(
    (person) =>
      person.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-anime-brand" />
            <h1 className="text-xl font-bold text-foreground">Community</h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {discoverUsers.length + 1} Mitglieder
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> {groups.length} Gruppen
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mitglieder oder Gruppen suchen..."
            className="w-full pl-10 pr-4 py-2.5 bg-secondary text-foreground placeholder:text-muted-foreground rounded-lg border border-anime-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-secondary rounded-lg p-1">
          {[
            { key: "mitglieder", label: "Mitglieder" },
            { key: "gruppen", label: "Gruppen" },
            { key: "aktivitaet", label: "Aktivität" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mitglieder */}
        {activeTab === "mitglieder" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incomingRequests.map((request) => (
              <div key={request.id} className="rounded-lg bg-anime-surface border border-anime-border p-4 flex items-center gap-3">
                <Avatar person={{ name: request.fromName, photoURL: request.fromPhotoURL, online: false }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{request.fromName}</p>
                  <p className="text-[10px] text-muted-foreground">möchte befreundet sein</p>
                </div>
                <button type="button" onClick={() => acceptRequest(request)} className="p-2 rounded-md bg-anime-online/20 text-anime-online" title="Annehmen">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => declineRequest(request)} className="p-2 rounded-md bg-destructive/10 text-destructive" title="Ablehnen">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {filteredUsers.map((person) => (
              <div
                key={person.uid}
                className="rounded-lg bg-anime-surface border border-anime-border p-4 flex items-center gap-3 hover:bg-anime-surface-hover transition-colors"
              >
                <Avatar person={person} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{person.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {person.isFriend ? "Freund" : person.requestSent ? "Anfrage gesendet" : person.requestIncoming ? "Anfrage offen" : person.email}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button className="p-2 rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>

                  {person.isFriend ? (
                    <button type="button" onClick={() => removeFriend(person.uid)} className="p-2 rounded-md bg-destructive/10 text-destructive" title="Freund entfernen">
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => sendRequest(person)} disabled={person.requestSent || person.requestIncoming} className="p-2 rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50" title="Anfrage senden">
                      <UserPlus className="w-3.5 h-3.5" />
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

        {/* Gruppen */}
        {activeTab === "gruppen" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups.map((g) => (
              <div
                key={g.name}
                className="rounded-lg bg-anime-surface border border-anime-border p-4 hover:bg-anime-surface-hover transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {g.name}
                    </h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                      {g.category}
                    </span>
                  </div>

                  <Star className="w-4 h-4 text-muted-foreground hover:text-anime-brand cursor-pointer transition-colors" />
                </div>

                <p className="text-[10px] text-muted-foreground mt-2">
                  {g.desc}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> {g.members.toLocaleString()}
                  </span>

                  <button
                    onClick={() => toggleJoin(g.name)}
                    className={`px-3 py-1 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
                      joinedGroups.includes(g.name)
                        ? "bg-anime-online/20 text-anime-online"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {joinedGroups.includes(g.name) ? (
                      <>
                        <Check className="w-3 h-3" /> Beigetreten
                      </>
                    ) : (
                      "Beitreten"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Aktivität */}
        {activeTab === "aktivitaet" && (
          <div className="space-y-2">
            {activities.map((a, i) => (
              <div
                key={i}
                className="rounded-lg bg-anime-surface border border-anime-border p-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {a.user.charAt(0)}
                </div>

                <div className="flex-1">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">{a.user}</span> {a.action}
                  </p>
                  <p className="text-[9px] text-muted-foreground">{a.time}</p>
                </div>

                <TrendingUp className="w-3 h-3 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Community;
