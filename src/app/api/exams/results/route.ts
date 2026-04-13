import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, badRequest, error, getQueryParams, unauthorized } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { examId, courseId, studentId, page, limit } = params;

    const where: any = {};
    if (examId) where.examId = examId;
    if (courseId) where.courseId = courseId;
    if (studentId) where.studentId = studentId;

    const results = await db.examResult.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, email: true, avatar: true } },
        course: { select: { id: true, title: true, code: true } },
        exam: { select: { id: true, name: true, type: true, totalMarks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = results.length;
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch results');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const body = await request.json();
    const { examId, courseId, studentId, marks, grade, remarks } = body;

    if (!examId || !courseId || !studentId || marks === undefined) {
      return badRequest('Exam ID, course ID, student ID, and marks are required');
    }

    // Auto-calculate grade
    let calculatedGrade = grade;
    if (!calculatedGrade) {
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

    const result = await db.examResult.create({
      data: {
        examId,
        courseId,
        studentId,
        marks: parseFloat(marks),
        grade: calculatedGrade,
        remarks: remarks || null,
      },
      include: {
        student: { select: { id: true, name: true } },
        course: { select: { id: true, title: true } },
        exam: { select: { id: true, name: true } },
      },
    });

    return success(result, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create result');
  }
}
