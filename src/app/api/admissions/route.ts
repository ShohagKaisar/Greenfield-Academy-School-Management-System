import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const admissions = await db.admission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: admissions });
  } catch (error) {
    console.error('Error fetching admissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentName, email, phone, dateOfBirth, gender, address,
      guardianName, guardianPhone, previousSchool, previousResult, courseId
    } = body;

    if (!studentName || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Generate application ID
    const count = await db.admission.count();
    const applicationId = `GA-2025-${String(count + 1).padStart(4, '0')}`;

    const admission = await db.admission.create({
      data: {
        applicationId,
        studentName,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        guardianName,
        guardianPhone,
        previousSchool,
        previousResult,
        courseId,
        status: 'pending',
      },
    });

    return NextResponse.json(admission, { status: 201 });
  } catch (error) {
    console.error('Error creating admission:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
