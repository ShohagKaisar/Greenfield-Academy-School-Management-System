import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { date, courseId, studentId, status, page, limit } = params;

    const where: any = {};
    if (date) where.date = date;
    if (courseId) where.courseId = courseId;
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const attendance = await db.attendance.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, email: true, avatar: true } },
        course: { select: { id: true, title: true, code: true } },
      },
      orderBy: { date: 'desc' },
    });

    const total = attendance.length;
    const start = (page - 1) * limit;
    const paginated = attendance.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch attendance');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, courseId, date, attendanceStatus, remarks } = body;

    if (!studentId || !date) {
      return NextResponse.json({ success: false, message: 'Student ID and date are required' }, { status: 400 });
    }

    const record = await db.attendance.create({
      data: {
        studentId,
        courseId: courseId || null,
        date,
        status: attendanceStatus || 'present',
        remarks: remarks || null,
      },
      include: {
        student: { select: { id: true, name: true } },
        course: { select: { id: true, title: true } },
      },
    });

    return success(record, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to mark attendance');
  }
}
