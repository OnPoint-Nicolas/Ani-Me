import { useState } from "react";
import Footer from "@/components/Footer";
import {
  Users,
  MessageCircle,
  UserPlus,
  Search,
  TrendingUp,
  Crown,
  Shield,
  Star,
  Check,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import avatarSakura from "@/assets/avatar-sakura.jpg";
import avatarTim from "@/assets/avatar-tim.jpg";
import avatarJason from "@/assets/avatar-jason.jpg";
import avatarMax from "@/assets/avatar-max.jpg";

const members = [
  { name: "Sakura Tanaka", role: "Mangaka", online: true, posts: 234, img: avatarSakura, level: "Pro" },
  { name: "Tim Schau", role: "Cosplayer", online: true, posts: 156, img: avatarTim, level: "Aktiv" },
  { name: "Jason Lee", role: "Reviewer", online: false, posts: 89, img: avatarJason, level: "Neu" },
  { name: "Max Müller", role: "Sammler", online: false, posts: 67, img: avatarMax, level: "Aktiv" },
];

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

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedGroups, setJoinedGroups] = useState(
    groups.filter((g) => g.joined).map((g) => g.name)
  );
  const [activeTab, setActiveTab] = useState("mitglieder");

  const toggleJoin = (groupName) => {
    setJoinedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((n) => n !== groupName)
        : [...prev, groupName]
    );
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Users className="w-3 h-3" /> {members.length} Mitglieder
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
            {filteredMembers.map((m) => (
              <div
                key={m.name}
                className="rounded-lg bg-anime-surface border border-anime-border p-4 flex items-center gap-3 hover:bg-anime-surface-hover transition-colors"
              >
                <div className="relative">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-anime-surface ${
                      m.online ? "bg-anime-online" : "bg-anime-offline"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {m.name}
                    </p>
                    {m.level === "Pro" && (
                      <Crown className="w-3 h-3 text-anime-brand" />
                    )}
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    {m.role} · {m.posts} Posts · {m.level}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button className="p-2 rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>

                  <button className="p-2 rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
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