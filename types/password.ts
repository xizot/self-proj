export type PasswordType = 'password' | 'webhook' | 'api_key' | 'token' | 'other';

export interface Password {
  id: number;
  user_id: number;
  app_name: string;
  type: PasswordType;
  username: string | null;
  email: string | null;
  password: string;
  url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface App {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
}

export interface PasswordFormData {
  app_name: string;
  type: PasswordType;
  username?: string | null;
  email?: string | null;
  password: string;
  url?: string | null;
  notes?: string | null;
}
