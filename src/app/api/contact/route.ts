import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, badRequest, error, getQueryParams, unauthorized } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return badRequest('Name, email, subject, and message are required');
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    });

    return success(contactMessage, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to submit contact form');
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can view contact messages');

    const params = getQueryParams(request);
    const { page, limit } = params;

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const total = messages.length;
    const start = (page - 1) * limit;
    const paginated = messages.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch contact messages');
  }
}
