import { NextResponse } from 'next/server';
import { handleApiError, requireUserId } from '@/lib/api';
import { listUserApplications } from '@/services/applicationService';

export async function GET() {
  try {
    const userId = await requireUserId();
    const applications = await listUserApplications(userId);
    return NextResponse.json(applications);
  } catch (error) {
    return handleApiError(error, 'GET /api/applications');
  }
}
