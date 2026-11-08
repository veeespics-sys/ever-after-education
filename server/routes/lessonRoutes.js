import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../db/database.js';
import { 
  getAllLessons, 
  getLessonsByGrade, 
  getLessonById, 
  validateStepAnswer 
} from '../data/lessons/index.js';
import { generatePrintableResourceData, CAPS_FORMULA_SHEETS } from '../data/lessons/resources.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * Helper: Calculate Level from XP
 */
function getLevelFromXP(xp = 0) {
  if (xp >= 500) return { level: 5, title: 'Master Problem Solver' };
  if (xp >= 300) return { level: 4, title: 'Algebra Specialist' };
  if (xp >= 150) return { level: 3, title: 'Equation Builder' };
  if (xp >= 50) return { level: 2, title: 'Formula Explorer' };
  return { level: 1, title: 'Math Apprentice' };
}

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
 * GET /api/lessons/resources/:grade
 * Print-ready HTML & offline learning bundle: Formula Sheet, Student Worksheet, Teacher Memo
 */
router.get('/resources/:grade', requireAuth, (req, res) => {
  try {
    const { grade } = req.params;
    const problems = getLessonsByGrade(grade);
    const resourceData = generatePrintableResourceData(grade, problems);

    res.json({
      success: true,
      resources: resourceData
    });
  } catch (error) {
    console.error('Error generating printable resources:', error);
    res.status(500).json({ error: 'Failed to generate printable lesson resources' });
  }
});

/**
 * GET /api/lessons/gamification/:learnerId
 * Fetch XP, streak, and unlocked badges for a learner
 */
