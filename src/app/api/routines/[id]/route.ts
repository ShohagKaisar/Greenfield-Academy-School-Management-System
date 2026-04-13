import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { day, startTime, endTime, room, teacherId } = body;

    const routine = await db.classRoutine.update({
      where: { id },
      data: {
        ...(day !== undefined && { day }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(room !== undefined && { room }),
        ...(teacherId !== undefined && { teacherId }),
      },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { include: { user: { select: { name: true } } } },
      },
    });

    return success(routine);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Routine not found');
    return error(err.message || 'Failed to update routine');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete routines');

    const { id } = await params;
    await db.classRoutine.delete({ where: { id } });
    return success({ message: 'Routine deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Routine not found');
    return error(err.message || 'Failed to delete routine');
  }
}
