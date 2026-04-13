import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, badRequest, error } from '@/lib/api-helper';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { name, role, content, rating, avatar, isActive } = body;

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(content !== undefined && { content }),
        ...(rating !== undefined && { rating }),
        ...(avatar !== undefined && { avatar }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return success(testimonial);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Testimonial not found');
    return error(err.message || 'Failed to update testimonial');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete testimonials');

    const { id } = await params;
    await db.testimonial.delete({ where: { id } });
    return success({ message: 'Testimonial deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Testimonial not found');
    return error(err.message || 'Failed to delete testimonial');
  }
}
