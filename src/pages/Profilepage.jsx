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
import UploadModal from "@/components/UploadModal";
import avatarSakura from "@/assets/avatar-sakura.jpg";
import postImage from "@/assets/post-image.jpg";
import postImage2 from "@/assets/post-image-2.jpg";
import postImage3 from "@/assets/post-image-3.jpg";
import { Link } from "react-router-dom";

const defaultStats = [
  { icon: Image, label: "Posts", value: 47 },
  { icon: Heart, label: "Likes", value: 1283 },
  { icon: MessageCircle, label: "Kommentare", value: 312 },
  { icon: TrendingUp, label: "Follower", value: 856 },
];

const userPosts = [
  { img: postImage, title: "BOOM Sketch", likes: 234 },
  { img: postImage2, title: "Kampfszene", likes: 456 },
  { img: postImage3, title: "Ghibli Landscape", likes: 189 },
];

const badges = [
  { emoji: "🎨", label: "Manga Creator" },
  { emoji: "🔥", label: "Top Poster" },
  { emoji: "⭐", label: "1K Likes" },
  { emoji: "💬", label: "Kommentator" },
  { emoji: "🏆", label: "Quiz Master" },
  { emoji: "📸", label: "Uploader" },
];

const ProfilePage = () => {
  const { user, updatePhoto } = useAuth();

  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [bio, setBio] = useState(
    "Anime & Manga Fan 🎌 · Zeichne gerne Fan-Art und diskutiere über die neuesten Serien."
  );

  const displayName = user?.name || "Sakura Tanaka";
  const displayEmail = user?.email || "sakura@anime.de";
  const displayAvatar = user?.photoURL || avatarSakura;

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
                {user && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-anime-online/20 text-anime-online font-medium">
                    Online
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground">{displayEmail}</p>

              {isEditing ? (
                <div className="mt-2">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-secondary text-foreground text-xs rounded-md p-2 resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary border border-anime-border"
                  />

                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => setIsEditing(false)}
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
                <p className="text-xs text-muted-foreground mt-2">{bio}</p>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
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
                <span className="text-lg">{b.emoji}</span>
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
            {userPosts.map((p, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden border border-anime-border group cursor-pointer relative"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/50 transition-colors flex items-center justify-center">
                  <span className="text-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {p.likes}
                  </span>
                </div>
              </div>
            ))}

            {[1, 2, 3].map((i) => (
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
        onUploaded={async (url) => {
          await updatePhoto(url);
          setShowUpload(false);
        }}
      />

      <Footer />
    </div>
  );
};

export default ProfilePage;