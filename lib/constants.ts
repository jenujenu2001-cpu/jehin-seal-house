/**
 * Constants shared between lib/auth.ts (Node runtime — used by API routes)
 * and lib/auth-edge.ts (Edge runtime — used by middleware.ts).
 *
 * This file must never import "crypto" or any other Node-only module:
 * middleware.ts runs in the Edge Runtime, and importing Node's `crypto`
 * there throws "The edge runtime does not support Node.js 'crypto' module."
 * Keeping the cookie name here (instead of in lib/auth.ts) lets the edge
 * file avoid touching lib/auth.ts — and therefore avoid touching
 * Node's `crypto` — entirely.
 */
export const COOKIE_NAME = "jsh_admin_session";
