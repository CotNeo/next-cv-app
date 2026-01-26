import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateShareToken, revokeShareToken, getCVById } from '@/services/cvService';

async function assertOwnership(cvId: string, userId: string) {
  const cv = await getCVById(cvId);
  if (cv.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }
  return cv;
}

export async function POST(
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
    const shareToken = await generateShareToken(id);
    return NextResponse.json({ shareToken });
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((error as Error).message === 'CV not found') {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }
    console.error('Share CV error:', error);
    return NextResponse.json(
      { error: 'Failed to share CV' },
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
    await revokeShareToken(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((error as Error).message === 'CV not found') {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }
    console.error('Revoke share error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke share' },
      { status: 500 }
    );
  }
}
