import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams, unauthorized, badRequest } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { category, type, page, limit } = params;

    const where: any = {};
    if (category) where.category = category;
    if (type) where.type = type;

    const items = await db.galleryItem.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    const total = items.length;
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch gallery items');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const body = await request.json();
    const { title, caption, type, url, category, order } = body;

    if (!url) return badRequest('URL is required');

    const item = await db.galleryItem.create({
      data: {
        title: title || null,
        caption: caption || null,
        type: type || 'photo',
        url,
        category: category || 'general',
        order: order || 0,
      },
    });

    return success(item, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to add gallery item');
  }
}
