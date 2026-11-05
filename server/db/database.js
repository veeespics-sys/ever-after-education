import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const DB_PATH = process.env.NODE_ENV === 'test'
  ? path.join(DB_DIR, 'thuto_test.db')
  : path.join(DB_DIR, 'thuto_dev.db');

export const db = new Database(DB_PATH, {
  // verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

console.log(`[Database] Active database: ${path.basename(DB_PATH)} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);

// Enforce foreign key constraints and WAL mode for high reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  const schemaSQL = `
    -- Families table (Isolation boundary)
    CREATE TABLE IF NOT EXISTS families (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'archived'))
    );

    -- Users table (Parents, Tutors, Admins, Learners)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      family_id TEXT NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('parent', 'tutor', 'admin', 'learner')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
    );

    -- Learners table (Child profiles)
    -- Minimal demographic collection per POPIA guidelines (no full birthdates or location)
    CREATE TABLE IF NOT EXISTS learners (
      id TEXT PRIMARY KEY,
      family_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      preferred_name TEXT,
      grade TEXT NOT NULL,
      avatar_code TEXT DEFAULT 'sprout',
      learning_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1)),
      FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
    );

    -- CAPS Subjects catalogue (Decoupled curriculum metadata)
    CREATE TABLE IF NOT EXISTS curriculum_subjects (
      code TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      phase TEXT NOT NULL,
      min_grade INTEGER NOT NULL,
      max_grade INTEGER NOT NULL,
      description TEXT NOT NULL,
      caps_doc_ref TEXT NOT NULL,
      is_core INTEGER DEFAULT 0,
      verification_status TEXT DEFAULT 'verified' CHECK(verification_status IN ('verified', 'in_review', 'provisional')),
      review_date TEXT
    );

    -- Learner Subject Enrolments (Active and past enrolments)
    CREATE TABLE IF NOT EXISTS learner_subject_enrolments (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      subject_code TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'paused', 'completed')),
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_code) REFERENCES curriculum_subjects(code),
      UNIQUE(learner_id, subject_code)
    );

    -- Enrolment History / Audit Log: Prevents silent erasure of progress records!
    CREATE TABLE IF NOT EXISTS learner_enrolment_history (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      subject_code TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('enrolled', 'unenrolled', 'status_changed')),
      previous_status TEXT,
      new_status TEXT,
      changed_by_user_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
    );

    -- Family Audit Logs: Tracks significant security and administrative events
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      family_id TEXT NOT NULL,
      user_id TEXT,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
    );

    -- Learner Activity Pings: Records educational engagement states (Not surveillance!)
    CREATE TABLE IF NOT EXISTS learner_activity_states (
      learner_id TEXT PRIMARY KEY,
      family_id TEXT NOT NULL,
      state TEXT NOT NULL CHECK(state IN ('offline', 'online', 'recently_active', 'working_on_lesson', 'lesson_completed')),
      current_subject_code TEXT,
      last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
      FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
    );

    -- Phase 2: Learner Invitations (Cryptographic SHA-256 token hashes, single-use, family-isolated)
    CREATE TABLE IF NOT EXISTS learner_invitations (
      id TEXT PRIMARY KEY,
      family_id TEXT NOT NULL,
      learner_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'expired', 'revoked')),
      expires_at DATETIME NOT NULL,
      created_by_user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      accepted_at DATETIME,
      revoked_at DATETIME,
      FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
      FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Phase 2: Learner Authentication Credentials (bcrypt hashed PIN, rate-limited lockout protection)
    CREATE TABLE IF NOT EXISTS learner_auth_credentials (
      learner_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      pin_hash TEXT NOT NULL,
      failed_attempts INTEGER DEFAULT 0,
      locked_until DATETIME,
      last_login_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  db.exec(schemaSQL);

  // Non-destructive column check: ensure user_id exists on learners table
  const learnerCols = db.prepare(`PRAGMA table_info(learners)`).all().map(c => c.name);
  if (!learnerCols.includes('user_id')) {
    db.exec(`ALTER TABLE learners ADD COLUMN user_id TEXT REFERENCES users(id)`);
  }
}
