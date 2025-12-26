import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const createAppSchema = z.object({
  name: z.string().min(1, 'Tên ứng dụng là bắt buộc'),
});

// GET - Lấy danh sách apps
export async function GET() {
  try {
    const user = await requireAuth();

    const apps = db
      .prepare('SELECT * FROM apps WHERE user_id = ? ORDER BY name ASC')
      .all(user.id) as Array<{
      id: number;
      user_id: number;
      name: string;
      created_at: string;
    }>;

    return NextResponse.json(apps);
  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json({ error: 'Không thể lấy danh sách ứng dụng' }, { status: 500 });
  }
}

// POST - Tạo app mới
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validated = createAppSchema.parse(body);

    // Kiểm tra tên app đã tồn tại
    const existingApp = db
      .prepare('SELECT id FROM apps WHERE user_id = ? AND name = ?')
      .get(user.id, validated.name);

    if (existingApp) {
      return NextResponse.json({ error: 'Ứng dụng đã tồn tại' }, { status: 400 });
    }

    const result = db
      .prepare('INSERT INTO apps (user_id, name) VALUES (?, ?)')
      .run(user.id, validated.name);

    const newApp = db.prepare('SELECT * FROM apps WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(newApp, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating app:', error);
    return NextResponse.json({ error: 'Không thể tạo ứng dụng' }, { status: 500 });
  }
}
