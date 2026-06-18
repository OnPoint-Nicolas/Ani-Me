import { useState, useRef } from "react";
import { X, Upload, Image, Video, FileWarning } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import { useAuth } from "@/hooks/useAuth";

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const UploadModal = ({ isOpen, onClose, type, onUploaded }) => {
  const { user } = useAuth();
  const { upload, uploading: fbUploading, progress } = useUpload();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const accept =
    type === "image"
      ? "image/jpeg,image/png,image/gif,image/webp"
      : "video/mp4,video/webm,video/ogg";

  const maxSize = type === "image" ? 10 : 50; // MB

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setError(null);
    setSuccess(false);

    if (!selected) return;

    const validTypes =
      type === "image"
        ? ["image/jpeg", "image/png", "image/gif", "image/webp"]
        : ["video/mp4", "video/webm", "video/ogg"];

    if (!validTypes.includes(selected.type)) {
      setError(
        `Ungültiger Dateityp: ${selected.type}. Erlaubt: ${validTypes.join(", ")}`
      );
      return;
    }

    if (selected.size > maxSize * 1024 * 1024) {
      setError(
        `Datei zu groß: ${formatFileSize(selected.size)}. Maximum: ${maxSize} MB`
      );
      return;
    }

    setFile(selected);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result);
    reader.onerror = () => setError("Fehler beim Lesen der Datei.");
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    if (!user) {
      setError("Bitte einloggen, um Dateien hochzuladen.");
      return;
    }

    setError(null);

    const result = await upload(file);

    if (!result.success) {
      setError(result.error || "Upload fehlgeschlagen. Bitte erneut versuchen.");
      return;
    }

    setSuccess(true);
    onUploaded?.({
      url: result.url,
      name: file.name,
      size: file.size,
      type,
      contentType: file.type,
    });
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setSuccess(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-anime-surface border border-anime-border p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            {type === "image" ? (
              <Image className="w-5 h-5 text-primary" />
            ) : (
              <Video className="w-5 h-5 text-primary" />
            )}
            {type === "image" ? "Bild hochladen" : "Video hochladen"}
          </h2>

          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
            <FileWarning className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-anime-online/10 border border-anime-online/30">
            <p className="text-xs text-anime-online font-medium">
              ✓ Upload erfolgreich!
            </p>
          </div>
        )}

        {/* Drop Zone / Preview */}
        {!preview ? (
          <label className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-anime-border hover:border-primary/50 cursor-pointer transition-colors bg-secondary/30">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Klicken oder Datei hierher ziehen
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {type === "image" ? "JPG, PNG, GIF, WebP" : "MP4, WebM, OGG"} · Max {maxSize}MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-anime-border mb-4">
            {type === "image" ? (
              <img
                src={preview}
                alt="Vorschau"
                className="w-full max-h-64 object-contain bg-black"
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-full max-h-64 bg-black"
              />
            )}

            <button
              onClick={handleReset}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* File info */}
        {file && !success && (
          <p className="text-xs text-muted-foreground mt-3 truncate">
            {file.name} · {formatFileSize(file.size)}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm hover:opacity-90"
          >
            Abbrechen
          </button>

          {!success ? (
            <button
              onClick={handleUpload}
              disabled={!file || fbUploading}
              className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {fbUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Wird hochgeladen... {progress}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Hochladen
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
            >
              Weitere Datei
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
