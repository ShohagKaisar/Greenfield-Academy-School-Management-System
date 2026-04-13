import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, badRequest, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const course = await db.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: { user: { select: { name: true, email: true, avatar: true, phone: true } } },
        },
        enrollments: {
          include: {
            student: { include: { user: { select: { name: true, email: true, avatar: true } } } },
          },
        },
        assignments: {
          include: {
            teacher: { include: { user: { select: { name: true } } } },
          },
        },
        _count: { select: { enrollments: true, assignments: true, exams: true, routines: true } },
      },
    });

    if (!course) return notFound('Course not found');

    return success(course);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch course');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) {
      return unauthorized('Only admin or teacher can update courses');
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, category, level, duration, fees, seats, status, syllabus, requirements, image, featured, startDate, endDate, code } = body;

    const course = await db.course.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(level !== undefined && { level }),
        ...(duration !== undefined && { duration }),
        ...(fees !== undefined && { fees }),
        ...(seats !== undefined && { seats }),
        ...(status !== undefined && { status }),
        ...(syllabus !== undefined && { syllabus }),
        ...(requirements !== undefined && { requirements }),
        ...(image !== undefined && { image }),
        ...(featured !== undefined && { featured }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(code !== undefined && { code }),
      },
      include: {
        teacher: {
          include: { user: { select: { name: true, email: true, avatar: true } } },
        },
      },
    });

    return success(course);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Course not found');
    return error(err.message || 'Failed to update course');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete courses');

    const { id } = await params;
    await db.course.delete({ where: { id } });

    return success({ message: 'Course deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Course not found');
    return error(err.message || 'Failed to delete course');
  }
}
