import { NextResponse } from 'next/server';
import { getCVByShareToken } from '@/services/cvService';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const cv = await getCVByShareToken(token);
    return NextResponse.json(cv);
  } catch (error) {
    if ((error as Error).message === 'CV not found or not public') {
      return NextResponse.json(
        { error: 'CV not found or not public' },
        { status: 404 }
      );
    }
    console.error('Get public CV error:', error);
    return NextResponse.json(
      { error: 'Failed to get public CV' },
      { status: 500 }
    );
  }
}
