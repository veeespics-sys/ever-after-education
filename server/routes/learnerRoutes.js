import express from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { requireAuth, verifyLearnerFamilyOwnership } from '../middleware/auth.js';
import { getSubjectsForGrade } from '../curriculum/capsSubjects.js';

const router = express.Router();

// All learner routes require authentication
router.use(requireAuth);

/**
 * Helper: Retrieve enriched learner record including activity state and active subject count
 */
function getEnrichedLearner(learnerId) {
  return db.prepare(`
    SELECT 
      l.id, 
      l.family_id,
      l.first_name, 
      l.preferred_name, 
      l.grade, 
      l.avatar_code, 
      l.learning_notes, 
      l.created_at, 
      l.updated_at,
      l.is_active,
      COALESCE(act.state, 'offline') as activity_state,
      act.current_subject_code,
      act.last_active_at,
      (
        SELECT COUNT(*) 
        FROM learner_subject_enrolments e 
        WHERE e.learner_id = l.id AND e.status = 'active'
      ) as active_subject_count
    FROM learners l
    LEFT JOIN learner_activity_states act ON act.learner_id = l.id
    WHERE l.id = ?
  `).get(learnerId);
}

/**
 * GET /api/learners
 * List all learners belonging to the authenticated user's family
 */
router.get('/', (req, res) => {
  try {
    const familyId = req.user.family_id;

    const learners = db.prepare(`
      SELECT 
        l.id, 
        l.first_name, 
        l.preferred_name, 
        l.grade, 
        l.avatar_code, 
        l.learning_notes, 
        l.created_at, 
        l.updated_at,
        l.is_active,
        COALESCE(act.state, 'offline') as activity_state,
        act.current_subject_code,
        act.last_active_at,
        (
          SELECT COUNT(*) 
          FROM learner_subject_enrolments e 
          WHERE e.learner_id = l.id AND e.status = 'active'
        ) as active_subject_count
      FROM learners l
      LEFT JOIN learner_activity_states act ON act.learner_id = l.id
      WHERE l.family_id = ? AND l.is_active = 1
      ORDER BY l.first_name ASC
    `).all(familyId);

    return res.json({ learners });
  } catch (err) {
    console.error('List learners error:', err);
    return res.status(500).json({ error: 'Failed to retrieve learners.' });
  }
});

/**
 * POST /api/learners
 * Add a new learner to the authenticated user's family
 */
router.post('/', (req, res) => {
  try {
    const familyId = req.user.family_id;
    const { firstName, preferredName, grade, avatarCode, learningNotes, initialSubjectCodes } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ error: 'First name is required.' });
    }

    if (!grade || !grade.trim()) {
      return res.status(400).json({ error: 'Grade level is required (e.g. Grade 4).' });
    }

    const learnerId = `lrn_${crypto.randomUUID().slice(0, 8)}`;
    const avatar = avatarCode || 'sprout';

    const insertLearnerTx = db.transaction(() => {
      // 1. Insert learner profile
      db.prepare(`
        INSERT INTO learners (id, family_id, first_name, preferred_name, grade, avatar_code, learning_notes, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `).run(
        learnerId,
        familyId,
        firstName.trim(),
        preferredName ? preferredName.trim() : firstName.trim(),
        grade.trim(),
        avatar,
        learningNotes ? learningNotes.trim() : null
      );

      // 2. Initialize activity state
      db.prepare(`
        INSERT INTO learner_activity_states (learner_id, family_id, state, last_active_at)
        VALUES (?, ?, 'offline', datetime('now'))
      `).run(learnerId, familyId);

      // 3. Optional initial subject enrolments
      if (Array.isArray(initialSubjectCodes) && initialSubjectCodes.length > 0) {
        for (const code of initialSubjectCodes) {
          const enrId = `enr_${crypto.randomUUID().slice(0, 8)}`;
          db.prepare(`
            INSERT INTO learner_subject_enrolments (id, learner_id, subject_code, status)
            VALUES (?, ?, ?, 'active')
          `).run(enrId, learnerId, code);

          db.prepare(`
            INSERT INTO learner_enrolment_history (id, learner_id, subject_code, action, new_status, changed_by_user_id, notes)
            VALUES (?, ?, ?, 'enrolled', 'active', ?, 'Initial enrolment at learner profile creation')
          `).run(`hist_${crypto.randomUUID().slice(0, 8)}`, learnerId, code, req.user.id);
        }
      }

      // 4. Audit log
      db.prepare(`
        INSERT INTO audit_logs (id, family_id, user_id, action, details)
        VALUES (?, ?, ?, 'learner_created', ?)
      `).run(
        `aud_${crypto.randomUUID().slice(0, 8)}`,
        familyId,
        req.user.id,
        `Created learner ${firstName.trim()} in ${grade.trim()}`
      );
    });

    insertLearnerTx();

    const created = getEnrichedLearner(learnerId);

    return res.status(201).json({
      message: 'Learner profile created successfully.',
      learner: created
    });
  } catch (err) {
    console.error('Create learner error:', err);
    return res.status(500).json({ error: 'Failed to create learner profile.' });
  }
});

