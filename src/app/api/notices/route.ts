import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { target, category, priority, page, limit } = params;

    const where: any = { status: 'published' };
    if (target) where.target = target;
    if (category) where.category = category;
    if (priority) where.priority = priority;

    const notices = await db.notice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const total = notices.length;
    const start = (page - 1) * limit;
    const paginated = notices.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch notices');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await import('@/lib/api-helper').then(m => m.getUserFromRequest(request));
    if (!payload) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    if (!['admin', 'teacher'].includes(payload.role)) {
      return NextResponse.json({ success: false, message: 'Only admin or teacher can create notices' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, category, priority, target, image, file } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }

    const notice = await db.notice.create({
      data: {
        title,
        content: content || null,
        category: category || 'general',
        priority: priority || 'normal',
        target: target || 'all',
        image: image || null,
        file: file || null,
      },
    });

    return success(notice, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create notice');
  }
}
