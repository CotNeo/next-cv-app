import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getCVById, updateCV, deleteCV, getATSReview, translateCVContent, improveCV } from '@/services/cvService';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Received CV fetch request for ID:', params.id);
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error('Unauthorized: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const cv = await getCVById(params.id);
    
    if (cv.userId.toString() !== session.user.id) {
      console.error('Unauthorized: CV does not belong to user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Successfully retrieved CV');
    return NextResponse.json(cv);
  } catch (error) {
    console.error('Error getting CV:', error);
    return NextResponse.json(
      { error: 'Failed to get CV' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Received CV update request for ID:', params.id);
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error('Unauthorized: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const updates = await request.json();
    const cv = await updateCV(params.id, updates);
    
    console.log('Successfully updated CV');
    return NextResponse.json(cv);
  } catch (error) {
    console.error('Error updating CV:', error);
    return NextResponse.json(
      { error: 'Failed to update CV' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Received CV delete request for ID:', params.id);
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error('Unauthorized: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await deleteCV(params.id);
    
    console.log('Successfully deleted CV');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Received CV action request for ID:', params.id);
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error('Unauthorized: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { action, data } = await request.json();
    
    let result;
    switch (action) {
      case 'ats-review':
        result = await getATSReview(params.id);
        break;
      case 'translate':
        result = await translateCVContent(params.id, data.targetLanguage);
        break;
      case 'improve':
        result = await improveCV(params.id);
        break;
      default:
        throw new Error('Invalid action');
    }
    
    console.log(`Successfully performed ${action} on CV`);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error performing CV action:', error);
    return NextResponse.json(
      { error: 'Failed to perform CV action' },
      { status: 500 }
    );
  }
} 