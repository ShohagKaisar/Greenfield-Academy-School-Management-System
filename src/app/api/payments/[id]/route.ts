import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, notFound, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, name: true, email: true, avatar: true } },
        admission: { select: { id: true, applicationId: true, studentName: true } },
      },
    });

    if (!payment) return notFound('Payment not found');

    return success(payment);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch payment');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, method, description } = body;

    const payment = await db.payment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(method && { method }),
        ...(description !== undefined && { description }),
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    return success(payment);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Payment not found');
    return error(err.message || 'Failed to update payment');
  }
}
