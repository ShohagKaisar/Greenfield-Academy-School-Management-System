import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();

    const { id } = await params;

    const notification = await db.notification.findUnique({ where: { id } });
    if (!notification) return notFound('Notification not found');
    if (notification.userId !== payload.userId) return unauthorized('Cannot access this notification');

    const updated = await db.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return success(updated);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Notification not found');
    return error(err.message || 'Failed to mark notification as read');
  }
}
