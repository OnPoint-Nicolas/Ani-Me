import { useEffect, useMemo, useState } from "react";
import { Hash, Loader2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import StoriesBar from "@/components/StoriesBar";
import UploadModal from "@/components/UploadModal";
import FriendsPanel from "@/components/FriendsPanel";
import { usePosts } from "@/hooks/usePosts";
import { useGroups } from "@/hooks/useGroups";

import postImage from "@/assets/post-image.jpg";
import postImage2 from "@/assets/post-image-2.jpg";
import postImage3 from "@/assets/post-image-3.jpg";
import avatarSakura from "@/assets/avatar-sakura.jpg";
import avatarTim from "@/assets/avatar-tim.jpg";
import avatarJason from "@/assets/avatar-jason.jpg";

const samplePosts = [
  {
    id: "sample-1",
    authorName: "Sakura Tanaka",
    avatar: avatarSakura,
    time: "vor 2h",
    text: "Ein neues Skizze aus meinem aktuellen Projekt. Freut mich, wenn's euch gefällt! #FanArt #Manga",
    imageUrl: postImage,
    mediaUrl: postImage,
    mediaType: "image",
    likes: 234,
  },
  {
    id: "sample-2",
    authorName: "Tim Schau",
    avatar: avatarTim,
    time: "vor 4h",
    text: "Diese Kampfszene ist einfach unglaublich animiert. Was ist eure Lieblings-Anime-Kampfszene?",
    imageUrl: postImage2,
    mediaUrl: postImage2,
    mediaType: "image",
    likes: 456,
  },
  {
    id: "sample-3",
    authorName: "Jason Lee",
    avatar: avatarJason,
    time: "vor 6h",
    text: "Diese Landschaft könnte direkt aus einem Ghibli-Film sein. Kirschblüten-Saison ist einfach magisch.",
    imageUrl: postImage3,
    mediaUrl: postImage3,
    mediaType: "image",
    likes: 189,
  },
];

const AniMe = () => {
  const [postText, setPostText] = useState("");
  const [uploadType, setUploadType] = useState(null);
  const [pendingMedia, setPendingMedia] = useState(null);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [trendingManga, setTrendingManga] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const { posts: firePosts, createPost } = usePosts();
  const { joinedGroups } = useGroups();

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/top/manga?limit=5");
        if (!res.ok) throw new Error("Trending konnte nicht geladen werden.");
        const data = await res.json();
        setTrendingManga(Array.isArray(data.data) ? data.data : []);
      } catch {
        setTrendingManga([]);
      } finally {
        setTrendingLoading(false);
      }
    };

    loadTrending();
  }, []);

  const posts = useMemo(() => {
    if (!firePosts.length) return samplePosts;

    return firePosts.map((post) => ({
      ...post,
      avatar: avatarSakura,
      mediaUrl: post.mediaUrl,
      mediaType: post.mediaType,
      time: "gerade eben",
    }));
  }, [firePosts]);

  const handlePost = async () => {
    if (!postText.trim() && !pendingMedia) return;

    setPosting(true);
    setPostError("");
    const result = await createPost(postText, pendingMedia?.url, pendingMedia?.type);

    if (result.success) {
      setPostText("");
      setPendingMedia(null);
    } else {
      setPostError(result.error || "Post konnte nicht gespeichert werden.");
    }

    setPosting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <StoriesBar />

      <main className="grid gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
        <aside className="hidden space-y-6 lg:block">
          <section className="rounded-lg border border-anime-border bg-anime-surface p-4">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <TrendingUp className="h-5 w-5 text-anime-brand" /> Trending
            </h2>
            <div className="space-y-3">
              {trendingLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Lade Ranking...
                </div>
              )}

              {!trendingLoading && trendingManga.map((item, index) => (
                <Link key={item.mal_id} to={`/manga/${item.mal_id}`} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 rounded-md text-sm hover:text-anime-brand">
                  <span className="text-muted-foreground">{index + 1}</span>
                  <span className="flex min-w-0 items-center gap-2 font-semibold">
                    <Hash className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{item.title}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{item.score || "-"}</span>
                </Link>
              ))}

              {!trendingLoading && trendingManga.length === 0 && (
                <p className="text-xs text-muted-foreground">Kein Ranking geladen.</p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-anime-border bg-anime-surface p-4">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Users className="h-5 w-5 text-primary" /> Deine Gruppen
            </h2>
            {joinedGroups.length === 0 ? (
              <div className="space-y-3">
                <p className="text-xs leading-5 text-muted-foreground">
                  Du hast noch keine Gruppen ausgewählt. Suche dir in der Community passende Gruppen aus.
                </p>
                <Link to="/community" className="inline-flex rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  Gruppen finden
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 text-xs">
                {joinedGroups.map((group) => (
                  <Link
                    key={group.id}
                    to="/community"
                    className="rounded-full bg-secondary px-3 py-1.5 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    title={group.desc || group.category}
                  >
                    {group.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className="mx-auto w-full max-w-3xl space-y-5">
          <PostComposer
            value={postText}
            onChange={setPostText}
            onSubmit={handlePost}
            onPickMedia={setUploadType}
            onClearMedia={() => setPendingMedia(null)}
            media={pendingMedia}
            disabled={posting}
          />

          {postError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {postError}
            </div>
          )}

          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>

        <aside className="hidden space-y-6 lg:block">
          <FriendsPanel />
        </aside>
      </main>

      <UploadModal
        isOpen={Boolean(uploadType)}
        onClose={() => setUploadType(null)}
        type={uploadType || "image"}
        onUploaded={(fileData) => {
          setPendingMedia(fileData);
          setUploadType(null);
        }}
      />

      <Footer />
    </div>
  );
};

export default AniMe;
