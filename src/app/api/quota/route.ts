import { NextResponse } from 'next/server';
import { handleApiError, requireUserId } from '@/lib/api';
import { getQuota } from '@/services/cvService';

export async function GET() {
  try {
    const userId = await requireUserId();
    return NextResponse.json(await getQuota(userId));
  } catch (error) {
    return handleApiError(error, 'GET /api/quota');
  }
}
