/**
 * blogStorage.ts
 *
 * Firebase Storage helpers for blog featured images.
 *
 * Upload path: blogs/{blogId}/featured_{timestamp}.{ext}
 *
 * Security model:
 *  - The admin panel uses a passphrase session guard (not Firebase Auth).
 *  - requireAdminSession() validates the passphrase before every upload/delete.
 *  - Firebase Storage rules allow public read and open write for blogs/ because
 *    request.auth is null for passphrase-protected admin operations.
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import { requireAdminSession } from "@/lib/adminAuth";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Uploads a featured image for a blog post to Firebase Storage.
 *
 * @param file       - The image File selected by the admin.
 * @param blogId     - The blog document ID (used as the storage folder name).
 * @param onProgress - Optional callback receiving 0-100 upload progress.
 * @returns          The public Firebase Storage download URL.
 */
export async function uploadBlogImage(
  file: File,
  blogId: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  // ── 1. Admin session guard ──────────────────────────────────────────────────
  requireAdminSession();

  // ── 2. Input validation ─────────────────────────────────────────────────────
  if (!file) throw new Error("No file provided.");
  if (!blogId) throw new Error("blogId is required for the upload path.");

  const ext = (file.name.split(".").pop() ?? "").toLowerCase();

  if (
    !ALLOWED_EXTENSIONS.has(ext) ||
    !ALLOWED_MIME_TYPES.has(file.type)
  ) {
    throw new Error(
      `Invalid file type "${file.type}" (.${ext}). ` +
      "Allowed formats: JPG, JPEG, PNG, WebP.",
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(
      `File too large (${mb} MB). Maximum allowed size is 5 MB.`,
    );
  }

  // ── 3. Build storage path ───────────────────────────────────────────────────
  const path = `blogs/${blogId}/featured_${Date.now()}.${ext}`;

  // ── 4. Debug logging ────────────────────────────────────────────────────────
  console.debug("[blogStorage] uploadBlogImage →", {
    path,
    fileSize: `${(file.size / 1024).toFixed(1)} KB`,
    fileType: file.type,
    blogId,
  });

  // ── 5. Upload ───────────────────────────────────────────────────────────────
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    task.on(
      "state_changed",

      // Progress
      (snap) => {
        const pct = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100,
        );
        console.debug(`[blogStorage] upload progress: ${pct}%`);
        onProgress?.(pct);
      },

      // Error
      (err) => {
        console.error("[blogStorage] upload error:", err.code, err.message);

        switch (err.code) {
          case "storage/unauthorized":
            reject(
              new Error(
                "Storage permission denied (storage/unauthorized). " +
                "Firebase Storage rules have not been deployed yet.\n" +
                "Fix: run  firebase deploy --only storage  then retry.",
              ),
            );
            break;
          case "storage/canceled":
            reject(new Error("Upload was cancelled."));
            break;
          case "storage/quota-exceeded":
            reject(new Error("Firebase Storage quota exceeded."));
            break;
          case "storage/unauthenticated":
            reject(
              new Error(
                "Firebase Auth is not active (storage/unauthenticated). " +
                "Storage rules require authentication — deploy the updated rules first.",
              ),
            );
            break;
          default:
            reject(new Error(`Upload failed: ${err.message} (${err.code})`));
        }
      },

      // Complete
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        console.debug("[blogStorage] upload complete →", { path, url });
        resolve(url);
      },
    );
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes a blog image from Firebase Storage by its download URL or storage path.
 *
 * Firebase v9 `ref()` accepts only storage paths or gs:// URIs, NOT HTTPS
 * download URLs.  This function parses the encoded path out of the download URL
 * before constructing the reference.
 *
 * Failures are suppressed — deletion is a best-effort cleanup step.
 */
export async function deleteBlogImage(urlOrPath: string): Promise<void> {
  if (!urlOrPath) return;

  try {
    requireAdminSession();

    let storagePath = urlOrPath;

    // Parse encoded path from Firebase download URL
    // Format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encoded-path}?alt=media&token=…
    if (urlOrPath.startsWith("https://")) {
      const match = urlOrPath.match(/\/o\/([^?#]+)/);
      if (!match?.[1]) {
        console.warn(
          "[blogStorage] deleteBlogImage — could not extract path from URL, skipping.",
          urlOrPath,
        );
        return;
      }
      storagePath = decodeURIComponent(match[1]);
      console.debug("[blogStorage] deleteBlogImage — decoded path:", storagePath);
    }

    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    console.debug("[blogStorage] deleteBlogImage — deleted:", storagePath);
  } catch (err) {
    // Non-fatal: image may already be gone or URL may be external
    console.warn("[blogStorage] deleteBlogImage — suppressed error:", err);
  }
}