/**
 * GET /api/learners/:id
 * Retrieve a single learner profile with strict family isolation check
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ownership = verifyLearnerFamilyOwnership(id, req.user.family_id);

    if (!ownership.exists) {
      return res.status(404).json({ error: 'Learner profile not found.' });
    }

    if (!ownership.authorized) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to view records belonging to another family.'
      });
    }

    // Retrieve active and historical enrolments
    const enrolments = db.prepare(`
      SELECT 
        e.id, 
        e.subject_code, 
        e.status, 
        e.enrolled_at, 
        e.updated_at,
        s.title as subject_title,
        s.phase as subject_phase,
        s.description as subject_description,
        s.caps_doc_ref,
        s.verification_status
      FROM learner_subject_enrolments e
      JOIN curriculum_subjects s ON e.subject_code = s.code
      WHERE e.learner_id = ?
      ORDER BY e.status ASC, s.title ASC
    `).all(id);

    const history = db.prepare(`
      SELECT h.id, h.subject_code, h.action, h.previous_status, h.new_status, h.timestamp, h.notes, s.title as subject_title
      FROM learner_enrolment_history h
      LEFT JOIN curriculum_subjects s ON h.subject_code = s.code
      WHERE h.learner_id = ?
      ORDER BY h.timestamp DESC
      LIMIT 20
    `).all(id);

    const activity = db.prepare(`
      SELECT state, current_subject_code, last_active_at
      FROM learner_activity_states
      WHERE learner_id = ?
    `).get(id);

    return res.json({
      learner: ownership.learner,
      enrolments,
      history,
      activity: activity || { state: 'offline' }
    });
  } catch (err) {
    console.error('Get learner error:', err);
    return res.status(500).json({ error: 'Failed to load learner details.' });
  }
});

/**
 * PUT /api/learners/:id
 * Update a learner profile (Grade, preferred name, notes)
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ownership = verifyLearnerFamilyOwnership(id, req.user.family_id);

    if (!ownership.exists) {
      return res.status(404).json({ error: 'Learner profile not found.' });
    }

    if (!ownership.authorized) {
      return res.status(403).json({
        error: 'Forbidden: You cannot modify learner records belonging to another family.'
      });
    }

    const { firstName, preferredName, grade, avatarCode, learningNotes } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ error: 'First name is required.' });
    }
    if (!grade || !grade.trim()) {
      return res.status(400).json({ error: 'Grade level is required.' });
    }

    const previousGrade = ownership.learner.grade;
    const gradeChanged = previousGrade !== grade.trim();

    db.prepare(`
      UPDATE learners 
      SET 
        first_name = ?, 
        preferred_name = ?, 
        grade = ?, 
        avatar_code = ?, 
        learning_notes = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      firstName.trim(),
      preferredName ? preferredName.trim() : firstName.trim(),
      grade.trim(),
      avatarCode || ownership.learner.avatar_code,
      learningNotes !== undefined ? learningNotes : ownership.learner.learning_notes,
      id
    );

    // If grade changed, log audit note (historical progress is strictly preserved)
    if (gradeChanged) {
      db.prepare(`
        INSERT INTO audit_logs (id, family_id, user_id, action, details)
        VALUES (?, ?, ?, 'grade_changed', ?)
      `).run(
        `aud_${crypto.randomUUID().slice(0, 8)}`,
        req.user.family_id,
        req.user.id,
        `Changed grade for ${firstName} from ${previousGrade} to ${grade.trim()}`
      );
    }

    const updated = getEnrichedLearner(id);

    return res.json({
      message: 'Learner profile updated successfully.',
      learner: updated,
      gradeChanged
    });
  } catch (err) {
    console.error('Update learner error:', err);
    return res.status(500).json({ error: 'Failed to update learner profile.' });
  }
});

/**
 * DELETE /api/learners/:id
 * Soft-deletes a learner profile to preserve historical records safely
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ownership = verifyLearnerFamilyOwnership(id, req.user.family_id);

    if (!ownership.exists) {
      return res.status(404).json({ error: 'Learner profile not found.' });
    }

    if (!ownership.authorized) {
      return res.status(403).json({
        error: 'Forbidden: You cannot delete learner records belonging to another family.'
      });
    }

    // Soft-deactivate to prevent accidental historical data loss
    db.prepare(`
      UPDATE learners 
      SET is_active = 0, updated_at = datetime('now')
      WHERE id = ?
    `).run(id);

    db.prepare(`
      INSERT INTO audit_logs (id, family_id, user_id, action, details)
      VALUES (?, ?, ?, 'learner_deactivated', ?)
    `).run(
      `aud_${crypto.randomUUID().slice(0, 8)}`,
      req.user.family_id,
      req.user.id,
      `Deactivated learner profile: ${ownership.learner.first_name}`
    );

    return res.json({ message: 'Learner profile successfully deactivated.' });
  } catch (err) {
    console.error('Delete learner error:', err);
    return res.status(500).json({ error: 'Failed to deactivate learner profile.' });
  }
});

/**
 * GET /api/learners/:id/subjects
 * Retrieves active and inactive subject enrolments for this learner
 */
