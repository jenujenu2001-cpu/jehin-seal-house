import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, isValidSessionToken } from "@/lib/auth-edge";

// Runs in the Edge Runtime — must only import Edge-safe modules
// (see lib/auth-edge.ts). Do not import lib/auth.ts here.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedApi =
    (pathname.startsWith("/api/categories") ||
      pathname.startsWith("/api/content")) &&
    req.method !== "GET";

  if (isAdminPage || isProtectedApi) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const valid = await isValidSessionToken(token);
    if (!valid) {
      if (isProtectedApi) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/categories/:path*", "/api/content/:path*"]
};
