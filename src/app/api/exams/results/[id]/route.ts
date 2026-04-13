import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, badRequest, error } from '@/lib/api-helper';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { marks, grade, remarks } = body;

    let calculatedGrade = grade;
    if (!calculatedGrade && marks !== undefined) {
      const pct = parseFloat(marks);
      if (pct >= 90) calculatedGrade = 'A+';
      else if (pct >= 85) calculatedGrade = 'A';
      else if (pct >= 80) calculatedGrade = 'A-';
      else if (pct >= 75) calculatedGrade = 'B+';
      else if (pct >= 70) calculatedGrade = 'B';
      else if (pct >= 65) calculatedGrade = 'B-';
      else if (pct >= 60) calculatedGrade = 'C+';
      else if (pct >= 55) calculatedGrade = 'C';
      else if (pct >= 50) calculatedGrade = 'D';
      else calculatedGrade = 'F';
    }

    const result = await db.examResult.update({
      where: { id },
      data: {
        ...(marks !== undefined && { marks: parseFloat(marks) }),
        ...(calculatedGrade !== undefined && { grade: calculatedGrade }),
        ...(remarks !== undefined && { remarks }),
      },
      include: {
        student: { select: { id: true, name: true } },
        course: { select: { id: true, title: true } },
        exam: { select: { id: true, name: true } },
      },
    });

    return success(result);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Result not found');
    return error(err.message || 'Failed to update result');
  }
}
