import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, badRequest, error } from '@/lib/api-helper';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'student') return badRequest('Only students can enroll');

    const { id } = await params;

    const course = await db.course.findUnique({ where: { id } });
    if (!course) return notFound('Course not found');
    if (course.status !== 'active') return badRequest('Course is not available for enrollment');
    if (course.enrolled >= course.seats) return badRequest('No seats available');

    const studentProfile = await db.studentProfile.findUnique({ where: { userId: payload.userId } });
    if (!studentProfile) return badRequest('Student profile not found');

    // Check if already enrolled
    const existing = await db.enrollment.findFirst({
      where: { studentId: studentProfile.id, courseId: id },
    });
    if (existing) return badRequest('Already enrolled in this course');

    const enrollment = await db.enrollment.create({
      data: {
        studentId: studentProfile.id,
        courseId: id,
      },
    });

    // Update enrolled count
    await db.course.update({
      where: { id },
      data: { enrolled: { increment: 1 } },
    });

    return success(enrollment, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to enroll');
  }
}
