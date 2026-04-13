import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const notice = await db.notice.findUnique({ where: { id } });
    if (!notice) return notFound('Notice not found');
    return success(notice);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch notice');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { title, content, category, priority, target, image, file, status } = body;

    const notice = await db.notice.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(priority !== undefined && { priority }),
        ...(target !== undefined && { target }),
        ...(image !== undefined && { image }),
        ...(file !== undefined && { file }),
        ...(status !== undefined && { status }),
      },
    });

    return success(notice);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Notice not found');
    return error(err.message || 'Failed to update notice');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can delete notices');

    const { id } = await params;
    await db.notice.delete({ where: { id } });
    return success({ message: 'Notice deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Notice not found');
    return error(err.message || 'Failed to delete notice');
  }
}
