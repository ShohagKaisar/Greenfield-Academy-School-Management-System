import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams, unauthorized, badRequest } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { day, courseId, page, limit } = params;

    const where: any = {};
    if (day) where.day = day;
    if (courseId) where.courseId = courseId;

    const routines = await db.classRoutine.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, code: true } },
        teacher: {
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
    });

    const total = routines.length;
    const start = (page - 1) * limit;
    const paginated = routines.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch routines');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const body = await request.json();
    const { courseId, day, startTime, endTime, room, teacherId } = body;

    if (!courseId || !day || !startTime || !endTime) {
      return badRequest('Course ID, day, start time, and end time are required');
    }

    const routine = await db.classRoutine.create({
      data: {
        courseId,
        day,
        startTime,
        endTime,
        room: room || null,
        teacherId: teacherId || null,
      },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { include: { user: { select: { name: true } } } },
      },
    });

    return success(routine, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create routine');
  }
}
