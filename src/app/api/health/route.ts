import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { isAIEnabled } from '@/lib/env';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * Liveness/readiness probe for load balancers and uptime monitors.
 * Returns 503 while the database is unreachable so traffic can be drained.
 */
export async function GET() {
  const checks: Record<string, string> = {};
  let healthy = true;

  try {
    await connectToDatabase();
    checks.database = mongoose.connection.readyState === 1 ? 'up' : 'connecting';
    if (checks.database !== 'up') healthy = false;
  } catch {
    checks.database = 'down';
    healthy = false;
  }

  checks.ai = isAIEnabled() ? 'configured' : 'disabled';

  return NextResponse.json(
    { status: healthy ? 'ok' : 'degraded', checks, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  );
}
