import { Image, Video, Hash, X } from "lucide-react";

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const PostComposer = ({
  value,
  onChange,
  onSubmit,
  onPickMedia,
  onClearMedia,
  media,
  disabled,
}) => {
  const canPost = value.trim() || media;

  return (
    <section className="rounded-lg border border-anime-border bg-anime-surface p-4">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={280}
        placeholder="Was gibt's Neues in der Anime-Welt?"
        className="h-28 w-full resize-none rounded-md border border-transparent bg-secondary p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />

      {media && (
        <div className="mt-3 flex items-center justify-between rounded-md border border-anime-border bg-background px-3 py-2 text-xs text-muted-foreground">
          <span className="truncate">
            {media.type === "video" ? "Video" : "Bild"} ist angehängt
            {media.name ? `: ${media.name}` : ""}
            {media.size ? ` (${formatFileSize(media.size)})` : ""}
          </span>
          <button type="button" onClick={onClearMedia} className="text-muted-foreground hover:text-foreground" title="Anhang entfernen">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPickMedia("image")}
          className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-muted-foreground hover:text-foreground"
          title="Bild hinzufügen"
        >
          <Image className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPickMedia("video")}
          className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-muted-foreground hover:text-foreground"
          title="Video hinzufügen"
        >
          <Video className="h-4 w-4" />
        </button>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Hash className="h-4 w-4" /> Hashtag
        </span>

        <span className="ml-auto text-xs text-muted-foreground">{value.length}/280</span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !canPost}
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Posten
        </button>
      </div>
    </section>
  );
};

export default PostComposer;
