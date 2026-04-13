import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { search, page, limit } = params;

    const where: any = { role: 'student' };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const students = await db.user.findMany({
      where,
      include: {
        studentProfile: true,
        _count: { select: { enrollments: true, attendances: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = students.length;
    const start = (page - 1) * limit;
    const paginated = students.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch students');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, dateOfBirth, gender, address, bloodGroup, guardianName, guardianPhone, guardianRelation, previousSchool, previousResult, class: studentClass, section, batch } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
    }

    const { hashPassword, generateStudentId } = await import('@/lib/auth');
    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name, email, password: hashedPassword, role: 'student',
        phone: phone || null, dateOfBirth: dateOfBirth || null, gender: gender || null,
        address: address || null, bloodGroup: bloodGroup || null,
      },
    });

    await db.studentProfile.create({
      data: {
        userId: user.id,
        studentId: generateStudentId(),
        guardianName: guardianName || null, guardianPhone: guardianPhone || null,
        guardianRelation: guardianRelation || null, previousSchool: previousSchool || null,
        previousResult: previousResult || null, class: studentClass || null,
        section: section || null, batch: batch || null,
      },
    });

    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      include: { studentProfile: true },
    });

    return success(fullUser, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create student');
  }
}
