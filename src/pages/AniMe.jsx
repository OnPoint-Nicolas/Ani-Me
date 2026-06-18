import { useMemo, useState } from "react";
import { Hash, TrendingUp, Users } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import StoriesBar from "@/components/StoriesBar";
import UploadModal from "@/components/UploadModal";
import FriendsPanel from "@/components/FriendsPanel";
import { usePosts } from "@/hooks/usePosts";

import postImage from "@/assets/post-image.jpg";
import postImage2 from "@/assets/post-image-2.jpg";
import postImage3 from "@/assets/post-image-3.jpg";
import avatarSakura from "@/assets/avatar-sakura.jpg";
import avatarTim from "@/assets/avatar-tim.jpg";
import avatarJason from "@/assets/avatar-jason.jpg";

const trendingTags = [
  { tag: "OnePiece", posts: "12.4K" },
  { tag: "AttackOnTitan", posts: "8.9K" },
  { tag: "JujutsuKaisen", posts: "7.2K" },
  { tag: "DragonBall", posts: "6.1K" },
  { tag: "Naruto", posts: "5.8K" },
];

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
  const { posts: firePosts, createPost } = usePosts();

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
              {trendingTags.map((item, index) => (
                <div key={item.tag} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{index + 1}</span>
                  <span className="flex items-center gap-2 font-semibold"><Hash className="h-4 w-4 text-primary" /> {item.tag}</span>
                  <span className="text-xs text-muted-foreground">{item.posts}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-anime-border bg-anime-surface p-4">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Users className="h-5 w-5 text-primary" /> Deine Gruppen
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Manga Creators", "Anime News", "AMV Club", "Cosplay"].map((group) => (
                <span key={group} className="rounded-full bg-secondary px-3 py-1.5 text-muted-foreground">{group}</span>
              ))}
            </div>
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
