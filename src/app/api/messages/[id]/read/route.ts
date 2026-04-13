import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();

    const { id } = await params;

    // Only the receiver can mark as read
    const message = await db.message.findUnique({ where: { id } });
    if (!message) return notFound('Message not found');
    if (message.receiverId !== payload.userId) return unauthorized('Cannot mark this message as read');

    const updated = await db.message.update({
      where: { id },
      data: { isRead: true },
    });

    return success(updated);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Message not found');
    return error(err.message || 'Failed to mark message as read');
  }
}
