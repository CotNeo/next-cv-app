import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import CV from '@/models/CV';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const cvs = await CV.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(cvs);
  } catch (error) {
    console.error('CV listeleme hatası:', error);
    return NextResponse.json(
      { error: 'CV\'ler listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectToDatabase();

    const cv = new CV({
      ...data,
      userId: session.user.id,
    });

    await cv.save();
    return NextResponse.json(cv);
  } catch (error) {
    console.error('CV oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'CV oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 