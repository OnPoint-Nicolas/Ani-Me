import { Bookmark, MessageCircle } from "lucide-react";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

const PostCard = ({ post }) => {
  const persistPost = !String(post.id).startsWith("sample-");

  return (
    <article className="rounded-lg border border-anime-border bg-anime-surface p-4">
      <div className="flex items-start gap-3">
        <img src={post.avatar} alt={post.authorName} className="h-12 w-12 rounded-full object-cover" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">{post.authorName}</h3>
              <p className="text-xs text-muted-foreground">{post.time || "gerade eben"}</p>
            </div>

            <button type="button" className="text-muted-foreground hover:text-anime-brand" title="Speichern">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-foreground">{post.text}</p>

          {post.mediaUrl && post.mediaType !== "video" && (
            <img
              src={post.mediaUrl}
              alt=""
              className="mt-3 max-h-[460px] w-full rounded-md object-cover"
              loading="lazy"
            />
          )}

          {post.mediaUrl && post.mediaType === "video" && (
            <video
              src={post.mediaUrl}
              controls
              className="mt-3 max-h-[460px] w-full rounded-md bg-black"
            />
          )}

          <div className="mt-3 flex items-center gap-5">
            <LikeButton postId={post.id} initialCount={post.likes} persist={persistPost} />
            <button type="button" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-4 w-4" /> Kommentieren
            </button>
          </div>

          <CommentSection postId={post.id} persist={persistPost} />
        </div>
      </div>
    </article>
  );
};

export default PostCard;
