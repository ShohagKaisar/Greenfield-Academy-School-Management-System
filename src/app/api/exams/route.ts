import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { courseId, type, status, page, limit } = params;

    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (type) where.type = type;
    if (status) where.status = status;

    const exams = await db.exam.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, code: true } },
        _count: { select: { results: true } },
      },
      orderBy: { date: 'desc' },
    });

    const total = exams.length;
    const start = (page - 1) * limit;
    const paginated = exams.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch exams');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!['admin', 'teacher'].includes(payload.role)) {
      return NextResponse.json({ success: false, message: 'Only admin or teacher can create exams' }, { status: 403 });
    }

    const body = await request.json();
    const { name, courseId, type, totalMarks, date } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Exam name is required' }, { status: 400 });
    }

    const exam = await db.exam.create({
      data: {
        name,
        courseId: courseId || null,
        type: type || 'midterm',
        totalMarks: totalMarks || 100,
        date: date ? new Date(date) : null,
        status: date ? (new Date(date) <= new Date() ? 'completed' : 'upcoming') : 'upcoming',
      },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    return success(exam, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create exam');
  }
}
