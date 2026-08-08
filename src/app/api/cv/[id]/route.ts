import { NextResponse } from 'next/server';
import { handleApiError, readJson, requireUserId } from '@/lib/api';
import { enforceRateLimit } from '@/lib/rate-limit';
import { cvActionSchema, cvUpdateSchema } from '@/lib/validation';
import {
  deleteCV,
  getOwnedCV,
  improveCV,
  runATSReview,
  translateCVContent,
  updateCV,
} from '@/services/cvService';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const cv = await getOwnedCV(id, userId);
    return NextResponse.json(cv);
  } catch (error) {
    return handleApiError(error, 'GET /api/cv/[id]');
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    enforceRateLimit('write', userId);

    const { id } = await params;
    const updates = cvUpdateSchema.parse(await readJson(request));
    const cv = await updateCV(id, userId, updates);
    return NextResponse.json(cv);
  } catch (error) {
    return handleApiError(error, 'PUT /api/cv/[id]');
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    enforceRateLimit('write', userId);

    const { id } = await params;
    await deleteCV(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/cv/[id]');
  }
}

/** AI actions. Rate limited separately because each call costs real money. */
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    enforceRateLimit('ai', userId);

    const { id } = await params;
    const body = cvActionSchema.parse(await readJson(request));

    switch (body.action) {
      case 'ats-review': {
        const review = await runATSReview(id, userId);
        return NextResponse.json(review);
      }
      case 'translate': {
        const cv = await translateCVContent(id, userId, body.data.targetLanguage);
        return NextResponse.json(cv);
      }
      case 'improve': {
        const cv = await improveCV(id, userId);
        return NextResponse.json(cv);
      }
    }
  } catch (error) {
    return handleApiError(error, 'POST /api/cv/[id]');
  }
}