router.get('/:id/subjects', (req, res) => {
  try {
    const { id } = req.params;
    const ownership = verifyLearnerFamilyOwnership(id, req.user.family_id);

    if (!ownership.exists) {
      return res.status(404).json({ error: 'Learner profile not found.' });
    }

    if (!ownership.authorized) {
      return res.status(403).json({
        error: 'Forbidden: You do not have access to subjects for a learner in another family.'
      });
    }

    // Available subjects for this learner's grade
    const availableForGrade = getSubjectsForGrade(ownership.learner.grade);

    // Current enrolments in the database
    const enrolments = db.prepare(`
      SELECT 
        e.id, 
        e.subject_code, 
        e.status, 
        e.enrolled_at, 
        e.updated_at,
        s.title,
        s.phase,
        s.description,
        s.caps_doc_ref,
        s.verification_status,
        s.is_core
      FROM learner_subject_enrolments e
      JOIN curriculum_subjects s ON e.subject_code = s.code
      WHERE e.learner_id = ?
    `).all(id);

    return res.json({
      learner: {
        id: ownership.learner.id,
        firstName: ownership.learner.first_name,
        grade: ownership.learner.grade
      },
      enrolments,
      availableForGrade
    });
  } catch (err) {
    console.error('Get learner subjects error:', err);
    return res.status(500).json({ error: 'Failed to retrieve subject enrolments.' });
  }
});

/**
 * POST /api/learners/:id/subjects
 * Enrols learner in selected subjects (or updates enrolment state)
 */
router.post('/:id/subjects', (req, res) => {
  try {
    const { id } = req.params;
    const ownership = verifyLearnerFamilyOwnership(id, req.user.family_id);

    if (!ownership.exists) {
      return res.status(404).json({ error: 'Learner profile not found.' });
    }

    if (!ownership.authorized) {
      return res.status(403).json({
        error: 'Forbidden: You cannot modify enrolments for another family.'
      });
    }

    const { subjectCodes } = req.body;
    if (!Array.isArray(subjectCodes) || subjectCodes.length === 0) {
      return res.status(400).json({ error: 'subjectCodes must be a non-empty array of CAPS subject codes.' });
    }

    const enrolTx = db.transaction(() => {
      for (const code of subjectCodes) {
        // Verify subject exists in catalogue
        const subject = db.prepare(`SELECT code, title FROM curriculum_subjects WHERE code = ?`).get(code);
        if (!subject) continue;

        const existing = db.prepare(`
          SELECT id, status FROM learner_subject_enrolments WHERE learner_id = ? AND subject_code = ?
        `).get(id, code);

        if (existing) {
          if (existing.status !== 'active') {
            db.prepare(`
              UPDATE learner_subject_enrolments 
              SET status = 'active', updated_at = datetime('now')
              WHERE id = ?
            `).run(existing.id);

            db.prepare(`
              INSERT INTO learner_enrolment_history (id, learner_id, subject_code, action, previous_status, new_status, changed_by_user_id, notes)
              VALUES (?, ?, ?, 'status_changed', ?, 'active', ?, 'Re-activated subject enrolment')
            `).run(`hist_${crypto.randomUUID().slice(0, 8)}`, id, code, existing.status, req.user.id);
          }
        } else {
          const enrId = `enr_${crypto.randomUUID().slice(0, 8)}`;
          db.prepare(`
            INSERT INTO learner_subject_enrolments (id, learner_id, subject_code, status)
            VALUES (?, ?, ?, 'active')
          `).run(enrId, id, code);

          db.prepare(`
            INSERT INTO learner_enrolment_history (id, learner_id, subject_code, action, new_status, changed_by_user_id, notes)
            VALUES (?, ?, ?, 'enrolled', 'active', ?, 'New subject enrolment')
          `).run(`hist_${crypto.randomUUID().slice(0, 8)}`, id, code, req.user.id);
        }
      }
    });

    enrolTx();

    const updatedEnrolments = db.prepare(`
      SELECT e.id, e.subject_code, e.status, s.title, s.phase, s.description
      FROM learner_subject_enrolments e
      JOIN curriculum_subjects s ON e.subject_code = s.code
      WHERE e.learner_id = ? AND e.status = 'active'
    `).all(id);

    return res.json({
      message: 'Subject enrolments updated successfully.',
      activeEnrolments: updatedEnrolments
    });
  } catch (err) {
    console.error('Enrol subjects error:', err);
    return res.status(500).json({ error: 'Failed to update subject enrolments.' });
  }
});

