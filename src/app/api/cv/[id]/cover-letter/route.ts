import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCoverLetter } from '@/services/applicationService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id: cvId } = await params;
    const body = await request.json();
    const jobTitle = body?.jobTitle?.trim();
    const companyName = body?.companyName?.trim();
    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { error: 'jobTitle and companyName are required' },
        { status: 400 }
      );
    }
    const result = await createCoverLetter(cvId, session.user.id, {
      jobTitle,
      companyName,
      jobDescription: body?.jobDescription?.trim() ?? '',
      language: body?.language ?? 'tr',
    });
    return NextResponse.json(result);
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((error as Error).message === 'CV not found') {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }
    console.error('Cover letter error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
