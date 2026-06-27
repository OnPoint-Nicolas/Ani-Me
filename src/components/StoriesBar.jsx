import { useState } from "react";
import { Image, Plus, Video, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStories } from "@/hooks/useStories";
import UploadModal from "@/components/UploadModal";

const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

const AvatarCircle = ({ name, photoURL, children, onClick, title }) => (
  <button type="button" onClick={onClick} title={title} className="w-20 shrink-0 text-center">
    <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-anime-brand bg-secondary p-0.5">
      {photoURL ? (
        <img src={photoURL} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center rounded-full bg-background text-lg font-bold text-anime-brand">
          {getInitial(name)}
        </div>
      )}
      {children}
    </div>
    <p className="mt-2 truncate text-xs font-medium text-muted-foreground">{name}</p>
  </button>
);

const StoriesBar = () => {
  const { user } = useAuth();
  const { stories, createStory, markStoryAsViewed, error } = useStories();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [uploadType, setUploadType] = useState(null);
  const [media, setMedia] = useState(null);
  const [text, setText] = useState("");
  const [formError, setFormError] = useState("");

  const openStory = (story) => {
    setSelectedStory(story);
    markStoryAsViewed(story.id);
  };

  const submitStory = async (event) => {
    event.preventDefault();
    setFormError("");

    const result = await createStory(text, media);
    if (!result.success) {
      setFormError(result.error || "Story konnte nicht gespeichert werden.");
      return;
    }

    setText("");
    setMedia(null);
    setShowCreate(false);
  };

  return (
    <>
      <section className="flex gap-5 overflow-x-auto border-b border-anime-border bg-anime-surface/60 px-4 py-5">
        <AvatarCircle
          name="Deine Story"
          photoURL={user?.photoURL}
          onClick={() => setShowCreate(true)}
          title="Eigene Story erstellen"
        >
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
            <Plus className="h-3.5 w-3.5" />
          </span>
        </AvatarCircle>

        {stories.map((story) => (
          <div key={story.id} className="relative">
            <AvatarCircle
              name={story.authorUid === user?.uid ? "Deine Story" : story.authorName}
              photoURL={story.authorPhotoURL}
              onClick={() => openStory(story)}
              title={`${story.authorName}: Story ansehen`}
            />
            {story.isNew && (
              <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                Neu
              </span>
            )}
          </div>
        ))}

        {error && <p className="self-center text-xs text-destructive">{error}</p>}
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
          <form onSubmit={submitStory} className="w-full max-w-sm rounded-lg border border-anime-border bg-anime-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold">Story erstellen</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {media && (
              <div className="mb-3 rounded-md border border-anime-border bg-background p-2">
                {media.type === "image" ? (
                  <img src={media.url} alt="Story-Vorschau" className="max-h-48 w-full rounded object-contain" />
                ) : (
                  <video src={media.url} controls className="max-h-48 w-full rounded bg-black" />
                )}
                <button type="button" onClick={() => setMedia(null)} className="mt-2 text-xs text-muted-foreground hover:text-foreground">
                  Medium entfernen
                </button>
              </div>
            )}

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={180}
              placeholder="Kurze Neuigkeit teilen..."
              className="h-28 w-full resize-none rounded-md border border-anime-border bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setUploadType("image")} title="Bild hinzufügen" className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-muted-foreground hover:text-foreground">
                  <Image className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setUploadType("video")} title="Video hinzufügen" className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-muted-foreground hover:text-foreground">
                  <Video className="h-4 w-4" />
                </button>
                <span className="text-xs text-muted-foreground">{text.length}/180</span>
              </div>
              <button type="submit" disabled={!text.trim() && !media} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                Teilen
              </button>
            </div>
            {formError && <p className="mt-3 text-xs text-destructive">{formError}</p>}
          </form>
        </div>
      )}

      {selectedStory && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4" onClick={() => setSelectedStory(null)}>
          <article className="w-full max-w-sm rounded-lg border border-anime-border bg-anime-surface p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <AvatarCircle name={selectedStory.authorName} photoURL={selectedStory.authorPhotoURL} />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold">{selectedStory.authorName}</h2>
                <p className="text-xs text-muted-foreground">Neue Story</p>
              </div>
              <button type="button" onClick={() => setSelectedStory(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            {selectedStory.mediaUrl && selectedStory.mediaType === "image" && (
              <img src={selectedStory.mediaUrl} alt="Story" className="mb-4 max-h-[60vh] w-full rounded-md object-contain" />
            )}
            {selectedStory.mediaUrl && selectedStory.mediaType === "video" && (
              <video src={selectedStory.mediaUrl} controls autoPlay className="mb-4 max-h-[60vh] w-full rounded-md bg-black" />
            )}
            <p className="text-sm leading-relaxed text-foreground">{selectedStory.text}</p>
          </article>
        </div>
      )}

      <UploadModal
        isOpen={Boolean(uploadType)}
        onClose={() => setUploadType(null)}
        type={uploadType || "image"}
        onUploaded={(fileData) => {
          setMedia(fileData);
          setUploadType(null);
        }}
      />
    </>
  );
};

export default StoriesBar;
