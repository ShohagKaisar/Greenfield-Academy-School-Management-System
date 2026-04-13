import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, badRequest, error } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');

    const where: any = {
      OR: [
        { senderId: payload.userId },
        { receiverId: payload.userId },
      ],
    };

    // Filter conversation with specific user
    if (otherUserId) {
      where.AND = [
        {
          OR: [
            { senderId: otherUserId },
            { receiverId: otherUserId },
          ],
        },
      ];
    }

    const messages = await db.message.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, email: true, avatar: true } },
        receiver: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return success(messages);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch messages');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) return badRequest('Receiver ID and content are required');

    const message = await db.message.create({
      data: {
        senderId: payload.userId,
        receiverId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    return success(message, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to send message');
  }
}
