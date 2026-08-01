import { NextResponse } from "next/server";

/**
 * Wraps a route handler so unexpected errors (a filesystem write failing,
 * a corrupt request, etc.) return a clean JSON error response instead of
 * an unhandled exception. Next.js turns an unhandled route handler error
 * into an HTML 500 page, which breaks every admin-dashboard fetch call
 * that expects `res.json()` to succeed — this keeps every response, error
 * or not, valid JSON.
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse>
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error("[api error]", err);
      return NextResponse.json(
        { error: "Something went wrong on the server. Please try again." },
        { status: 500 }
      );
    }
  };
}
