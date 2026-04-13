import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, unauthorized, badRequest, error } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) {
      return unauthorized('Only admin or teacher can mark attendance');
    }

    const body = await request.json();
    const { courseId, date, records } = body;

    if (!date || !records || !Array.isArray(records)) {
      return badRequest('Date and records array are required');
    }

    const results = [];
    for (const record of records) {
      const { studentId, status, remarks } = record;
      if (!studentId) continue;

      try {
        const attendance = await db.attendance.upsert({
          where: {
            studentId_courseId_date: {
              studentId,
              courseId: courseId || '',
              date,
            },
          },
          update: { status: status || 'present', remarks: remarks || null },
          create: {
            studentId,
            courseId: courseId || null,
            date,
            status: status || 'present',
            remarks: remarks || null,
          },
        });
        results.push(attendance);
      } catch {
        // Skip duplicates or errors
      }
    }

    return success({ marked: results.length, records: results }, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to bulk mark attendance');
  }
}
