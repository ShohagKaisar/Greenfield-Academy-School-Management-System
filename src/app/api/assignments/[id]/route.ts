import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const assignment = await db.assignment.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true, code: true, description: true } },
        teacher: { include: { user: { select: { name: true, email: true, avatar: true } } } },
      },
    });

    if (!assignment) return notFound('Assignment not found');
    return success(assignment);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch assignment');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { title, description, dueDate, totalMarks, status } = body;

    const assignment = await db.assignment.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(totalMarks !== undefined && { totalMarks }),
        ...(status !== undefined && { status }),
      },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { include: { user: { select: { name: true } } } },
      },
    });

    return success(assignment);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Assignment not found');
    return error(err.message || 'Failed to update assignment');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    await db.assignment.delete({ where: { id } });
    return success({ message: 'Assignment deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Assignment not found');
    return error(err.message || 'Failed to delete assignment');
  }
}
