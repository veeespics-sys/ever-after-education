import { MATH_GRADE_8_PROBLEMS } from './math_g8.js';
import { MATH_GRADE_9_PROBLEMS } from './math_g9.js';
import { MATH_GRADE_10_PROBLEMS } from './math_g10.js';
import { matchesAnswer, normalizeMathString } from './normalizer.js';

export const ALL_LESSON_PROBLEMS = [
  ...MATH_GRADE_8_PROBLEMS,
  ...MATH_GRADE_9_PROBLEMS,
  ...MATH_GRADE_10_PROBLEMS
];

/**
 * Returns all lesson problems.
 */
export function getAllLessons() {
  return ALL_LESSON_PROBLEMS;
}

/**
 * Returns all problems available for a specific grade.
 * @param {string} grade e.g. 'Grade 8', 'Grade 9', 'Grade 10'
 */
export function getLessonsByGrade(grade) {
  if (!grade) return ALL_LESSON_PROBLEMS;
  const normalized = grade.toLowerCase().replace(/grade\s*/, '').trim();
  return ALL_LESSON_PROBLEMS.filter(p => {
    const pGrade = p.grade.toLowerCase().replace(/grade\s*/, '').trim();
    return pGrade === normalized;
  });
}

/**
 * Finds a specific problem by ID.
 * @param {string} problemId
 */
export function getLessonById(problemId) {
  return ALL_LESSON_PROBLEMS.find(p => p.id === problemId) || null;
}

/**
 * Validates a learner's submitted step against expected/accepted answers or option ID.
 * @param {string} problemId 
 * @param {number} stepNumber 
 * @param {string} learnerInput (can be optionId like 'opt_1a' or text like '6x - 12 + 5')
 * @returns {{ isCorrect: boolean, explanation: string, message: string, hint?: string }}
 */
export function validateStepAnswer(problemId, stepNumber, learnerInput) {
  const problem = getLessonById(problemId);
  if (!problem) {
    return { isCorrect: false, message: 'Problem not found', explanation: 'Problem definition could not be located.' };
  }

  const step = problem.steps.find(s => s.stepNumber === Number(stepNumber));
  if (!step) {
    return { isCorrect: false, message: 'Step not found', explanation: 'Step index does not exist.' };
  }

  // 1. Check if learnerInput matches an option ID (e.g. 'opt_1a')
  if (Array.isArray(step.options)) {
    const matchedOption = step.options.find(o => o.id === learnerInput || o.text.trim() === String(learnerInput).trim());
    if (matchedOption) {
      return {
        isCorrect: Boolean(matchedOption.isCorrect),
        explanation: matchedOption.explanation,
        message: matchedOption.isCorrect ? 'Excellent! Step verified correct.' : 'Notice the pattern: check the explanation below.',
        hint: step.hint
      };
    }
  }

  // 2. Fallback to text normalization match
  const acceptedAnswers = step.acceptedAnswers || (step.options ? step.options.filter(o => o.isCorrect).map(o => o.text) : []);
  const isCorrect = matchesAnswer(learnerInput, step.expectedAnswer, acceptedAnswers);

  if (isCorrect) {
    return {
      isCorrect: true,
      explanation: 'Great algebraic reasoning! Step verified correct.',
      message: 'Excellent! Step verified correct.'
    };
  } else {
    return {
      isCorrect: false,
      explanation: 'Not quite. Check your signs, coefficients, or review the hint below.',
      hint: step.hint,
      message: 'Not quite. Review the hint below to get back on track.'
    };
  }
}
