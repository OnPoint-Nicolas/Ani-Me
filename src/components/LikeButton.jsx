import { useState } from "react";
import { Heart } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";

const LikeButton = ({ postId, initialCount = 0, persist = true }) => {
  const [localLiked, setLocalLiked] = useState(false);
  const [localCount, setLocalCount] = useState(initialCount);
  const {
    count: savedCount,
    liked: savedLiked,
    error,
    toggleLike,
  } = useLikes(postId, persist, initialCount);

  const liked = persist ? savedLiked : localLiked;
  const count = persist ? savedCount : localCount;

  const toggle = () => {
    if (persist) {
      toggleLike();
      return;
    }

    setLocalLiked(!localLiked);
    setLocalCount((current) => current + (localLiked ? -1 : 1));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        className={`flex cursor-pointer items-center gap-1 text-xs transition-colors ${
          liked ? "text-anime-brand" : "text-muted-foreground hover:text-foreground"
        }`}
        type="button"
        title={liked ? "Like entfernen" : "Liken"}
      >
        <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
        {count}
      </button>

      {error && <span className="text-[10px] text-destructive">{error}</span>}
    </div>
  );
};

export default LikeButton;
