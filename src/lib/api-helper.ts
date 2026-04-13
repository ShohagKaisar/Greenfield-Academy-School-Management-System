import { verifyToken, JWTPayload } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

export function unauthorized() {
  return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export function success(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}

export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    ...Object.fromEntries(searchParams.entries()),
  };
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, total, page, limit, totalPages };
}
