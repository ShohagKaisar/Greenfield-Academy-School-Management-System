import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken, generateStudentId, generateTeacherId } from '@/lib/auth';
import { success, badRequest, error } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, ...profileData } = body;

    if (!name || !email || !password) {
      return badRequest('Name, email, and password are required');
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return badRequest('Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const validRoles = ['admin', 'teacher', 'student', 'parent'];
    const userRole = validRoles.includes(role) ? role : 'student';

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        phone: profileData.phone || null,
        address: profileData.address || null,
        dateOfBirth: profileData.dateOfBirth || null,
        gender: profileData.gender || null,
        bloodGroup: profileData.bloodGroup || null,
        avatar: profileData.avatar || null,
      },
    });

    // Create role-specific profile
    if (userRole === 'student') {
      await db.studentProfile.create({
        data: {
          userId: user.id,
          studentId: generateStudentId(),
          guardianName: profileData.guardianName || null,
          guardianPhone: profileData.guardianPhone || null,
          guardianRelation: profileData.guardianRelation || null,
          previousSchool: profileData.previousSchool || null,
          previousResult: profileData.previousResult || null,
          class: profileData.class || null,
          section: profileData.section || null,
          batch: profileData.batch || null,
        },
      });
    } else if (userRole === 'teacher') {
      await db.teacherProfile.create({
        data: {
          userId: user.id,
          teacherId: generateTeacherId(),
          department: profileData.department || null,
          designation: profileData.designation || null,
          qualification: profileData.qualification || null,
          specialization: profileData.specialization || null,
          salary: profileData.salary || null,
          bio: profileData.bio || null,
          experience: profileData.experience || null,
        },
      });
    } else if (userRole === 'admin') {
      await db.adminProfile.create({
        data: {
          userId: user.id,
          position: profileData.position || null,
        },
      });
    }

    // Fetch full user with profile
    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        studentProfile: true,
        teacherProfile: true,
        adminProfile: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return success({ user: fullUser, token }, 201);
  } catch (err: any) {
    return error(err.message || 'Registration failed');
  }
}
