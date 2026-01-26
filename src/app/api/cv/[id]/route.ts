import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  getCVById,
  updateCV,
  deleteCV,
  getATSReview,
  translateCVContent,
  improveCV,
} from '@/services/cvService';
import { authOptions } from '@/lib/auth';

async function assertOwnership(cvId: string, userId: string) {
  const cv = await getCVById(cvId);
  if (cv.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }
  return cv;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const cv = await assertOwnership(id, session.user.id);
    return NextResponse.json(cv);
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((error as Error).message === 'CV not found') {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }
    console.error('CV fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CV' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await assertOwnership(id, session.user.id);
    const updates = await request.json();
    const cv = await updateCV(id, updates);
    return NextResponse.json(cv);
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((error as Error).message === 'CV not found') {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }
    console.error('CV update error:', error);
    return NextResponse.json(
      { error: 'Failed to update CV' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await assertOwnership(id, session.user.id);
    await deleteCV(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((error as Error).message === 'CV not found') {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }
    console.error('CV delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await assertOwnership(id, session.user.id);
    const body = await request.json();
    const action = body?.action as string;
    const data = body?.data as { targetLanguage?: string } | undefined;

    let result: unknown;
    switch (action) {
      case 'ats-review':
        result = await getATSReview(id);
        break;
      case 'translate': {
        const lang = data?.targetLanguage;
        if (!lang || typeof lang !== 'string') {
          return NextResponse.json(
            { error: 'targetLanguage required for translate' },
            { status: 400 }
          );
        }
        result = await translateCVContent(id, lang);
        break;
      }
      case 'improve':
        result = await improveCV(id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((error as Error).message === 'CV not found') {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }
    console.error('CV action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform CV action' },
      { status: 500 }
    );
  }
}