/**
 * PUT /api/learners/:id/subjects/:subjectCode
 * Updates enrolment status (e.g. 'inactive', 'paused', 'active')
 * CRITICAL RULE: Removing a subject from current enrolment must NOT silently erase historical records!
 */
router.put('/:id/subjects/:subjectCode', (req, res) => {
  try {
    const { id, subjectCode } = req.params;
    const { status, reason } = req.body;

    const ownership = verifyLearnerFamilyOwnership(id, req.user.family_id);

    if (!ownership.exists) {
      return res.status(404).json({ error: 'Learner profile not found.' });
    }

    if (!ownership.authorized) {
      return res.status(403).json({
        error: 'Forbidden: You cannot modify subject enrolments for another family.'
      });
    }

    const validStatuses = ['active', 'inactive', 'paused', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existing = db.prepare(`
      SELECT id, status FROM learner_subject_enrolments WHERE learner_id = ? AND subject_code = ?
    `).get(id, subjectCode);

    if (!existing) {
      return res.status(404).json({ error: 'Enrolment record not found for this subject.' });
    }

    const prevStatus = existing.status;

    const updateTx = db.transaction(() => {
      // 1. Update enrolment status without dropping record
      db.prepare(`
        UPDATE learner_subject_enrolments 
        SET status = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(status, existing.id);

      // 2. Add historical audit record to guarantee zero silent loss
      db.prepare(`
        INSERT INTO learner_enrolment_history (id, learner_id, subject_code, action, previous_status, new_status, changed_by_user_id, notes)
        VALUES (?, ?, ?, 'status_changed', ?, ?, ?, ?)
      `).run(
        `hist_${crypto.randomUUID().slice(0, 8)}`,
        id,
        subjectCode,
        prevStatus,
        status,
        req.user.id,
        reason || `Status updated from ${prevStatus} to ${status}`
      );
    });

    updateTx();

    return res.json({
      message: `Enrolment status updated to ${status}. Historical learning records remain preserved.`,
      subjectCode,
      previousStatus: prevStatus,
      newStatus: status
    });
  } catch (err) {
    console.error('Update subject status error:', err);
    return res.status(500).json({ error: 'Failed to update subject status.' });
  }
});

/**
 * POST /api/learners/:id/activity-ping
 * Record educational activity state (online, lesson working, etc.)
 */
router.post('/:id/activity-ping', (req, res) => {
  try {
    const { id } = req.params;
    const { state, subjectCode } = req.body;
    const ownership = verifyLearnerFamilyOwnership(id, req.user.family_id);

    if (!ownership.authorized) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const validStates = ['offline', 'online', 'recently_active', 'working_on_lesson', 'lesson_completed'];
    const chosenState = validStates.includes(state) ? state : 'online';

    db.prepare(`
      INSERT OR REPLACE INTO learner_activity_states (learner_id, family_id, state, current_subject_code, last_active_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(id, req.user.family_id, chosenState, subjectCode || null);

    return res.json({ success: true, state: chosenState });
  } catch (err) {
    console.error('Activity ping error:', err);
    return res.status(500).json({ error: 'Failed to record activity ping.' });
  }
});

export default router;
