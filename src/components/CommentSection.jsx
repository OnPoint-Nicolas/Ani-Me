import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useComments } from "@/hooks/useComments";

const defaultComments = [
  { id: 1, user: "Tim", text: "Sieht richtig gut aus!" },
  { id: 2, user: "Hana", text: "Die Farben passen mega." },
];

const CommentSection = ({ postId, persist = true, initialComments = defaultComments }) => {
  const [text, setText] = useState("");
  const [localComments, setLocalComments] = useState(initialComments);
  const { comments: savedComments, addComment: saveComment } = useComments(postId, persist);

  const comments = persist ? savedComments : localComments;

  const addComment = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    if (persist) {
      const result = await saveComment(text);
      if (!result.success) return;
    } else {
      setLocalComments((current) => [
        ...current,
        { id: Date.now(), authorName: "Du", text: text.trim() },
      ]);
    }

    setText("");
  };

  return (
    <div className="mt-4 border-t border-anime-border pt-3">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <MessageCircle className="h-4 w-4" />
        Kommentare
      </div>

      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-md bg-secondary px-3 py-2 text-xs">
            <span className="font-semibold text-foreground">{comment.authorName || comment.user}: </span>
            <span className="text-muted-foreground">{comment.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={addComment} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Kommentar schreiben..."
          className="h-9 flex-1 rounded-md border border-anime-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <button
          type="submit"
          className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
          disabled={!text.trim()}
          title="Kommentar senden"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
