import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

// ============================================================
// useUpload – Custom Hook für Datei-Uploads in Firebase Storage
// ----------------------------------------------------------------
// Lädt ein File-Objekt hoch und gibt die öffentliche Download-URL
// zurück. Pfad: uploads/{userUid}/{timestamp}-{dateiname}
// ============================================================

export const useUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const getUploadError = (error) => {
    switch (error?.code) {
      case "storage/unauthorized":
        return "Firebase Storage blockiert den Upload. Prüfe, ob Storage-Regeln veröffentlicht sind und du eingeloggt bist.";
      case "storage/canceled":
        return "Upload wurde abgebrochen.";
      case "storage/quota-exceeded":
        return "Firebase Storage Speicherplatz ist voll oder dein Projekt-Limit wurde erreicht.";
      case "storage/retry-limit-exceeded":
        return "Upload hat zu lange gedauert. Prüfe Internetverbindung oder Dateigröße.";
      case "storage/unknown":
        return "Unbekannter Firebase-Storage-Fehler. Prüfe, ob Storage in Firebase aktiviert ist.";
      default:
        return error?.message || "Upload fehlgeschlagen.";
    }
  };

  const upload = async (file) => {
    if (!user) {
      return { success: false, error: "Bitte einloggen, um Dateien hochzuladen." };
    }

    try {
      setUploading(true);
      setProgress(0);

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `uploads/${user.uid}/${Date.now()}-${safeName}`;
      const storageRef = ref(storage, path);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      });

      return await new Promise((resolve) => {
        let settled = false;
        const finish = (result) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          resolve(result);
        };

        const timeout = window.setTimeout(() => {
          uploadTask.cancel();
          finish({
            success: false,
            error: "Upload dauert zu lange und wurde abgebrochen. Prüfe Firebase Storage, Regeln und Internetverbindung.",
            code: "upload/timeout",
          });
        }, 60_000);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(percent);
          },
          (err) => {
            console.error("Upload-Fehler:", err);
            finish({ success: false, error: getUploadError(err), code: err?.code });
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setProgress(100);
            finish({ success: true, url });
          }
        );
      });
    } catch (err) {
      console.error("Upload-Fehler:", err);
      return { success: false, error: getUploadError(err), code: err?.code };
    } finally {
      setUploading(false);
    }
  };

  return {
    upload,
    uploading,
    progress,
  };
};