router.get('/gamification/:learnerId', requireAuth, (req, res) => {
  try {
    const { learnerId } = req.params;

    const learner = db.prepare('SELECT id, family_id FROM learners WHERE id = ?').get(learnerId);
    if (!learner) {
      return res.status(404).json({ error: 'Learner profile not found' });
    }

    if (req.user.role === 'learner' && req.user.learner_id && req.user.learner_id !== learnerId) {
      return res.status(403).json({ error: 'Access denied: not your profile' });
    } else if (req.user.role !== 'learner' && learner.family_id !== req.user.family_id) {
      return res.status(403).json({ error: 'Access denied: learner in another family' });
    }

    let gamification = db.prepare('SELECT * FROM learner_math_gamification WHERE learner_id = ?').get(learnerId);
    if (!gamification) {
      gamification = {
        learner_id: learnerId,
        xp: 0,
        current_streak: 1,
        best_streak: 1,
        last_practice_date: new Date().toISOString().split('T')[0],
        badges_unlocked: '[]'
      };
      db.prepare(`
        INSERT INTO learner_math_gamification (learner_id, xp, current_streak, best_streak, last_practice_date, badges_unlocked)
        VALUES (?, 0, 1, 1, ?, '[]')
      `).run(learnerId, gamification.last_practice_date);
    }

    const badges = JSON.parse(gamification.badges_unlocked || '[]');
    const levelInfo = getLevelFromXP(gamification.xp);

    res.json({
      success: true,
      gamification: {
        learner_id: learnerId,
        xp: gamification.xp,
        current_streak: gamification.current_streak,
        best_streak: gamification.best_streak,
        level: levelInfo.level,
        title: levelInfo.title,
        badges
      }
    });
  } catch (error) {
    console.error('Error fetching gamification state:', error);
    res.status(500).json({ error: 'Failed to retrieve gamification data' });
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
 * Real-time validation of an MCQ option or typed step with diagnostic misconception feedback.
 * Body: { problemId, stepNumber, learnerInput, optionId, learnerId }
 */
router.post('/validate-step', requireAuth, (req, res) => {
  try {
    const { problemId, stepNumber, learnerInput, optionId, learnerId } = req.body;

    const answerToValidate = optionId || learnerInput;
    if (!problemId || stepNumber === undefined || answerToValidate === undefined) {
      return res.status(400).json({ error: 'Missing problemId, stepNumber, or learnerInput/optionId' });
    }

    const result = validateStepAnswer(problemId, stepNumber, answerToValidate);

    // Telemetry logging
    if (learnerId) {
      try {
        const submissionId = `sub_${crypto.randomBytes(8).toString('hex')}`;
        db.prepare(`
          INSERT INTO learner_step_submissions (id, learner_id, problem_id, step_number, learner_input, is_correct)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(submissionId, learnerId, problemId, Number(stepNumber), String(answerToValidate), result.isCorrect ? 1 : 0);
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
 * Complete and log a finished problem with mastery score, XP rewards, and milestone badges.
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

    // Calculate score
    const hintsPenalty = Math.min(3, Math.max(0, Number(hints_used))) * 10;
    const attemptsPenalty = Math.max(0, Number(attempts_count) - 3) * 5;
    const finalScore = Math.max(50, 100 - hintsPenalty - attemptsPenalty);
    const status = (finalScore >= 80 && Number(hints_used) <= 1) ? 'mastered' : 'completed';

    // Calculate XP earned: 50 base XP + 25 bonus for 0 hints + score/5
    const hintBonus = Number(hints_used) === 0 ? 25 : 0;
    const xpEarned = 50 + hintBonus + Math.round(finalScore / 5);

    // Save lesson progress
    const existing = db.prepare('SELECT id, score, status FROM learner_lesson_progress WHERE learner_id = ? AND problem_id = ?').get(learner_id, problem_id);

    let progressId;
    if (existing) {
      progressId = existing.id;
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

    // Update Gamification (XP, Streak, Milestone Badges)
    let gamificationRow = db.prepare('SELECT * FROM learner_math_gamification WHERE learner_id = ?').get(learner_id);
    const today = new Date().toISOString().split('T')[0];
    let currentXp = 0;
    let currentStreak = 1;
    let bestStreak = 1;
    let badges = [];

    if (gamificationRow) {
      currentXp = gamificationRow.xp + xpEarned;
      badges = JSON.parse(gamificationRow.badges_unlocked || '[]');
      
      // Streak calculation (Non-punitive: never resets to 0)
      if (gamificationRow.last_practice_date !== today) {
        currentStreak = (gamificationRow.current_streak || 1) + 1;
        bestStreak = Math.max(currentStreak, gamificationRow.best_streak || 1);
      } else {
        currentStreak = gamificationRow.current_streak || 1;
        bestStreak = gamificationRow.best_streak || 1;
      }
    } else {
      currentXp = xpEarned;
      currentStreak = 1;
      bestStreak = 1;
    }

    // Check for new badges
    const newBadges = [];
    const checkAndAwardBadge = (badgeId, title, icon, description) => {
      if (!badges.some(b => b.id === badgeId)) {
        const badgeObj = { id: badgeId, title, icon, description, unlocked_at: today };
        badges.push(badgeObj);
        newBadges.push(badgeObj);
      }
    };

    checkAndAwardBadge('badge_first_step', 'First Equation Solved', '🌟', 'Successfully completed your first algebra problem!');
    if (problem.grade === 'Grade 8') {
      checkAndAwardBadge('badge_term_tamer', 'Term Tamer', '🛡️', 'Mastered Grade 8 variable isolation & expanding brackets.');
    } else if (problem.grade === 'Grade 9') {
      checkAndAwardBadge('badge_exponent_explorer', 'Exponent Explorer', '⚡', 'Mastered Grade 9 exponent laws and factorisation.');
    } else if (problem.grade === 'Grade 10') {
      checkAndAwardBadge('badge_parabola_pioneer', 'Parabola Pioneer', '📈', 'Mastered Grade 10 quadratic functions and roots.');
    }
    if (Number(hints_used) === 0) {
      checkAndAwardBadge('badge_hint_free', 'Hint-Free Master', '🧠', 'Solved a complete multi-step problem with zero hints!');
    }
    if (currentStreak >= 3) {
      checkAndAwardBadge('badge_dedicated', 'Dedicated Learner', '🔥', 'Maintained a 3+ session practice streak!');
    }

    // Upsert gamification record
    db.prepare(`
      INSERT INTO learner_math_gamification (learner_id, xp, current_streak, best_streak, last_practice_date, badges_unlocked, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(learner_id) DO UPDATE SET
        xp = excluded.xp,
        current_streak = excluded.current_streak,
        best_streak = excluded.best_streak,
        last_practice_date = excluded.last_practice_date,
        badges_unlocked = excluded.badges_unlocked,
        updated_at = CURRENT_TIMESTAMP
    `).run(learner_id, currentXp, currentStreak, bestStreak, today, JSON.stringify(badges));

    // Update learner activity state
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

    const levelInfo = getLevelFromXP(currentXp);

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
      },
      gamification: {
        xpEarned,
        totalXp: currentXp,
        level: levelInfo.level,
        title: levelInfo.title,
        current_streak: currentStreak,
        newBadges,
        badges
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
