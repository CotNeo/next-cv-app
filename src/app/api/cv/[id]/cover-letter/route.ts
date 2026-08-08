import { NextResponse } from 'next/server';
import { handleApiError, readJson, requireUserId } from '@/lib/api';
import { enforceRateLimit } from '@/lib/rate-limit';
import { coverLetterSchema } from '@/lib/validation';
import { createCoverLetter } from '@/services/applicationService';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    enforceRateLimit('ai', userId);

    const { id: cvId } = await params;
    const input = coverLetterSchema.parse(await readJson(request));
    const result = await createCoverLetter(cvId, userId, input);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/cv/[id]/cover-letter');
  }
}
