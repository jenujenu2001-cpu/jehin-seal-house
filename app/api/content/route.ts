import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { withErrorHandling } from "@/lib/apiError";

// lib/content.ts reads/writes data/content.json with Node's fs module —
// must run in the Node runtime.
export const runtime = "nodejs";

export const GET = withErrorHandling(async () => {
  const content = await getContent();
  const { categories, ...settings } = content;
  return NextResponse.json(settings);
});

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const content = await getContent();

  if (body.business) content.business = { ...content.business, ...body.business };
  if (body.hero) content.hero = { ...content.hero, ...body.hero };
  if (Array.isArray(body.whyChooseUs)) content.whyChooseUs = body.whyChooseUs;
  if (Array.isArray(body.testimonials)) content.testimonials = body.testimonials;

  await saveContent(content);
  const { categories, ...settings } = content;
  return NextResponse.json(settings);
});
