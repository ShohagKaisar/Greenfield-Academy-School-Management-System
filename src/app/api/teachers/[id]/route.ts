import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const teacher = await db.user.findUnique({
      where: { id, role: 'teacher' },
      include: {
        teacherProfile: {
          include: {
            courses: {
              include: { _count: { select: { enrollments: true } } },
            },
            assignments: true,
          },
        },
        _count: { select: { courses: true, assignments: true } },
      },
    });

    if (!teacher) return notFound('Teacher not found');

    return success(teacher);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch teacher');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { name, phone, department, designation, qualification, specialization, salary, bio, experience, isActive } = body;

    const user = await db.user.update({
      where: { id, role: 'teacher' },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    const profileUpdateData: any = {};
    if (department !== undefined) profileUpdateData.department = department;
    if (designation !== undefined) profileUpdateData.designation = designation;
    if (qualification !== undefined) profileUpdateData.qualification = qualification;
    if (specialization !== undefined) profileUpdateData.specialization = specialization;
    if (salary !== undefined) profileUpdateData.salary = salary;
    if (bio !== undefined) profileUpdateData.bio = bio;
    if (experience !== undefined) profileUpdateData.experience = experience;

    if (Object.keys(profileUpdateData).length > 0) {
      const profile = await db.teacherProfile.findUnique({ where: { userId: id } });
      if (profile) {
        await db.teacherProfile.update({ where: { userId: id }, data: profileUpdateData });
      }
    }

    const fullUser = await db.user.findUnique({
      where: { id },
      include: { teacherProfile: true },
    });

    return success(fullUser);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Teacher not found');
    return error(err.message || 'Failed to update teacher');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete teachers');

    const { id } = await params;
    await db.user.delete({ where: { id, role: 'teacher' } });

    return success({ message: 'Teacher deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Teacher not found');
    return error(err.message || 'Failed to delete teacher');
  }
}
