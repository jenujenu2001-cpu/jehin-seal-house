import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, slugify, type Category, type CategoryTheme } from "@/lib/content";
import { withErrorHandling } from "@/lib/apiError";

// lib/content.ts reads/writes data/content.json with Node's fs module —
// must run in the Node runtime, not the Edge Runtime.
export const runtime = "nodejs";

const VALID_THEMES: CategoryTheme[] = ["school", "gift", "print", "creative", "photo"];

export const GET = withErrorHandling(async () => {
  const content = await getContent();
  return NextResponse.json(content.categories);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "A category name is required" }, { status: 400 });
  }

  const theme: CategoryTheme = VALID_THEMES.includes(body.theme) ? body.theme : "print";
  const content = await getContent();

  let id = slugify(body.name);
  let suffix = 2;
  while (content.categories.some((c) => c.id === id)) {
    id = `${slugify(body.name)}-${suffix}`;
    suffix += 1;
  }

  const newCategory: Category = {
    id,
    name: body.name.trim(),
    theme,
    description: typeof body.description === "string" ? body.description.trim() : "",
    images: []
  };

  content.categories.push(newCategory);
  await saveContent(content);

  return NextResponse.json(newCategory, { status: 201 });
});
