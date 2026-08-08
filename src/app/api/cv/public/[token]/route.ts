import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api';
import { clientIp, enforceRateLimit } from '@/lib/rate-limit';
import { getCVByShareToken } from '@/services/cvService';

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    // Unauthenticated endpoint, so the IP is the only identity available.
    enforceRateLimit('publicRead', clientIp(request));

    const { token } = await params;
    const cv = await getCVByShareToken(token);
    return NextResponse.json(cv);
  } catch (error) {
    return handleApiError(error, 'GET /api/cv/public/[token]');
  }
}
