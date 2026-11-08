import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../db/database.js';
import { 
  getAllLessons, 
  getLessonsByGrade, 
  getLessonById, 
  validateStepAnswer 
} from '../data/lessons/index.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * GET /api/lessons
 * Retrieve math lesson problems, optionally filtered by grade.
 * Query: ?grade=Grade%208
 */
router.get('/', requireAuth, (req, res) => {
  try {
    const { grade } = req.query;
    const problems = grade ? getLessonsByGrade(grade) : getAllLessons();
    
    res.json({
      success: true,
      count: problems.length,
      gradeFilter: grade || 'all',
      problems
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to retrieve lesson problems' });
  }
});

/**
 * GET /api/lessons/:id
 * Retrieve a specific problem by ID.
 */
router.get('/:id', requireAuth, (req, res) => {
  try {
    const problem = getLessonById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json({
      success: true,
      problem
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Failed to retrieve problem details' });
  }
});

/**
 * POST /api/lessons/validate-step
 * Real-time validation of a line-by-line equation step.
 * Body: { problemId, stepNumber, learnerInput, learnerId }
 */
router.post('/validate-step', requireAuth, (req, res) => {
  try {
    const { problemId, stepNumber, learnerInput, learnerId } = req.body;

    if (!problemId || stepNumber === undefined || learnerInput === undefined) {
      return res.status(400).json({ error: 'Missing problemId, stepNumber, or learnerInput' });
    }

    const result = validateStepAnswer(problemId, stepNumber, learnerInput);

    // If learnerId is provided, log step submission for learning telemetry
    if (learnerId) {
      try {
        const submissionId = `sub_${crypto.randomBytes(8).toString('hex')}`;
        db.prepare(`
          INSERT INTO learner_step_submissions (id, learner_id, problem_id, step_number, learner_input, is_correct)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(submissionId, learnerId, problemId, Number(stepNumber), String(learnerInput), result.isCorrect ? 1 : 0);
      } catch (logErr) {
        console.warn('Could not log step submission:', logErr.message);
      }
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error validating step:', error);
    res.status(500).json({ error: 'Failed to validate problem step' });
  }
});

/**
 * POST /api/lessons/submit
 * Complete and log a finished problem with mastery score and hint telemetry.
 * Body: { learner_id, problem_id, hints_used, attempts_count }
 */
router.post('/submit', requireAuth, (req, res) => {
  try {
    const { learner_id, problem_id, hints_used = 0, attempts_count = 1 } = req.body;

    if (!learner_id || !problem_id) {
      return res.status(400).json({ error: 'learner_id and problem_id are required' });
    }

    const problem = getLessonById(problem_id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem definition not found' });
    }

    // Role & family boundary verification
    const learner = db.prepare('SELECT id, family_id FROM learners WHERE id = ?').get(learner_id);
    if (!learner) {
      return res.status(404).json({ error: 'Learner profile not found' });
    }

    if (req.user.role === 'learner') {
      if (req.user.learner_id && req.user.learner_id !== learner_id) {
        return res.status(403).json({ error: 'Learners can only record progress for their own profile' });
      }
    } else if (learner.family_id !== req.user.family_id) {
      return res.status(403).json({ error: 'Cannot record progress for a learner in another family' });
    }

    // Calculate mastery score:
    // Base 100%. Deduct 10% per hint used (3 hints = -30%).
    // Deduct 5% for excessive retry attempts (above 3). Floor at 50% for completed work.
    const hintsPenalty = Math.min(3, Math.max(0, Number(hints_used))) * 10;
    const attemptsPenalty = Math.max(0, Number(attempts_count) - 3) * 5;
    const finalScore = Math.max(50, 100 - hintsPenalty - attemptsPenalty);

    // Status: >= 80% with <= 1 hint is mastered, otherwise completed
    const status = (finalScore >= 80 && Number(hints_used) <= 1) ? 'mastered' : 'completed';

    const existing = db.prepare('SELECT id, score, status FROM learner_lesson_progress WHERE learner_id = ? AND problem_id = ?').get(learner_id, problem_id);

    let progressId;
    if (existing) {
      progressId = existing.id;
      // Retain the higher score if previously completed
      const higherScore = Math.max(existing.score, finalScore);
      const newStatus = (higherScore >= 80) ? 'mastered' : 'completed';

      db.prepare(`
        UPDATE learner_lesson_progress
        SET score = ?, status = ?, hints_used = ?, attempts_count = attempts_count + ?, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(higherScore, newStatus, hints_used, attempts_count, progressId);
    } else {
      progressId = `prog_${crypto.randomBytes(8).toString('hex')}`;
      db.prepare(`
        INSERT INTO learner_lesson_progress (
          id, learner_id, family_id, problem_id, grade, topic, status, score, hints_used, attempts_count, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(
        progressId,
        learner_id,
        learner.family_id,
        problem_id,
        problem.grade,
        problem.topic,
        status,
        finalScore,
        hints_used,
        attempts_count
      );
    }

    // Update real-time learner activity state
    try {
      const subjectCode = problem.grade === 'Grade 10' ? 'CAPS-FET-MATH' : 'CAPS-SP-MATH';
      db.prepare(`
        INSERT INTO learner_activity_states (learner_id, family_id, state, current_subject_code, last_active_at)
        VALUES (?, ?, 'lesson_completed', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(learner_id) DO UPDATE SET
          state = 'lesson_completed',
          current_subject_code = excluded.current_subject_code,
          last_active_at = CURRENT_TIMESTAMP
      `).run(learner_id, learner.family_id, subjectCode);
    } catch (actErr) {
      console.warn('Could not update learner activity state:', actErr.message);
    }

    res.json({
      success: true,
      progress: {
        id: progressId,
        learner_id,
        problem_id,
        grade: problem.grade,
        topic: problem.topic,
        score: finalScore,
        status,
        hints_used
      }
    });
  } catch (error) {
    console.error('Error submitting lesson progress:', error);
    res.status(500).json({ error: 'Failed to record problem completion' });
  }
});

/**
 * GET /api/lessons/progress/:learnerId
 * Fetch learner's completed problems, overall mastery score, and topic breakdown.
 */
router.get('/progress/:learnerId', requireAuth, (req, res) => {
  try {
    const { learnerId } = req.params;

    const learner = db.prepare('SELECT id, family_id, first_name, grade FROM learners WHERE id = ?').get(learnerId);
    if (!learner) {
      return res.status(404).json({ error: 'Learner not found' });
    }

    // Authorization check
    if (req.user.role === 'learner') {
      if (req.user.learner_id && req.user.learner_id !== learnerId) {
        return res.status(403).json({ error: 'Access denied: not your learner profile' });
      }
    } else if (learner.family_id !== req.user.family_id) {
      return res.status(403).json({ error: 'Access denied: learner belongs to another family' });
    }

    const records = db.prepare(`
      SELECT problem_id, grade, topic, status, score, hints_used, attempts_count, completed_at
      FROM learner_lesson_progress
      WHERE learner_id = ?
      ORDER BY completed_at DESC
    `).all(learnerId);

    const totalCompleted = records.length;
    const masteredCount = records.filter(r => r.status === 'mastered').length;
    const avgScore = totalCompleted > 0 
      ? Math.round(records.reduce((acc, r) => acc + r.score, 0) / totalCompleted) 
      : 0;

    res.json({
      success: true,
      learner: {
        id: learner.id,
        name: learner.first_name,
        grade: learner.grade
      },
      summary: {
        totalCompleted,
        masteredCount,
        averageScore: avgScore
      },
      records
    });
  } catch (error) {
    console.error('Error fetching learner progress:', error);
    res.status(500).json({ error: 'Failed to retrieve learner progress' });
  }
});

export default router;
