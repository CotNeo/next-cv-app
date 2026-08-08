import mongoose from 'mongoose';
import { getEnv } from '@/lib/env';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

/**
 * Reused across hot reloads and serverless invocations so a single process
 * never opens more than one connection pool.
 */
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
if (!global.mongooseCache) global.mongooseCache = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(getEnv().MONGODB_URI, {
      // Serverless functions should fail fast rather than hold a request open
      // while the driver retries a server it cannot reach.
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Clear the rejected promise so the next request retries instead of
    // replaying the same failure forever.
    cached.promise = null;
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!cached.conn) return;
  await cached.conn.disconnect();
  cached.conn = null;
  cached.promise = null;
}
