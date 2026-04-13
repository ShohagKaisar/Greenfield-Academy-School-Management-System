import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams, badRequest } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { search, page, limit } = params;

    const where: any = { role: 'teacher' };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const teachers = await db.user.findMany({
      where,
      include: {
        teacherProfile: true,
        _count: { select: { courses: true, assignments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = teachers.length;
    const start = (page - 1) * limit;
    const paginated = teachers.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch teachers');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, department, designation, qualification, specialization, salary, bio, experience } = body;

    if (!name || !email || !password) {
      return badRequest('Name, email, and password are required');
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return badRequest('Email already exists');

    const { hashPassword, generateTeacherId } = await import('@/lib/auth');
    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name, email, password: hashedPassword, role: 'teacher',
        phone: phone || null,
      },
    });

    await db.teacherProfile.create({
      data: {
        userId: user.id,
        teacherId: generateTeacherId(),
        department: department || null, designation: designation || null,
        qualification: qualification || null, specialization: specialization || null,
        salary: salary || null, bio: bio || null, experience: experience || null,
      },
    });

    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      include: { teacherProfile: true },
    });

    return success(fullUser, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create teacher');
  }
}
