import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams, badRequest, unauthorized } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { status, page, limit } = params;

    const where: any = {};
    if (status) where.status = status;

    const events = await db.event.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const total = events.length;
    const start = (page - 1) * limit;
    const paginated = events.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch events');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const body = await request.json();
    const { title, description, date, endDate, location, image } = body;

    if (!title || !date) return badRequest('Title and date are required');

    const event = await db.event.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location: location || null,
        image: image || null,
        status: new Date(date) > new Date() ? 'upcoming' : 'completed',
      },
    });

    return success(event, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create event');
  }
}
