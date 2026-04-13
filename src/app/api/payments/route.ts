import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { status, type, page, limit } = params;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const payments = await db.payment.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, email: true, avatar: true } },
        admission: { select: { id: true, applicationId: true, studentName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = payments.length;
    const start = (page - 1) * limit;
    const paginated = payments.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch payments');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, admissionId, courseId, amount, method, type, description } = body;

    if (!studentId || !amount) {
      return NextResponse.json({ success: false, message: 'Student ID and amount are required' }, { status: 400 });
    }

    // Generate transaction ID
    const txId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const payment = await db.payment.create({
      data: {
        transactionId: txId,
        studentId,
        admissionId: admissionId || null,
        courseId: courseId || null,
        amount: parseFloat(amount),
        method: method || 'manual',
        type: type || 'admission',
        description: description || null,
        paidAt: new Date(),
        status: 'completed',
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    return success(payment, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create payment');
  }
}
