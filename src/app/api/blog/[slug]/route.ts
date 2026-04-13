import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await db.blogPost.findUnique({ where: { slug } });

    if (!post) return notFound('Blog post not found');
    return success(post);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch blog post');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { slug } = await params;
    const body = await request.json();
    const { title, content, excerpt, image, category, tags, status } = body;

    const post = await db.blogPost.update({
      where: { slug },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(image !== undefined && { image }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(status !== undefined && { status }),
      },
    });

    return success(post);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Blog post not found');
    return error(err.message || 'Failed to update blog post');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete blog posts');

    const { slug } = await params;
    await db.blogPost.delete({ where: { slug } });
    return success({ message: 'Blog post deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Blog post not found');
    return error(err.message || 'Failed to delete blog post');
  }
}
