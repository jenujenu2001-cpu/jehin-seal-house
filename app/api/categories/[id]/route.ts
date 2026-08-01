import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, type CategoryTheme } from "@/lib/content";
import { withErrorHandling } from "@/lib/apiError";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const VALID_THEMES: CategoryTheme[] = ["school", "gift", "print", "creative", "photo"];

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const content = await getContent();
  const category = content.categories.find((c) => c.id === params.id);
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  if (typeof body.name === "string" && body.name.trim()) category.name = body.name.trim();
  if (typeof body.description === "string") category.description = body.description.trim();
  if (VALID_THEMES.includes(body.theme)) category.theme = body.theme;

  await saveContent(content);
  return NextResponse.json(category);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  const content = await getContent();
  const index = content.categories.findIndex((c) => c.id === params.id);
  if (index === -1) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const [removed] = content.categories.splice(index, 1);
  await saveContent(content);

  // Best-effort cleanup of that category's Cloudinary assets — no orphan
  // images left behind in the Cloudinary account.
  await Promise.all(
    removed.images.map((img) => (img.publicId ? deleteFromCloudinary(img.publicId) : Promise.resolve()))
  );

  return NextResponse.json({ ok: true });
});
