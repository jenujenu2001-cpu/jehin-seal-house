import { MongoClient } from "mongodb";

/**
 * A cached MongoClient connection promise.
 *
 * Vercel serverless functions can be reused ("warm") across requests within
 * the same process. Opening a new MongoClient on every request would open a
 * new connection every time even on warm invocations, quickly exhausting
 * MongoDB Atlas's connection limit. Caching the connection promise on
 * `global` means a warm invocation reuses the same connection instead of
 * creating a new one.
 *
 * In development, Next.js's Fast Refresh can re-evaluate this module on
 * every file save; without the `global` cache, that would also open a new
 * connection each time and leak connections locally. Using `global`
 * specifically (not just a module-level variable) survives that
 * re-evaluation because `global` persists across module reloads within the
 * same Node process.
 *
 * This is the pattern documented by MongoDB for Next.js / serverless use:
 * https://www.mongodb.com/docs/drivers/node/current/quick-start/
 */

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your environment (see .env.example) — it should be " +
        "your MongoDB Atlas connection string."
    );
  }

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  // In production, each cold start creates its own module scope, so a
  // plain module-level cache (below) is enough — no need for `global` there.
  return client.connect();
}

let clientPromise: Promise<MongoClient> | undefined;

export function getMongoClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = createClientPromise();
  }
  return clientPromise;
}

/** The database this project uses. Override with MONGODB_DB_NAME if your
 * Atlas connection string doesn't include a database name in its path. */
export function getDbName(): string {
  return process.env.MONGODB_DB_NAME || "jehin_seal_house";
}
