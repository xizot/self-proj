import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const createPasswordSchema = z.object({
  app_name: z.string().min(1, 'Tên ứng dụng là bắt buộc'),
  type: z.enum(['password', 'webhook', 'api_key', 'token', 'other']).default('password'),
  username: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
  url: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// GET - Lấy danh sách passwords
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = 'SELECT * FROM passwords WHERE user_id = ?';
    const params: any[] = [user.id];

    if (search) {
      query += ' AND (app_name LIKE ? OR username LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY updated_at DESC';

    const passwords = db.prepare(query).all(...params) as Array<{
      id: number;
      user_id: number;
      app_name: string;
      type: string;
      username: string | null;
      email: string | null;
      password: string;
      url: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    }>;

    return NextResponse.json(passwords);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    return NextResponse.json({ error: 'Không thể lấy danh sách mật khẩu' }, { status: 500 });
  }
}

// POST - Tạo password mới
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validated = createPasswordSchema.parse(body);

    // Kiểm tra trùng tên
    const existing = db
      .prepare('SELECT id FROM passwords WHERE user_id = ? AND app_name = ?')
      .get(user.id, validated.app_name);

    if (existing) {
      return NextResponse.json(
        { error: 'Tên ứng dụng đã tồn tại. Vui lòng chọn tên khác.' },
        { status: 400 }
      );
    }

    const result = db
      .prepare(
        `INSERT INTO passwords (user_id, app_name, type, username, email, password, url, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        user.id,
        validated.app_name,
        validated.type,
        validated.username || null,
        validated.email || null,
        validated.password,
        validated.url || null,
        validated.notes || null
      );

    const newPassword = db
      .prepare('SELECT * FROM passwords WHERE id = ?')
      .get(result.lastInsertRowid);

    return NextResponse.json(newPassword, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating password:', error);
    return NextResponse.json({ error: 'Không thể tạo mật khẩu' }, { status: 500 });
  }
}
