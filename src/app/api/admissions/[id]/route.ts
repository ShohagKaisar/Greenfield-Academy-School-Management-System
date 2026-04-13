import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admission = await db.admission.findUnique({
      where: { applicationId: id },
      include: { course: true },
    });

    if (!admission) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(admission);
  } catch (error) {
    console.error('Error fetching admission:', error);
    return NextResponse.json({ error: 'Failed to fetch application status' }, { status: 500 });
  }
}
