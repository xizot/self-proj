import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'app.db');

// Ensure data directory exists
try {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
} catch {
  // Directory might already exist
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
`);

// Migration: Add role column if it doesn't exist
try {
  const usersInfo = db.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>;
  const hasRole = usersInfo.some((col) => col.name === 'role');

  if (!hasRole) {
    db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    console.log('Added role column to users table');
  }
} catch (error) {
  console.log('Could not check/add role column:', error);
}

// Initialize admin user if not exists
try {
  const adminUser = db.prepare('SELECT id FROM users WHERE email = ?').get('admin') as
    | { id: number }
    | undefined;

  if (!adminUser) {
    const hashedPassword = bcrypt.hashSync('123456', 10);

    db.prepare(
      `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`
    ).run('admin', hashedPassword, 'Super Admin', 'super-admin');

    console.log('✅ Initialized admin user: admin / 123456');
  }
} catch (error) {
  console.log('Could not initialize admin user:', error);
}

// Create apps table (for password categories)
db.exec(`
  CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, name)
  );

  CREATE INDEX IF NOT EXISTS idx_apps_user_id ON apps(user_id);
`);

// Create passwords table
db.exec(`
  CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    app_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'password',
    username TEXT,
    email TEXT,
    password TEXT NOT NULL,
    url TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_passwords_user_id ON passwords(user_id);
  CREATE INDEX IF NOT EXISTS idx_passwords_app_name ON passwords(app_name);
`);

export default db;
