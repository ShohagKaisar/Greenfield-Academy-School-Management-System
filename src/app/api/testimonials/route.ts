import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams, unauthorized, badRequest } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return success(testimonials);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch testimonials');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const body = await request.json();
    const { name, role, content, rating, avatar } = body;

    if (!name || !content) return badRequest('Name and content are required');

    const testimonial = await db.testimonial.create({
      data: {
        name,
        role: role || null,
        content,
        rating: rating || 5,
        avatar: avatar || null,
      },
    });

    return success(testimonial, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create testimonial');
  }
}
