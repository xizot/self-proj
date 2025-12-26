import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const updatePasswordSchema = z.object({
  app_name: z.string().min(1, 'Tên ứng dụng là bắt buộc').optional(),
  type: z.enum(['password', 'webhook', 'api_key', 'token', 'other']).optional(),
  username: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  password: z.string().min(1, 'Mật khẩu là bắt buộc').optional(),
  url: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// PATCH - Cập nhật password
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const passwordId = parseInt(id);

    // Kiểm tra password tồn tại và thuộc về user
    const password = db
      .prepare('SELECT * FROM passwords WHERE id = ? AND user_id = ?')
      .get(passwordId, user.id) as { id: number } | undefined;

    if (!password) {
      return NextResponse.json({ error: 'Mật khẩu không tồn tại' }, { status: 404 });
    }

    const body = await request.json();
    const validated = updatePasswordSchema.parse(body);

    // Kiểm tra trùng tên nếu app_name thay đổi
    if (validated.app_name !== undefined) {
      const existing = db
        .prepare('SELECT id FROM passwords WHERE user_id = ? AND app_name = ? AND id != ?')
        .get(user.id, validated.app_name, passwordId);

      if (existing) {
        return NextResponse.json(
          { error: 'Tên ứng dụng đã tồn tại. Vui lòng chọn tên khác.' },
          { status: 400 }
        );
      }
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];

    if (validated.app_name !== undefined) {
      updates.push('app_name = ?');
      values.push(validated.app_name);
    }
    if (validated.type !== undefined) {
      updates.push('type = ?');
      values.push(validated.type);
    }
    if (validated.username !== undefined) {
      updates.push('username = ?');
      values.push(validated.username);
    }
    if (validated.email !== undefined) {
      updates.push('email = ?');
      values.push(validated.email);
    }
    if (validated.password !== undefined) {
      updates.push('password = ?');
      values.push(validated.password);
    }
    if (validated.url !== undefined) {
      updates.push('url = ?');
      values.push(validated.url);
    }
    if (validated.notes !== undefined) {
      updates.push('notes = ?');
      values.push(validated.notes);
    }

    updates.push('updated_at = datetime("now")');
    values.push(passwordId, user.id);

    if (updates.length > 0) {
      db.prepare(`UPDATE passwords SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(
        ...values
      );
    }

    const updatedPassword = db
      .prepare('SELECT * FROM passwords WHERE id = ?')
      .get(passwordId);

    return NextResponse.json(updatedPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Không thể cập nhật mật khẩu' }, { status: 500 });
  }
}

// DELETE - Xóa password
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const passwordId = parseInt(id);

    // Kiểm tra password tồn tại và thuộc về user
    const password = db
      .prepare('SELECT * FROM passwords WHERE id = ? AND user_id = ?')
      .get(passwordId, user.id);

    if (!password) {
      return NextResponse.json({ error: 'Mật khẩu không tồn tại' }, { status: 404 });
    }

    // Xóa password
    db.prepare('DELETE FROM passwords WHERE id = ? AND user_id = ?').run(passwordId, user.id);

    return NextResponse.json({ message: 'Đã xóa mật khẩu thành công' });
  } catch (error) {
    console.error('Error deleting password:', error);
    return NextResponse.json({ error: 'Không thể xóa mật khẩu' }, { status: 500 });
  }
}
