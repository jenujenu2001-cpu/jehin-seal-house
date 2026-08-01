import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { withErrorHandling } from "@/lib/apiError";

export const runtime = "nodejs";

/**
 * Reorders a category's gallery. Body: { order: string[] } — the full
 * list of that category's image ids in the desired order. Rejected if
 * the set of ids doesn't exactly match what's currently stored, so a
 * stale client can't silently drop or duplicate images.
 */
export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const body = await req.json().catch(() => null);
  const order = body?.order;
  if (!Array.isArray(order) || !order.every((id): id is string => typeof id === "string")) {
    return NextResponse.json({ error: "Expected { order: string[] }" }, { status: 400 });
  }

  const content = await getContent();
  const category = content.categories.find((c) => c.id === params.id);
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const currentIds = new Set(category.images.map((img) => img.id));
  const requestedIds = new Set(order);
  const sameSet =
    currentIds.size === requestedIds.size && [...currentIds].every((id) => requestedIds.has(id));

  if (!sameSet) {
    return NextResponse.json(
      { error: "The order list must contain exactly this category's current image ids" },
      { status: 400 }
    );
  }

  const byId = new Map(category.images.map((img) => [img.id, img]));
  category.images = order.map((id) => byId.get(id)!);

  await saveContent(content);
  return NextResponse.json(category.images);
});
