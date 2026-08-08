import { NextResponse } from 'next/server';
import { handleApiError, readJson, requireUserId } from '@/lib/api';
import { enforceRateLimit } from '@/lib/rate-limit';
import { cvCreateSchema } from '@/lib/validation';
import { createCV, getQuota, listUserCVs } from '@/services/cvService';

export async function GET() {
  try {
    const userId = await requireUserId();
    const cvs = await listUserCVs(userId);
    return NextResponse.json(cvs);
  } catch (error) {
    return handleApiError(error, 'GET /api/cv');
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    enforceRateLimit('write', userId);

    const data = cvCreateSchema.parse(await readJson(request));
    const cv = await createCV(userId, data);

    const quota = await getQuota(userId);
    return NextResponse.json({ ...cv.toObject(), quota }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/cv');
  }
}
