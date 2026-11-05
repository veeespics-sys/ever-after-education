import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { requireAuth, requireRole, verifyLearnerFamilyOwnership, generateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/invitations
 * Create a secure, single-use invitation for a learner in the authenticated user's family
 * Role: parent or tutor
 */
router.post('/', requireAuth, requireRole('parent', 'tutor'), (req, res) => {
  try {
    const { learnerId, expiresInDays = 7 } = req.body;

    if (!learnerId) {
      return res.status(400).json({ error: 'learnerId is required.' });
    }

    const ownership = verifyLearnerFamilyOwnership(learnerId, req.user.family_id);
    if (!ownership.exists) {
      return res.status(404).json({ error: 'Learner profile not found.' });
    }
    if (!ownership.authorized) {
      return res.status(403).json({ error: 'Forbidden: You cannot invite learners belonging to another family.' });
    }

    // Revoke any existing pending invitations for this learner before generating a replacement
    db.prepare(`
      UPDATE learner_invitations 
      SET status = 'revoked', revoked_at = datetime('now')
      WHERE learner_id = ? AND status = 'pending'
    `).run(learnerId);

    // Generate cryptographically secure random token (256 bits entropy)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const days = Math.max(1, Math.min(30, parseInt(expiresInDays, 10) || 7));
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const inviteId = `inv_${crypto.randomUUID().slice(0, 8)}`;

    db.prepare(`
      INSERT INTO learner_invitations (
        id, family_id, learner_id, token_hash, status, expires_at, created_by_user_id
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?)
    `).run(inviteId, req.user.family_id, learnerId, tokenHash, expiresAt, req.user.id);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, family_id, user_id, action, details)
      VALUES (?, ?, ?, 'invitation_created', ?)
    `).run(
      `aud_${crypto.randomUUID().slice(0, 8)}`,
      req.user.family_id,
      req.user.id,
      `Generated onboarding invitation for ${ownership.learner.first_name} (Expires in ${days} days)`
    );

    const inviteRecord = db.prepare(`
      SELECT id, family_id, learner_id, status, expires_at, created_at 
      FROM learner_invitations 
      WHERE id = ?
    `).get(inviteId);

    // Return rawToken ONLY in this one response for the parent to copy or show QR code
    return res.status(201).json({
      message: 'Invitation link successfully created.',
      invitation: inviteRecord,
      rawToken,
      learner: {
        id: ownership.learner.id,
        firstName: ownership.learner.first_name,
        grade: ownership.learner.grade
      }
    });
  } catch (err) {
    console.error('Create invitation error:', err);
    return res.status(500).json({ error: 'Failed to create invitation.' });
  }
});

/**
 * GET /api/invitations
 * List all invitations for the authenticated family
 * Role: parent or tutor
 */
router.get('/', requireAuth, requireRole('parent', 'tutor'), (req, res) => {
  try {
    const familyId = req.user.family_id;

    // Auto-expire past-due pending invitations
    db.prepare(`
      UPDATE learner_invitations 
      SET status = 'expired' 
      WHERE family_id = ? AND status = 'pending' AND expires_at < datetime('now')
    `).run(familyId);

    const invitations = db.prepare(`
      SELECT 
        inv.id,
        inv.family_id,
        inv.learner_id,
        inv.status,
        inv.expires_at,
        inv.created_at,
        inv.accepted_at,
        inv.revoked_at,
        l.first_name as learner_name,
        l.preferred_name,
        l.grade,
        l.avatar_code,
        CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END as has_account,
        u.display_name as created_by_name
      FROM learner_invitations inv
      JOIN learners l ON inv.learner_id = l.id
      JOIN users u ON inv.created_by_user_id = u.id
      WHERE inv.family_id = ?
      ORDER BY inv.created_at DESC
    `).all(familyId);

    return res.json({ invitations });
  } catch (err) {
    console.error('List invitations error:', err);
    return res.status(500).json({ error: 'Failed to retrieve invitations.' });
  }
});

/**
 * DELETE /api/invitations/:id
 * Revoke an active invitation
 * Role: parent or tutor
 */
router.delete('/:id', requireAuth, requireRole('parent', 'tutor'), (req, res) => {
  try {
    const { id } = req.params;
    const invite = db.prepare(`
      SELECT * FROM learner_invitations 
      WHERE id = ? AND family_id = ?
    `).get(id, req.user.family_id);

    if (!invite) {
      return res.status(404).json({ error: 'Invitation not found or belongs to another family.' });
    }

    if (invite.status === 'accepted') {
      return res.status(400).json({ error: 'Cannot revoke an invitation that has already been accepted.' });
    }

    if (invite.status === 'revoked') {
      return res.status(400).json({ error: 'Invitation is already revoked.' });
    }

    db.prepare(`
      UPDATE learner_invitations 
      SET status = 'revoked', revoked_at = datetime('now') 
      WHERE id = ?
    `).run(id);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, family_id, user_id, action, details)
      VALUES (?, ?, ?, 'invitation_revoked', ?)
    `).run(
      `aud_${crypto.randomUUID().slice(0, 8)}`,
      req.user.family_id,
      req.user.id,
      `Revoked invitation ${id} for learner ${invite.learner_id}`
    );

    return res.json({ message: 'Invitation successfully revoked.' });
  } catch (err) {
    console.error('Revoke invitation error:', err);
    return res.status(500).json({ error: 'Failed to revoke invitation.' });
  }
});

