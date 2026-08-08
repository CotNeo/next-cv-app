import { NextResponse } from 'next/server';
import { handleApiError, requireUserId } from '@/lib/api';
import { enforceRateLimit } from '@/lib/rate-limit';
import { generateShareToken, revokeShareToken } from '@/services/cvService';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    enforceRateLimit('write', userId);

    const { id } = await params;
    const shareToken = await generateShareToken(id, userId);
    return NextResponse.json({ shareToken });
  } catch (error) {
    return handleApiError(error, 'POST /api/cv/[id]/share');
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    enforceRateLimit('write', userId);

    const { id } = await params;
    await revokeShareToken(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/cv/[id]/share');
  }
}
