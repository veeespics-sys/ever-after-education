import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { generateToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new parent and create an isolated family record.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName, familyName } = req.body;

    if (!email || !password || !displayName || !familyName) {
      return res.status(400).json({
        error: 'All fields (email, password, displayName, familyName) are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long for account security.'
      });
    }

    // Check for existing user
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({
        error: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    const familyId = `fam_${crypto.randomUUID().slice(0, 8)}`;
    const userId = `usr_${crypto.randomUUID().slice(0, 8)}`;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const createTransaction = db.transaction(() => {
      // Create Family
      db.prepare(`
        INSERT INTO families (id, name, status)
        VALUES (?, ?, 'active')
      `).run(familyId, familyName.trim());

      // Create Parent User
      db.prepare(`
        INSERT INTO users (id, family_id, email, password_hash, display_name, role)
        VALUES (?, ?, ?, ?, ?, 'parent')
      `).run(userId, familyId, email.toLowerCase().trim(), passwordHash, displayName.trim());

      // Log initial family creation audit event
      db.prepare(`
        INSERT INTO audit_logs (id, family_id, user_id, action, details)
        VALUES (?, ?, ?, 'family_registered', ?)
      `).run(`aud_${crypto.randomUUID().slice(0, 8)}`, familyId, userId, `Created family: ${familyName.trim()}`);
    });

    createTransaction();

    const newUser = {
      id: userId,
      family_id: familyId,
      email: email.toLowerCase().trim(),
      display_name: displayName.trim(),
      role: 'parent'
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Account and family workspace successfully created.',
      token,
      user: newUser,
      family: { id: familyId, name: familyName.trim() }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

/**
 * POST /api/auth/login
 * Standard email/password authentication
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare(`
      SELECT u.id, u.family_id, u.email, u.password_hash, u.display_name, u.role, f.name as family_name, f.status as family_status
      FROM users u
      JOIN families f ON u.family_id = f.id
      WHERE u.email = ?
    `).get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.family_status !== 'active') {
      return res.status(403).json({ error: 'This family account has been suspended or archived.' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({
      id: user.id,
      family_id: user.family_id,
      role: user.role,
      display_name: user.display_name,
      email: user.email
    });

    return res.json({
      token,
      user: {
        id: user.id,
        family_id: user.family_id,
        email: user.email,
        display_name: user.display_name,
        role: user.role
      },
      family: {
        id: user.family_id,
        name: user.family_name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to authenticate. Please try again.' });
  }
});

/**
 * POST /api/auth/learner-login
 * Learner authentication using Learner ID + secret PIN with server-side rate limiting and lockouts
 */
router.post('/learner-login', async (req, res) => {
  try {
    const { learnerId, pin } = req.body;

    if (!learnerId || !pin) {
      return res.status(400).json({ error: 'Learner profile and PIN are required.' });
    }

    const cleanPin = String(pin).trim();
    if (!/^\d{4,6}$/.test(cleanPin)) {
      return res.status(400).json({ error: 'PIN must be between 4 and 6 numeric digits.' });
    }

    const creds = db.prepare(`
      SELECT 
        c.learner_id, c.user_id, c.pin_hash, c.failed_attempts, c.locked_until,
        l.first_name, l.preferred_name, l.grade, l.avatar_code, l.family_id,
        f.name as family_name, f.status as family_status,
        u.id as user_id, u.display_name, u.role
      FROM learner_auth_credentials c
      JOIN learners l ON c.learner_id = l.id
      JOIN families f ON l.family_id = f.id
      JOIN users u ON c.user_id = u.id
      WHERE c.learner_id = ?
    `).get(learnerId);

    if (!creds) {
      return res.status(401).json({
        error: 'This learner profile does not have an active PIN. Please ask your parent or tutor for an invitation link.'
      });
    }

    if (creds.family_status !== 'active') {
      return res.status(403).json({ error: 'This family account has been suspended or archived.' });
    }

    // Check rate-limiting lockout
    if (creds.locked_until && new Date(creds.locked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(creds.locked_until) - new Date()) / 60000);
      return res.status(429).json({
        error: `Account temporarily locked due to too many failed attempts. Please wait ${minutesLeft} minute(s) before trying again.`,
        locked: true,
        minutesLeft
      });
    }

    const match = bcrypt.compareSync(cleanPin, creds.pin_hash);

    if (!match) {
      const nextAttempts = (creds.failed_attempts || 0) + 1;
      if (nextAttempts >= 5) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        db.prepare(`
          UPDATE learner_auth_credentials 
          SET failed_attempts = ?, locked_until = ?, updated_at = datetime('now')
          WHERE learner_id = ?
        `).run(nextAttempts, lockUntil, learnerId);

        return res.status(429).json({
          error: 'Too many incorrect attempts. Your learning account is temporarily locked for 15 minutes to protect your privacy.',
          locked: true,
          minutesLeft: 15
        });
      } else {
        db.prepare(`
          UPDATE learner_auth_credentials 
          SET failed_attempts = ?, updated_at = datetime('now')
          WHERE learner_id = ?
        `).run(nextAttempts, learnerId);

        const remaining = 5 - nextAttempts;
        return res.status(401).json({
          error: `Incorrect PIN. ${remaining} attempt(s) remaining before temporary lockout.`,
          remainingAttempts: remaining
        });
      }
    }

    // Successful authentication: reset failed attempts
    db.prepare(`
      UPDATE learner_auth_credentials 
      SET failed_attempts = 0, locked_until = NULL, last_login_at = datetime('now'), updated_at = datetime('now')
      WHERE learner_id = ?
    `).run(learnerId);

    // Update activity state
    db.prepare(`
      INSERT OR REPLACE INTO learner_activity_states (learner_id, family_id, state, last_active_at)
      VALUES (?, ?, 'online', datetime('now'))
    `).run(learnerId, creds.family_id);

    const learnerUser = {
      id: creds.user_id,
      family_id: creds.family_id,
      role: 'learner',
      learner_id: creds.learner_id,
      display_name: creds.preferred_name || creds.first_name,
      email: null
    };

    const token = generateToken(learnerUser);

    return res.json({
      token,
      user: learnerUser,
      learner: {
        id: creds.learner_id,
        firstName: creds.first_name,
        preferredName: creds.preferred_name,
        grade: creds.grade,
        avatarCode: creds.avatar_code
      },
      family: {
        id: creds.family_id,
        name: creds.family_name
      }
    });
  } catch (err) {
    console.error('Learner login error:', err);
    return res.status(500).json({ error: 'Failed to authenticate learner.' });
  }
});

/**
 * GET /api/auth/family-learners/:familyId
 * Public helper to display eligible learners for a family device login selector
 */
router.get('/family-learners/:familyId', (req, res) => {
  try {
    const { familyId } = req.params;
    const learners = db.prepare(`
      SELECT 
        l.id, 
        l.first_name, 
        l.preferred_name, 
        l.grade, 
        l.avatar_code,
        CASE WHEN c.pin_hash IS NOT NULL THEN 1 ELSE 0 END as has_pin
      FROM learners l
      LEFT JOIN learner_auth_credentials c ON c.learner_id = l.id
      WHERE l.family_id = ? AND l.is_active = 1
      ORDER BY l.first_name ASC
    `).all(familyId);

    return res.json({ learners });
  } catch (err) {
    console.error('Get family learners error:', err);
    return res.status(500).json({ error: 'Failed to retrieve learners.' });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current authenticated user session, family info, and learners
 */
router.get('/me', requireAuth, (req, res) => {
  try {
    const family = db.prepare(`SELECT id, name, status, created_at FROM families WHERE id = ?`).get(req.user.family_id);
    
    const learners = db.prepare(`
      SELECT id, first_name, preferred_name, grade, avatar_code, learning_notes, created_at, is_active
      FROM learners
      WHERE family_id = ? AND is_active = 1
      ORDER BY first_name ASC
    `).all(req.user.family_id);

    return res.json({
      user: req.user,
      family,
      learners
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ error: 'Failed to load profile.' });
  }
});

/**
 * POST /api/auth/demo-switch
 * Switch easily between test families during development/demonstration testing.
 * Targets either 'molefe' or 'vandermerwe'.
 */
router.post('/demo-switch', (req, res) => {
  try {
    const { targetFamilyKey } = req.body;
    let email = 'thabo@molefe.co.za';
    if (targetFamilyKey === 'vandermerwe') {
      email = 'annelize@vandermerwe.co.za';
    }

    const user = db.prepare(`
      SELECT u.id, u.family_id, u.email, u.display_name, u.role, f.name as family_name
      FROM users u
      JOIN families f ON u.family_id = f.id
      WHERE u.email = ?
    `).get(email);

    if (!user) {
      return res.status(404).json({ error: 'Demo account not found. Please run seed script.' });
    }

    const token = generateToken(user);
    const learners = db.prepare(`
      SELECT id, first_name, preferred_name, grade, avatar_code, learning_notes, is_active
      FROM learners
      WHERE family_id = ? AND is_active = 1
      ORDER BY first_name ASC
    `).all(user.family_id);

    return res.json({
      token,
      user: {
        id: user.id,
        family_id: user.family_id,
        email: user.email,
        display_name: user.display_name,
        role: user.role
      },
      family: {
        id: user.family_id,
        name: user.family_name
      },
      learners
    });
  } catch (err) {
    console.error('Demo switch error:', err);
    return res.status(500).json({ error: 'Failed to switch demo account.' });
  }
});

export default router;
