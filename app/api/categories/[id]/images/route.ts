import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, type GalleryImage } from "@/lib/content";
import { withErrorHandling } from "@/lib/apiError";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

// Uploads go to Cloudinary (see lib/cloudinary.ts) — no local filesystem
// writes, so this works unchanged on Vercel's read-only production
// filesystem. Still runs in the Node runtime (default for API routes).
export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export const POST = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
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

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

  const uploaded: GalleryImage[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) continue; // skip unsupported types
    if (file.size > MAX_SIZE) continue; // skip oversized files

    const buffer = Buffer.from(await file.arrayBuffer());

    let result;
    try {
      result = await uploadToCloudinary(buffer, file.type, category.id);
    } catch (err) {
      console.error("[uploads] Cloudinary upload failed for", file.name, err);
      continue; // skip this file, try the rest
    }

    const image: GalleryImage = {
      id: crypto.randomUUID(),
      url: result.url,
      alt: `${category.name} — Jehin Seal House`,
      publicId: result.publicId
    };
    category.images.push(image);
    uploaded.push(image);
  }

  if (uploaded.length === 0) {
    return NextResponse.json(
      { error: "No valid images were uploaded (use JPEG, PNG or WEBP under 8MB, and check Cloudinary credentials)" },
      { status: 400 }
    );
  }

  await saveContent(content);
  return NextResponse.json(uploaded, { status: 201 });
});

export const GET = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  const content = await getContent();
  const category = content.categories.find((c) => c.id === params.id);
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json(category.images);
});
