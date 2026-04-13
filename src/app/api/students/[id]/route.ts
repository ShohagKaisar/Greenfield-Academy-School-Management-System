import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, badRequest, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const student = await db.user.findUnique({
      where: { id, role: 'student' },
      include: {
        studentProfile: {
          include: { enrollments: { include: { course: true } } },
        },
        _count: { select: { enrollments: true, attendances: true, examResults: true, payments: true } },
      },
    });

    if (!student) return notFound('Student not found');

    return success(student);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch student');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { name, phone, dateOfBirth, gender, address, bloodGroup, isActive, guardianName, guardianPhone, guardianRelation, class: studentClass, section, batch } = body;

    const user = await db.user.update({
      where: { id, role: 'student' },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(dateOfBirth !== undefined && { dateOfBirth }),
        ...(gender !== undefined && { gender }),
        ...(address !== undefined && { address }),
        ...(bloodGroup !== undefined && { bloodGroup }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    // Update student profile if fields provided
    const profileUpdateData: any = {};
    if (guardianName !== undefined) profileUpdateData.guardianName = guardianName;
    if (guardianPhone !== undefined) profileUpdateData.guardianPhone = guardianPhone;
    if (guardianRelation !== undefined) profileUpdateData.guardianRelation = guardianRelation;
    if (studentClass !== undefined) profileUpdateData.class = studentClass;
    if (section !== undefined) profileUpdateData.section = section;
    if (batch !== undefined) profileUpdateData.batch = batch;

    if (Object.keys(profileUpdateData).length > 0) {
      const profile = await db.studentProfile.findUnique({ where: { userId: id } });
      if (profile) {
        await db.studentProfile.update({ where: { userId: id }, data: profileUpdateData });
      }
    }

    const fullUser = await db.user.findUnique({
      where: { id },
      include: { studentProfile: true },
    });

    return success(fullUser);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Student not found');
    return error(err.message || 'Failed to update student');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete students');

    const { id } = await params;
    await db.user.delete({ where: { id, role: 'student' } });

    return success({ message: 'Student deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Student not found');
    return error(err.message || 'Failed to delete student');
  }
}
