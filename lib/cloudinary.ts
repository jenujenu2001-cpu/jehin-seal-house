import { v2 as cloudinary } from "cloudinary";

/**
 * All gallery photo storage goes through Cloudinary — nothing is written
 * to the local filesystem. This is what makes uploads work on Vercel:
 * Vercel's filesystem is read-only/ephemeral in production, so writing
 * uploaded files to /public/uploads (the old approach) meant every photo
 * vanished on the next deploy or cold start. Cloudinary stores the file
 * permanently and gives back a stable URL instead.
 *
 * Required environment variables (see .env.example):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const configured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (configured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true
  });
} else if (process.env.NODE_ENV === "production") {
  console.warn(
    "[cloudinary] CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not " +
      "all set. Image uploads will fail until they're configured."
  );
}

export function isCloudinaryConfigured(): boolean {
  return configured;
}

/** The folder every asset for this project lives under in the Cloudinary account. */
const ROOT_FOLDER = "jehin-seal-house";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Uploads a file buffer to Cloudinary under jehin-seal-house/<categoryId>/.
 * Throws if Cloudinary isn't configured or the upload fails — callers
 * should catch and turn this into a clean API error response.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string,
  categoryId: string
): Promise<CloudinaryUploadResult> {
  if (!configured) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and " +
        "CLOUDINARY_API_SECRET in your environment."
    );
  }

  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `${ROOT_FOLDER}/${categoryId}`,
    resource_type: "image",
    // Cache-friendly, web-optimized delivery — see the Next.js Image
    // usage in components/Gallery.tsx, which handles resizing/formats on
    // top of this via Next's image optimizer.
    overwrite: false
  });

  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Deletes an asset from Cloudinary by its public_id. Safe to call on an
 * id that no longer exists — Cloudinary returns `not found` rather than
 * throwing, and callers here treat that as a no-op.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!configured) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    // Deletion failures shouldn't block the rest of the operation (e.g.
    // removing a category whose images are already gone) — log and move on.
    console.error("[cloudinary] failed to delete", publicId, err);
  }
}
