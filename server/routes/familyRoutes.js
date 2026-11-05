import express from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

/**
 * GET /api/family
 * Retrieve family workspace details
 */
router.get('/', (req, res) => {
  try {
    const family = db.prepare(`SELECT id, name, status, created_at, updated_at FROM families WHERE id = ?`).get(req.user.family_id);
    if (!family) {
      return res.status(404).json({ error: 'Family workspace not found.' });
    }

    const members = db.prepare(`
      SELECT id, display_name, email, role, created_at
      FROM users
      WHERE family_id = ?
    `).all(req.user.family_id);

    return res.json({ family, members });
  } catch (err) {
    console.error('Family info error:', err);
    return res.status(500).json({ error: 'Failed to retrieve family details.' });
  }
});

/**
 * GET /api/family/activity
 * Summary of all learners in the family with recent activity status
 */
router.get('/activity', (req, res) => {
  try {
    const activity = db.prepare(`
      SELECT 
        l.id as learner_id,
        l.first_name,
        l.grade,
        l.avatar_code,
        COALESCE(act.state, 'offline') as state,
        act.current_subject_code,
        act.last_active_at,
        s.title as current_subject_title
      FROM learners l
      LEFT JOIN learner_activity_states act ON act.learner_id = l.id
      LEFT JOIN curriculum_subjects s ON act.current_subject_code = s.code
      WHERE l.family_id = ? AND l.is_active = 1
      ORDER BY l.first_name ASC
    `).all(req.user.family_id);

    return res.json({
      activity,
      notice: 'Educational indicator only. ThutoBridge does not treat screen time or speed alone as measures of understanding.'
    });
  } catch (err) {
    console.error('Family activity error:', err);
    return res.status(500).json({ error: 'Failed to retrieve activity.' });
  }
});

/**
 * GET /api/family/audit
 * View security and administrative audit trail
 */
router.get('/audit', (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT a.id, a.action, a.details, a.created_at, u.display_name as performed_by
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.family_id = ?
      ORDER BY a.created_at DESC
      LIMIT 50
    `).all(req.user.family_id);

    return res.json({ logs });
  } catch (err) {
    console.error('Family audit logs error:', err);
    return res.status(500).json({ error: 'Failed to load audit logs.' });
  }
});

export default router;
