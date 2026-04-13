import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await db.event.findUnique({ where: { id } });
    if (!event) return notFound('Event not found');
    return success(event);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch event');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { title, description, date, endDate, location, image, status } = body;

    const event = await db.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: date ? new Date(date) : undefined }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(location !== undefined && { location }),
        ...(image !== undefined && { image }),
        ...(status !== undefined && { status }),
      },
    });

    return success(event);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Event not found');
    return error(err.message || 'Failed to update event');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete events');

    const { id } = await params;
    await db.event.delete({ where: { id } });
    return success({ message: 'Event deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Event not found');
    return error(err.message || 'Failed to delete event');
  }
}
