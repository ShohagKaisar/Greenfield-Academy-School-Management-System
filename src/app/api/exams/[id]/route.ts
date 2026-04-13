import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true, code: true } },
        results: {
          include: {
            student: { select: { id: true, name: true, email: true, avatar: true } },
          },
          orderBy: { marks: 'desc' },
        },
      },
    });

    if (!exam) return notFound('Exam not found');

    return success(exam);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch exam');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { name, type, totalMarks, date, status } = body;

    const exam = await db.exam.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(totalMarks !== undefined && { totalMarks }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
        ...(status !== undefined && { status }),
      },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    return success(exam);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Exam not found');
    return error(err.message || 'Failed to update exam');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete exams');

    const { id } = await params;
    await db.exam.delete({ where: { id } });

    return success({ message: 'Exam deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Exam not found');
    return error(err.message || 'Failed to delete exam');
  }
}
