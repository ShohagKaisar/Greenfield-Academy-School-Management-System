import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, success, unauthorized, error } from '@/lib/api-helper';

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return success(settingsMap);
  } catch (err: any) {
    return error(err.message || 'Failed to fetch settings');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return unauthorized();
    if (payload.role !== 'admin') return unauthorized('Only admin can update settings');

    const body = await request.json();
    const results = [];

    for (const [key, value] of Object.entries(body)) {
      const setting = await db.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
      results.push(setting);
    }

    return success(results);
  } catch (err: any) {
    return error(err.message || 'Failed to update settings');
  }
}
