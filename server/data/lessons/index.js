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
 * Validates a learner's submitted step against expected/accepted answers.
 * @param {string} problemId 
 * @param {number} stepNumber 
 * @param {string} learnerInput 
 * @returns {{ isCorrect: boolean, expected?: string, hint?: string, message: string }}
 */
export function validateStepAnswer(problemId, stepNumber, learnerInput) {
  const problem = getLessonById(problemId);
  if (!problem) {
    return { isCorrect: false, message: 'Problem not found' };
  }

  const step = problem.steps.find(s => s.stepNumber === Number(stepNumber));
  if (!step) {
    return { isCorrect: false, message: 'Step not found' };
  }

  const isCorrect = matchesAnswer(learnerInput, step.expectedAnswer, step.acceptedAnswers);

  if (isCorrect) {
    return {
      isCorrect: true,
      message: 'Excellent! Step verified correct.'
    };
  } else {
    return {
      isCorrect: false,
      hint: step.hint,
      message: 'Not quite. Check your algebraic signs or terms, or review the hint below.'
    };
  }
}
