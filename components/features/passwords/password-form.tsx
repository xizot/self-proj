'use client';

import { Password } from '@/types/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'shared-ui';
import {
  Combobox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared-ui/client';
import { z } from 'zod';

const createPasswordFormSchema = (existingNames: string[] = []) =>
  z.object({
    app_name: z
      .string()
      .min(1, 'Tên ứng dụng là bắt buộc')
      .refine(
        (name) => !existingNames.includes(name),
        'Tên ứng dụng đã tồn tại. Vui lòng chọn tên khác.'
      ),
    type: z.enum(['password', 'webhook', 'api_key', 'token', 'other']).optional(),
    username: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
    url: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  });

type PasswordFormValues = z.infer<ReturnType<typeof createPasswordFormSchema>>;

interface PasswordFormProps {
  onSuccess?: () => void;
  editingPassword?: Password | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordForm({
  onSuccess,
  editingPassword,
  open,
  onOpenChange,
}: PasswordFormProps) {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAppName, setSelectedAppName] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string>('');

  const existingAppNames = passwords
    .map((p) => p.app_name)
    .filter((name, index, self) => self.indexOf(name) === index);

  const formSchema = createPasswordFormSchema(
    editingPassword ? [] : existingAppNames // Không check trùng khi edit
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      app_name: '',
      type: 'password',
      username: '',
      email: '',
      password: '',
      url: '',
      notes: '',
    },
  });

  const fetchPasswords = async () => {
    try {
      const res = await fetch('/api/passwords');
      const data = await res.json();
      setPasswords(data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  useEffect(() => {
    if (!open) return;

    if (editingPassword) {
      reset({
        app_name: editingPassword.app_name,
        type: editingPassword.type || 'password',
        username: editingPassword.username || '',
        email: editingPassword.email || '',
        password: editingPassword.password,
        url: editingPassword.url || '',
        notes: editingPassword.notes || '',
      });
      setSelectedAppName(editingPassword.app_name);
      setIsCreatingNew(false);
    } else {
      reset({
        app_name: '',
        type: 'password',
        username: '',
        email: '',
        password: '',
        url: '',
        notes: '',
      });
      setSelectedAppName('');
      setIsCreatingNew(false);
      setDuplicateWarning('');
    }
  }, [editingPassword, open, reset]);

  const onSubmit = async (values: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingPassword ? `/api/passwords/${editingPassword.id}` : '/api/passwords';
      const method = editingPassword ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          username: values.username || null,
          email: values.email || null,
          url: values.url || null,
          notes: values.notes || null,
        }),
      });

      if (res.ok) {
        await fetchPasswords();
        onSuccess?.();
        onOpenChange(false);
      } else {
        const data = await res.json();
        alert(data.error || 'Không thể lưu mật khẩu');
      }
    } catch (error) {
      console.error('Error saving password:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppNameChange = (value: string) => {
    setSelectedAppName(value);
    if (value === '__create_new__') {
      setIsCreatingNew(true);
      setValue('app_name', '');
      setDuplicateWarning('');
    } else {
      // Khi chọn tên đã có, hiển thị cảnh báo và reset về "Tạo mới"
      setDuplicateWarning(`"${value}" đã tồn tại. Vui lòng nhập tên khác.`);
      setSelectedAppName('');
      setIsCreatingNew(true);
      setValue('app_name', '');
    }
  };

  const appNameOptions = [
    { id: '__create_new__', name: '+ Tạo mới' },
    ...existingAppNames.map((name) => ({ id: name, name })),
  ];

  const currentType = watch('type');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Mật khẩu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPassword ? 'Chỉnh sửa Mật khẩu' : 'Thêm Mật khẩu mới'}</DialogTitle>
          <DialogDescription>
            {editingPassword
              ? 'Cập nhật thông tin mật khẩu'
              : 'Lưu trữ mật khẩu của ứng dụng hoặc website'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* App Name */}
          <div className="space-y-2">
            <label htmlFor="app_name" className="text-sm font-medium">
              Tên ứng dụng <span className="text-red-500">*</span>
            </label>
            {editingPassword ? (
              <Controller
                name="app_name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="app_name"
                    {...field}
                    placeholder="Nhập tên ứng dụng"
                    disabled={isSubmitting}
                  />
                )}
              />
            ) : (
              <>
                <Combobox
                  options={appNameOptions}
                  value={selectedAppName}
                  onChange={handleAppNameChange}
                  placeholder="Chọn hoặc tạo tên ứng dụng..."
                  searchPlaceholder="Tìm kiếm tên ứng dụng..."
                  disabled={isSubmitting}
                />
                {isCreatingNew && (
                  <Controller
                    name="app_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="app_name"
                        {...field}
                        placeholder="Nhập tên ứng dụng mới"
                        disabled={isSubmitting}
                        className="mt-2"
                        onChange={(e) => {
                          field.onChange(e);
                          if (duplicateWarning) {
                            setDuplicateWarning('');
                          }
                        }}
                      />
                    )}
                  />
                )}
                {duplicateWarning && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">
                    {duplicateWarning}
                  </p>
                )}
              </>
            )}
            {errors.app_name && (
              <p className="text-sm text-destructive">{errors.app_name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Loại <span className="text-red-500">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || 'password'}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="password">Password</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="api_key">API Key</SelectItem>
                    <SelectItem value="token">Token</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              {currentType === 'webhook' || currentType === 'api_key' ? 'Tên' : 'Username'}
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  id="username"
                  {...field}
                  value={field.value || ''}
                  placeholder="Tên đăng nhập"
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          {/* Password/Token/Key */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {currentType === 'webhook'
                ? 'Webhook URL'
                : currentType === 'api_key'
                  ? 'API Key'
                  : currentType === 'token'
                    ? 'Token'
                    : 'Mật khẩu'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    placeholder="Nhập mật khẩu"
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Email */}
          {(currentType === 'password' || currentType === 'api_key' || currentType === 'token') && (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email (tùy chọn)
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    {...field}
                    value={field.value || ''}
                    placeholder="Email đăng nhập"
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          )}

          {/* URL */}
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              URL (tùy chọn)
            </label>
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <Input
                  id="url"
                  type="url"
                  {...field}
                  value={field.value || ''}
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Ghi chú (tùy chọn)
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input
                  id="notes"
                  {...field}
                  value={field.value || ''}
                  placeholder="Ghi chú thêm..."
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
