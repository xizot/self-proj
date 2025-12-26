import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const updateUserSchema = z.object({
  email: z.string().email('Email không hợp lệ').optional(),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').optional(),
  name: z.string().optional(),
  role: z.enum(['user', 'admin', 'super-admin']).optional(),
});

// PUT - Cập nhật user (chỉ admin)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireAuth();
    const { id } = await params;
    const userId = parseInt(id);

    // Chỉ admin hoặc super-admin mới được sửa user
    if (currentUser.role !== 'admin' && currentUser.role !== 'super-admin') {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    // Kiểm tra user tồn tại
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as
      | { id: number; email: string; role: string }
      | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
    }

    // Không cho phép sửa tài khoản admin nếu không phải super-admin
    if (user.role === 'super-admin' && currentUser.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Chỉ super-admin mới có thể sửa tài khoản super-admin' },
        { status: 403 }
      );
    }

    // Không cho phép admin thường gán role admin/super-admin
    if (
      validated.role &&
      (validated.role === 'admin' || validated.role === 'super-admin') &&
      currentUser.role !== 'super-admin'
    ) {
      return NextResponse.json(
        { error: 'Chỉ super-admin mới có thể gán role admin' },
        { status: 403 }
      );
    }

    // Kiểm tra email trùng (nếu thay đổi email)
    if (validated.email && validated.email !== user.email) {
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(
        validated.email,
        userId
      );
      if (existingUser) {
        return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 400 });
      }
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];

    if (validated.email) {
      updates.push('email = ?');
      values.push(validated.email);
    }
    if (validated.password) {
      updates.push('password = ?');
      values.push(await hashPassword(validated.password));
    }
    if (validated.name !== undefined) {
      updates.push('name = ?');
      values.push(validated.name || null);
    }
    if (validated.role) {
      updates.push('role = ?');
      values.push(validated.role);
    }

    updates.push('updated_at = datetime("now")');
    values.push(userId);

    if (updates.length > 0) {
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const updatedUser = db
      .prepare('SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?')
      .get(userId);

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Không thể cập nhật người dùng' }, { status: 500 });
  }
}

// DELETE - Xóa user (chỉ super-admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireAuth();
    const { id } = await params;
    const userId = parseInt(id);

    // Chỉ super-admin mới được xóa user
    if (currentUser.role !== 'super-admin') {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    // Không cho phép xóa chính mình
    if (currentUser.id === userId) {
      return NextResponse.json({ error: 'Không thể xóa chính mình' }, { status: 400 });
    }

    // Kiểm tra user tồn tại
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
    }

    // Xóa user
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    return NextResponse.json({ message: 'Đã xóa người dùng thành công' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Không thể xóa người dùng' }, { status: 500 });
  }
}
