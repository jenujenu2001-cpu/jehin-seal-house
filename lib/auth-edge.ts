/**
 * Edge-safe auth helpers — session token verification only.
 *
 * middleware.ts runs in the Edge Runtime, which does not support Node's
 * `crypto` module. This file uses the Web Crypto API (`crypto.subtle`)
 * instead, which is available natively in the Edge Runtime and produces
 * the exact same HMAC-SHA256 hex digest as Node's `crypto.createHmac`,
 * so tokens signed in lib/auth.ts (Node runtime, in the login API route)
 * verify correctly here.
 *
 * Do not add Node-only imports (e.g. "crypto", "fs") to this file — it
 * must stay Edge-compatible.
 */
import { COOKIE_NAME } from "./constants";

const SECRET = process.env.ADMIN_SECRET || "dev-only-insecure-secret";

async function sign(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  const expectedSignature = await sign(expiry);
  if (expectedSignature !== signature) return false;
  return Number(expiry) > Date.now();
}

export { COOKIE_NAME };
