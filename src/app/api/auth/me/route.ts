import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, error } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: {
        studentProfile: {
          include: { enrollments: { include: { course: true } } },
        },
        teacherProfile: {
          include: { courses: true, assignments: true },
        },
        adminProfile: true,
      },
    });

    if (!user) return unauthorized();

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return success(userWithoutPassword);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch profile');
  }
}
