import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { withErrorHandling } from "@/lib/apiError";
import { deleteFromCloudinary, uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

// Deletes/replaces the Cloudinary asset (see lib/cloudinary.ts) — no
// local filesystem access.
export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export const DELETE = withErrorHandling(
  async (_req: NextRequest, { params }: { params: { id: string; imageId: string } }) => {
    const content = await getContent();
    const category = content.categories.find((c) => c.id === params.id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const index = category.images.findIndex((img) => img.id === params.imageId);
    if (index === -1) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    const [removed] = category.images.splice(index, 1);
    await saveContent(content);

    if (removed.publicId) await deleteFromCloudinary(removed.publicId);

    return NextResponse.json({ ok: true });
  }
);

/**
 * Replaces the photo in one gallery slot with a new upload, keeping the
 * same GalleryImage id (and therefore its position in the gallery). The
 * old Cloudinary asset is deleted once the new one has uploaded
 * successfully, so a failed replace never leaves the gallery empty.
 */
export const PUT = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string; imageId: string } }) => {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            "Image uploads aren't configured yet. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, " +
            "and CLOUDINARY_API_SECRET in your environment (see .env.example), then redeploy."
        },
        { status: 500 }
      );
    }

    const content = await getContent();
    const category = content.categories.find((c) => c.id === params.id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const index = category.images.findIndex((img) => img.id === params.imageId);
    if (index === -1) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    const formData = await req.formData().catch(() => null);
    const file = formData?.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No replacement file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Use JPEG, PNG, or WEBP" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File is too large (max 8MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let result;
    try {
      result = await uploadToCloudinary(buffer, file.type, category.id);
    } catch (err) {
      console.error("[uploads] Cloudinary replace-upload failed", err);
      return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }

    const old = category.images[index];
    category.images[index] = {
      id: old.id,
      url: result.url,
      alt: `${category.name} — Jehin Seal House`,
      publicId: result.publicId
    };

    await saveContent(content);

    // Only delete the old asset once the new one is safely saved.
    if (old.publicId) await deleteFromCloudinary(old.publicId);

    return NextResponse.json(category.images[index]);
  }
);
