import { NextResponse } from 'next/server';
import { handleApiError, requireUserId } from '@/lib/api';
import { enforceRateLimit } from '@/lib/rate-limit';
import { deleteApplication, getApplication } from '@/services/applicationService';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    return NextResponse.json(await getApplication(id, userId));
  } catch (error) {
    return handleApiError(error, 'GET /api/applications/[id]');
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    enforceRateLimit('write', userId);

    const { id } = await params;
    await deleteApplication(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/applications/[id]');
  }
}
