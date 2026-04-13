import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, badRequest, error } from '@/lib/api-helper';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can update admission status');

    const { id } = await params;
    const body = await request.json();
    const { status, remarks } = body;

    const validStatuses = ['pending', 'approved', 'rejected', 'waitlisted'];
    if (status && !validStatuses.includes(status)) {
      return badRequest('Invalid status');
    }

    const admission = await db.admission.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(remarks !== undefined && { remarks }),
        reviewedBy: payload.userId,
        reviewedAt: new Date(),
      },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    return success(admission);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Admission not found');
    return error(err.message || 'Failed to update admission status');
  }
}
