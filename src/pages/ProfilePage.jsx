import { useState } from "react";
import Footer from "@/components/Footer";
import {
  Heart,
  MessageCircle,
  Image,
  Award,
  TrendingUp,
  Settings,
  Grid,
  Bookmark,
  Edit2,
  Camera,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useFriends } from "@/hooks/useFriends";
import { usePosts } from "@/hooks/usePosts";
import { useUserProfile } from "@/hooks/useUserProfile";
import UploadModal from "@/components/UploadModal";
import avatarSakura from "@/assets/avatar-sakura.jpg";
import { Link } from "react-router-dom";

const badges = [
  { label: "Manga Creator" },
  { label: "Top Poster" },
  { label: "1K Likes" },
  { label: "Kommentator" },
  { label: "Quiz Master" },
  { label: "Uploader" },
];

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { profile } = useUserProfile();
  const { posts } = usePosts();
  const { friends } = useFriends();

  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  const userPosts = posts.filter((post) => post.authorUid === user?.uid);
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const mediaPosts = userPosts.filter((post) => post.mediaUrl);
  const displayName = profile?.alias || profile?.name || user?.alias || user?.name || "Anime Fan";
  const displayEmail = user?.email || "";
  const displayAvatar = user?.photoURL || avatarSakura;
  const displayBio = profile?.bio || "Noch keine Bio eingetragen.";
  const settings = profile?.settings || {};
  const defaultStats = [
    { icon: Image, label: "Posts", value: userPosts.length },
    { icon: Heart, label: "Likes", value: totalLikes },
    { icon: MessageCircle, label: "Medien", value: mediaPosts.length },
    { icon: TrendingUp, label: "Freunde", value: friends.length },
  ];

  const startEditing = () => {
    setName(displayName);
    setBio(profile?.bio || "");
    setMessage("");
    setIsEditing(true);
  };

  const saveProfile = async () => {
    const result = await updateUserProfile({ name: name.trim(), bio: bio.trim() });
    setMessage(result.success ? "Profil gespeichert." : result.error || "Speichern fehlgeschlagen.");
    if (result.success) setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-3xl mx-auto p-4">
        {/* Profile Header */}
        <div className="rounded-lg bg-anime-surface border border-anime-border p-6 mb-4">
          <div className="flex items-start gap-5">
            <div className="relative group">
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-anime-brand"
              />
              {user && (
                <button
                  onClick={() => setShowUpload(true)}
                  title="Profilbild ändern"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground border-2 border-anime-surface hover:opacity-90"
                >
                  <Camera className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">
                  {displayName}
                </h1>
                {user && !settings.hide_activity && settings.show_online !== false && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-anime-online/20 text-anime-online font-medium">
                    Online
                  </span>
                )}
              </div>

              {settings.show_email && <p className="text-xs text-muted-foreground">{displayEmail}</p>}

              {isEditing ? (
                <div className="mt-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-2 w-full rounded-md border border-anime-border bg-secondary p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Öffentlicher Alias"
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-secondary text-foreground text-xs rounded-md p-2 resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary border border-anime-border"
                  />

                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={saveProfile}
                      className="px-3 py-1 rounded bg-primary text-primary-foreground text-[10px]"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 rounded bg-secondary text-secondary-foreground text-[10px]"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">{displayBio}</p>
              )}

              {message && <p className="mt-2 text-[10px] text-muted-foreground">{message}</p>}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={startEditing}
                  className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:opacity-90 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Profil bearbeiten
                </button>

                <Link
                  to="/settings"
                  className="px-4 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs hover:opacity-90 flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" /> Einstellungen
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {defaultStats.map((s) => (
              <div key={s.label} className="text-center p-3 rounded-lg bg-secondary">
                <s.icon className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-sm font-bold text-foreground">
                  {s.value.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-lg bg-anime-surface border border-anime-border p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-anime-brand" />
            <h2 className="text-sm font-semibold text-foreground">Abzeichen</h2>
            <span className="text-[10px] text-muted-foreground">
              ({badges.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <div
                key={b.label}
                className="px-3 py-2 rounded-lg bg-secondary text-center hover:bg-anime-surface-hover cursor-pointer transition-colors"
              >
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-secondary rounded-lg p-1">
          {[
            { key: "posts", label: "Posts", icon: Grid },
            { key: "likes", label: "Likes", icon: Heart },
            { key: "saved", label: "Gespeichert", icon: Bookmark },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3 h-3" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="rounded-lg bg-anime-surface border border-anime-border p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mediaPosts.map((p) => (
              <div
                key={p.id}
                className="rounded-lg overflow-hidden border border-anime-border group cursor-pointer relative"
              >
                {p.mediaType === "video" ? (
                  <video src={p.mediaUrl} className="w-full aspect-square object-cover" />
                ) : (
                  <img
                    src={p.mediaUrl}
                    alt={p.text || "Post"}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}

                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/50 transition-colors flex items-center justify-center">
                  <span className="text-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {p.likes || 0}
                  </span>
                </div>
              </div>
            ))}

            {mediaPosts.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">Noch keine Medien-Posts vorhanden.</p>
            )}

            {mediaPosts.length > 0 && [1, 2, 3].map((i) => (
              <div
                key={`ph-${i}`}
                className="rounded-lg aspect-square bg-secondary border border-anime-border flex items-center justify-center"
              >
                <Image className="w-6 h-6 text-muted-foreground/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        type="image"
        onUploaded={async (fileData) => {
          await updateUserProfile({ photoURL: fileData.url });
          setShowUpload(false);
        }}
      />

      <Footer />
    </div>
  );
};

export default ProfilePage;
