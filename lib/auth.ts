/**
 * Node-only auth helpers — password checking and session token creation.
 *
 * IMPORTANT: this file uses Node's `crypto` module and must only be
 * imported from code that runs in the Node.js runtime (API routes under
 * app/api/**, which use the Node runtime by default). It must NEVER be
 * imported from middleware.ts — middleware runs in the Edge Runtime, which
 * does not support Node's `crypto` module and will crash at request time
 * with "The edge runtime does not support Node.js 'crypto' module."
 *
 * Middleware verifies session tokens using lib/auth-edge.ts instead, which
 * uses the Web Crypto API (available in both the Edge Runtime and Node).
 * Both files compute the same HMAC-SHA256 hex digest for the same input,
 * so a token created here verifies correctly there.
 */
import crypto from "crypto";
import { COOKIE_NAME } from "./constants";

const SECRET = process.env.ADMIN_SECRET || "dev-only-insecure-secret";

if (process.env.NODE_ENV === "production" && !process.env.ADMIN_SECRET) {
  // Don't crash the process over this — a missing secret shouldn't take the
  // whole site down — but make it loud so it doesn't go unnoticed.
  console.warn(
    "[auth] ADMIN_SECRET is not set. Falling back to an insecure default — " +
      "set a long random ADMIN_SECRET before going live."
  );
}

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

/** Builds a signed session token: "<expiry-timestamp>.<signature>" */
export function createSessionToken(hoursValid = 12): string {
  const expiry = (Date.now() + hoursValid * 60 * 60 * 1000).toString();
  const signature = sign(expiry);
  return `${expiry}.${signature}`;
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  // Constant-time comparison so response timing can't leak how much of the
  // password guess was correct.
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
}

export { COOKIE_NAME };
