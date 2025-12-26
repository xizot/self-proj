import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  name: z.string().optional(),
  role: z.enum(['user', 'admin', 'super-admin']).default('user'),
});

// GET - Lấy danh sách users (chỉ admin)
export async function GET() {
  try {
    const currentUser = await requireAuth();

    // Chỉ admin hoặc super-admin mới được xem danh sách users
    if (currentUser.role !== 'admin' && currentUser.role !== 'super-admin') {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const users = db
      .prepare('SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC')
      .all() as Array<{
        id: number;
        email: string;
        name: string | null;
        role: string;
        created_at: string;
        updated_at: string;
      }>;

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Không thể lấy danh sách người dùng' }, { status: 500 });
  }
}

// POST - Tạo user mới (chỉ admin)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();

    // Chỉ admin hoặc super-admin mới được tạo user
    if (currentUser.role !== 'admin' && currentUser.role !== 'super-admin') {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const body = await request.json();
    const validated = createUserSchema.parse(body);

    // Kiểm tra email đã tồn tại
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(validated.email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 400 });
    }

    // Chỉ super-admin mới được tạo admin hoặc super-admin
    if (
      (validated.role === 'admin' || validated.role === 'super-admin') &&
      currentUser.role !== 'super-admin'
    ) {
      return NextResponse.json(
        { error: 'Chỉ super-admin mới có thể tạo tài khoản admin' },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validated.password);

    // Tạo user mới
    const result = db
      .prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)')
      .run(validated.email, hashedPassword, validated.name || null, validated.role);

    const newUser = db
      .prepare('SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?')
      .get(result.lastInsertRowid);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Không thể tạo người dùng' }, { status: 500 });
  }
}
