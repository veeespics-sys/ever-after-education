import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'thuto-bridge-dev-secret-key-2026';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('[SECURITY WARNING] Running in production without a custom JWT_SECRET is insecure.');
}

/**
 * Generate a signed JWT for an authenticated user
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      family_id: user.family_id,
      role: user.role,
      learner_id: user.learner_id || null,
      display_name: user.display_name,
      email: user.email || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Authentication Middleware: Validates Bearer token and attaches user
 */
export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required. No valid authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Double check that user still exists in the database
    const user = db.prepare(`
      SELECT id, family_id, email, display_name, role 
      FROM users 
      WHERE id = ?
    `).get(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User account not found or has been revoked.' });
    }

    // If user is a learner, attach their associated learner_id
    if (user.role === 'learner') {
      const learnerRow = db.prepare('SELECT id FROM learners WHERE user_id = ?').get(user.id);
      user.learner_id = learnerRow ? learnerRow.id : (decoded.learner_id || null);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
}

/**
 * Role-Based Access Control Middleware
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}].`
      });
    }
    next();
  };
}

/**
 * Family Isolation Middleware:
 * Guarantees that users (parents/learners) can only view/mutate records belonging to their family.
 */
export function requireFamilyMatch(paramName = 'familyId') {
  return (req, res, next) => {
    const targetFamilyId = req.params[paramName] || req.body[paramName];
    if (!targetFamilyId) {
      return res.status(400).json({ error: `Family identifier (${paramName}) is required.` });
    }

    if (req.user.role !== 'admin' && req.user.family_id !== targetFamilyId) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to access records belonging to another family.'
      });
    }

    next();
  };
}

/**
 * Verifies that a learner belongs to the requesting user's family
 */
export function verifyLearnerFamilyOwnership(learnerId, familyId) {
  const learner = db.prepare(`
    SELECT id, family_id, first_name, preferred_name, grade, avatar_code, learning_notes, is_active, user_id
    FROM learners 
    WHERE id = ?
  `).get(learnerId);

  if (!learner) {
    return { exists: false, authorized: false, learner: null };
  }

  if (learner.family_id !== familyId) {
    return { exists: true, authorized: false, learner: null };
  }

  return { exists: true, authorized: true, learner };
}
