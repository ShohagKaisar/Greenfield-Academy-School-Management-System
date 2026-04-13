import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, badRequest, error } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    const unreadOnly = searchParams.get('unread') === 'true';

    const where: any = { userId: payload.userId };
    if (type) where.type = type;
    if (unreadOnly) where.isRead = false;

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = await db.notification.count({
      where: { userId: payload.userId, isRead: false },
    });

    return success({ data: notifications, unreadCount });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch notifications');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can create notifications');

    const body = await request.json();
    const { userId, title, content, type, link } = body;

    if (!userId || !title) return badRequest('User ID and title are required');

    const notification = await db.notification.create({
      data: {
        userId,
        title,
        content: content || null,
        type: type || 'info',
        link: link || null,
      },
    });

    return success(notification, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create notification');
  }
}
