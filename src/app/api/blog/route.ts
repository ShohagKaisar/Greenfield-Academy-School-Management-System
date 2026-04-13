import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error, getQueryParams, unauthorized, badRequest } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request);
    const { category, search, page, limit } = params;

    const where: any = { status: 'published' };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const posts = await db.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const total = posts.length;
    const start = (page - 1) * limit;
    const paginated = posts.slice(start, start + limit);

    return success({
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch blog posts');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const body = await request.json();
    const { title, content, excerpt, image, category, tags, slug } = body;

    if (!title) return badRequest('Title is required');

    const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

    const post = await db.blogPost.create({
      data: {
        title,
        slug: postSlug,
        content: content || null,
        excerpt: excerpt || null,
        image: image || null,
        category: category || 'news',
        tags: tags || null,
        authorId: payload.userId,
      },
    });

    return success(post, 201);
  } catch (err: any) {
    return error(err.message || 'Failed to create blog post');
  }
}
