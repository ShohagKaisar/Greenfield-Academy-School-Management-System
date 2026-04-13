import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams, unauthorized, badRequest } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { courseId, teacherId, status, page, limit } = params;

    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (teacherId) where.teacherId = teacherId;
    if (status) where.status = status;

    const assignments = await db.assignment.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, code: true } },
        teacher: { include: { user: { select: { name: true, avatar: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = assignments.length;
    const start = (page - 1) * limit;
    const paginated = assignments.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch assignments');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const body = await request.json();
    const { title, description, courseId, teacherId, dueDate, totalMarks, status } = body;

    if (!title || !courseId) return badRequest('Title and course ID are required');

    // If teacher is creating, use their profile
    let assignmentTeacherId = teacherId;
    if (payload.role === 'teacher' && !teacherId) {
      const teacher = await db.teacherProfile.findUnique({ where: { userId: payload.userId } });
      assignmentTeacherId = teacher?.id;
    }

    const assignment = await db.assignment.create({
      data: {
        title,
        description: description || null,
        courseId,
        teacherId: assignmentTeacherId || '',
        dueDate: dueDate ? new Date(dueDate) : null,
        totalMarks: totalMarks || 100,
        status: status || 'active',
      },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { include: { user: { select: { name: true } } } },
      },
    });

    return success(assignment, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create assignment');
  }
}
