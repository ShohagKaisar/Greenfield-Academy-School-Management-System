import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, notFound, error } from '@/lib/api-helper';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (!['admin', 'teacher'].includes(payload.role)) return unauthorized();

    const { id } = await params;
    await db.galleryItem.delete({ where: { id } });
    return success({ message: 'Gallery item deleted successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound('Gallery item not found');
    return error(err.message || 'Failed to delete gallery item');
  }
}
