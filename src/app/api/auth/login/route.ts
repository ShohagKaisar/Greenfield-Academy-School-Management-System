import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { success, badRequest, error } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return badRequest('Email and password are required');
    }

    const user = await db.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        teacherProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      return badRequest('Invalid email or password');
    }

    if (!user.isActive) {
      return badRequest('Account is deactivated');
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return badRequest('Invalid email or password');
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return success({ user: userWithoutPassword, token });
  } catch (err: any) {
    return error(err.message || 'Login failed');
  }
}