/**
 * GET /api/invitations/verify/:token
 * Public verification endpoint for a learner opening an invitation link
 */
router.get('/verify/:token', (req, res) => {
  try {
    const rawToken = req.params.token;
    if (!rawToken || typeof rawToken !== 'string') {
      return res.status(400).json({ error: 'Invalid invitation token format.' });
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const invite = db.prepare(`
      SELECT 
        inv.id,
        inv.family_id,
        inv.learner_id,
        inv.status,
        inv.expires_at,
        l.first_name,
        l.preferred_name,
        l.grade,
        l.avatar_code,
        f.name as family_name
      FROM learner_invitations inv
      JOIN learners l ON inv.learner_id = l.id
      JOIN families f ON inv.family_id = f.id
      WHERE inv.token_hash = ?
    `).get(tokenHash);

    if (!invite) {
      return res.status(404).json({ error: 'Invitation not found. Please check your link or ask your parent.' });
    }

    if (invite.status === 'revoked') {
      return res.status(410).json({
        error: 'This invitation has been revoked by your parent or tutor.',
        code: 'REVOKED'
      });
    }

    if (invite.status === 'accepted') {
      return res.status(410).json({
        error: 'This invitation has already been used. Please sign in with your PIN.',
        code: 'ALREADY_USED',
        learnerId: invite.learner_id
      });
    }

    if (new Date(invite.expires_at) < new Date()) {
      db.prepare(`UPDATE learner_invitations SET status = 'expired' WHERE id = ?`).run(invite.id);
      return res.status(410).json({
        error: 'This invitation has expired. Please ask your parent for a new link.',
        code: 'EXPIRED'
      });
    }

    return res.json({
      valid: true,
      learner: {
        id: invite.learner_id,
        firstName: invite.first_name,
        preferredName: invite.preferred_name,
        grade: invite.grade,
        avatarCode: invite.avatar_code
      },
      familyName: invite.family_name,
      expiresAt: invite.expires_at
    });
  } catch (err) {
    console.error('Verify invitation error:', err);
    return res.status(500).json({ error: 'Failed to verify invitation.' });
  }
});

/**
 * POST /api/invitations/accept
 * Redeem an invitation and set up the learner's secure PIN
 */
router.post('/accept', (req, res) => {
  try {
    const { token: rawToken, pin } = req.body;

    if (!rawToken || typeof rawToken !== 'string') {
      return res.status(400).json({ error: 'Invitation token is required.' });
    }

    if (!pin || typeof pin !== 'string' || !/^\d{4,6}$/.test(pin.trim())) {
      return res.status(400).json({ error: 'PIN must be between 4 and 6 numeric digits (e.g. 1234).' });
    }

    const cleanPin = pin.trim();
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const acceptTx = db.transaction(() => {
      const invite = db.prepare(`
        SELECT 
          inv.id,
          inv.family_id,
          inv.learner_id,
          inv.status,
          inv.expires_at,
          l.first_name,
          l.preferred_name,
          l.grade,
          l.avatar_code,
          l.user_id as existing_user_id
        FROM learner_invitations inv
        JOIN learners l ON inv.learner_id = l.id
        WHERE inv.token_hash = ?
      `).get(tokenHash);

      if (!invite) {
        const err = new Error('Invitation not found or invalid.');
        err.statusCode = 404;
        throw err;
      }

      if (invite.status === 'revoked') {
        const err = new Error('This invitation has been revoked by your parent or tutor.');
        err.statusCode = 410;
        throw err;
      }

      if (invite.status === 'accepted') {
        const err = new Error('This invitation has already been used.');
        err.statusCode = 410;
        throw err;
      }

      if (new Date(invite.expires_at) < new Date()) {
        db.prepare(`UPDATE learner_invitations SET status = 'expired' WHERE id = ?`).run(invite.id);
        const err = new Error('This invitation has expired.');
        err.statusCode = 410;
        throw err;
      }

      // Concurrency protection: atomic update ensuring status was 'pending'
      const updateResult = db.prepare(`
        UPDATE learner_invitations 
        SET status = 'accepted', accepted_at = datetime('now')
        WHERE id = ? AND status = 'pending'
      `).run(invite.id);

      if (updateResult.changes === 0) {
        const err = new Error('This invitation was already accepted concurrently.');
        err.statusCode = 409;
        throw err;
      }

      // Hash PIN securely with bcrypt
      const pinSalt = bcrypt.genSaltSync(10);
      const pinHash = bcrypt.hashSync(cleanPin, pinSalt);

      let userId = invite.existing_user_id;

      if (!userId) {
        // Create user account for learner
        userId = `usr_${crypto.randomUUID().slice(0, 8)}`;
        db.prepare(`
          INSERT INTO users (id, family_id, email, password_hash, display_name, role)
          VALUES (?, ?, NULL, ?, ?, 'learner')
        `).run(
          userId,
          invite.family_id,
          pinHash,
          invite.preferred_name || invite.first_name
        );

        db.prepare(`
          UPDATE learners 
          SET user_id = ?, updated_at = datetime('now') 
          WHERE id = ?
        `).run(userId, invite.learner_id);
      } else {
        // Update existing user password_hash
        db.prepare(`
          UPDATE users 
          SET password_hash = ?, updated_at = datetime('now') 
          WHERE id = ?
        `).run(pinHash, userId);
      }

      // Store in learner_auth_credentials with reset attempt count
      db.prepare(`
        INSERT INTO learner_auth_credentials (learner_id, user_id, pin_hash, failed_attempts, locked_until, last_login_at)
        VALUES (?, ?, ?, 0, NULL, datetime('now'))
        ON CONFLICT(learner_id) DO UPDATE SET
          user_id = excluded.user_id,
          pin_hash = excluded.pin_hash,
          failed_attempts = 0,
          locked_until = NULL,
          last_login_at = datetime('now'),
          updated_at = datetime('now')
      `).run(invite.learner_id, userId, pinHash);

      // Audit log
      db.prepare(`
        INSERT INTO audit_logs (id, family_id, user_id, action, details)
        VALUES (?, ?, ?, 'learner_invitation_accepted', ?)
      `).run(
        `aud_${crypto.randomUUID().slice(0, 8)}`,
        invite.family_id,
        userId,
        `Learner ${invite.first_name} activated their account with a secure PIN.`
      );

      return {
        user: {
          id: userId,
          family_id: invite.family_id,
          display_name: invite.preferred_name || invite.first_name,
          role: 'learner',
          learner_id: invite.learner_id
        },
        learner: {
          id: invite.learner_id,
          firstName: invite.first_name,
          preferredName: invite.preferred_name,
          grade: invite.grade,
          avatarCode: invite.avatar_code
        }
      };
    });

    const result = acceptTx();
    const token = generateToken(result.user);

    return res.status(200).json({
      message: `Welcome, ${result.learner.firstName}! Your private learning space is ready.`,
      token,
      user: result.user,
      learner: result.learner
    });
  } catch (err) {
    console.error('Accept invitation error:', err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message || 'Failed to accept invitation.' });
  }
});

export default router;
