import express from 'express';
import { db } from '../db/database.js';
import { CAPS_PHASES, gradeToNumber } from '../curriculum/capsSubjects.js';

const router = express.Router();

/**
 * GET /api/curriculum/phases
 * Return list of CAPS education phases
 */
router.get('/phases', (req, res) => {
  return res.json({ phases: CAPS_PHASES });
});

/**
 * GET /api/curriculum/subjects
 * Retrieve CAPS subjects list with optional filtering by grade or phase
 */
router.get('/subjects', (req, res) => {
  try {
    const { grade, phase } = req.query;

    let query = `
      SELECT code, title, phase, min_grade, max_grade, description, caps_doc_ref, is_core, verification_status, review_date
      FROM curriculum_subjects
    `;
    const params = [];

    if (phase) {
      query += ` WHERE phase = ?`;
      params.push(phase);
    }

    query += ` ORDER BY min_grade ASC, title ASC`;

    let subjects = db.prepare(query).all(...params);

    if (grade) {
      const gradeNum = gradeToNumber(grade);
      subjects = subjects.filter(s => gradeNum >= s.min_grade && gradeNum <= s.max_grade);
    }

    return res.json({ subjects, count: subjects.length });
  } catch (err) {
    console.error('Curriculum subjects error:', err);
    return res.status(500).json({ error: 'Failed to retrieve curriculum subjects.' });
  }
});

/**
 * GET /api/curriculum/subjects/:code
 * Retrieve details and CAPS verification metadata for a specific subject
 */
router.get('/subjects/:code', (req, res) => {
  try {
    const { code } = req.params;
    const subject = db.prepare(`
      SELECT code, title, phase, min_grade, max_grade, description, caps_doc_ref, is_core, verification_status, review_date
      FROM curriculum_subjects
      WHERE code = ?
    `).get(code);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found in CAPS catalogue.' });
    }

    return res.json({ subject });
  } catch (err) {
    console.error('Subject detail error:', err);
    return res.status(500).json({ error: 'Failed to load subject details.' });
  }
});

export default router;
