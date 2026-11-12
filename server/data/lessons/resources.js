/**
 * CAPS High School Mathematics Printable Resources & Lesson Memos
 * Sourced from DBE CAPS Curriculum Guidelines for South African Homeschooling.
 */

export const CAPS_FORMULA_SHEETS = {
  'Grade 8': {
    title: 'Grade 8 CAPS Mathematics Formula Sheet & Rules',
    grade: 'Grade 8',
    sections: [
      {
        heading: '1. Laws of Integers & Operations',
        items: [
          'Negative * Negative = Positive: (-a) * (-b) = ab',
          'Positive * Negative = Negative: a * (-b) = -ab',
          'Order of Operations (BODMAS): Brackets -> Orders/Powers -> Division & Multiplication -> Addition & Subtraction',
          'Additive Inverse: a + (-a) = 0'
        ]
      },
      {
        heading: '2. Algebraic Expressions & Distributive Law',
        items: [
          'Distributive Property: a(b + c) = ab + ac',
          'Negative Sign Distribution: -(b + c) = -b - c',
          'Combining Like Terms: Terms can only be combined if they have the exact same variables and exponents (e.g. 3x + 5x = 8x, but 3x + 5 cannot be simplified).'
        ]
      },
      {
        heading: '3. Solving Linear Equations (ax + b = c)',
        items: [
          'Golden Rule of Equations: Whatever you do to one side of the equation, you MUST do to the other side.',
          'Undo Addition with Subtraction: ax + b = c => ax = c - b',
          'Undo Multiplication with Division: ax = d => x = d / a',
          'Variables on Both Sides: Group variable terms on one side (usually the left) and constant numbers on the opposite side.'
        ]
      }
    ]
  },
  'Grade 9': {
    title: 'Grade 9 CAPS Mathematics Formula Sheet & Rules',
    grade: 'Grade 9',
    sections: [
      {
        heading: '1. Exponent Laws (a, b != 0)',
        items: [
          'Product Law: x^a * x^b = x^(a + b) (Add exponents for like bases)',
          'Quotient Law: x^a / x^b = x^(a - b) (Subtract exponents for like bases)',
          'Power of a Power: (x^a)^b = x^(a * b)',
          'Power of a Product: (xy)^a = x^a * y^a',
          'Zero Exponent: x^0 = 1 (for any x != 0)',
          'Negative Exponent: x^(-a) = 1 / x^a'
        ]
      },
      {
        heading: '2. Algebraic Factorisation Identities',
        items: [
          'Highest Common Factor (HCF): ab + ac = a(b + c)',
          'Difference of Two Squares (DOTS): a^2 - b^2 = (a - b)(a + b)',
          'Common Trap: (a - b)^2 = a^2 - 2ab + b^2 (NOT a^2 - b^2)',
          'Quadratic Trinomials: x^2 + (p + q)x + pq = (x + p)(x + q)'
        ]
      }
    ]
  },
  'Grade 10': {
    title: 'Grade 10 CAPS Mathematics Formula Sheet & Rules',
    grade: 'Grade 10',
    sections: [
      {
        heading: '1. Quadratic Equations & Zero Product Principle',
        items: [
          'Standard Form: ax^2 + bx + c = 0',
          'Zero Product Principle: If ab = 0, then a = 0 or b = 0',
          'Roots have inverted signs from linear factors: (x - p)(x - q) = 0 => x = p or x = q'
        ]
      },
      {
        heading: '2. Functions: The Parabola f(x) = ax^2 + q',
        items: [
          'Shape Parameter (a): If a > 0, opens upwards (concave up, minimum vertex). If a < 0, opens downwards (concave down, maximum vertex).',
          'Vertical Shift (q): Shifts graph vertically by q units.',
          'Axis of Symmetry: x = 0 (the vertical y-axis)',
          'Turning Point (Vertex): (0, q)',
          'Y-Intercept: Let x = 0 => y = q => (0, q)',
          'X-Intercepts (Roots): Set f(x) = 0 => ax^2 + q = 0 => x^2 = -q / a => x = +- sqrt(-q / a)'
        ]
      }
    ]
  }
};

/**
 * Returns complete printable worksheet & memo bundle for a given grade
 * @param {string} grade e.g. 'Grade 8', 'Grade 9', 'Grade 10'
 * @param {Array} problems Array of problem objects
 */
export function generatePrintableResourceData(grade, problems) {
  const formulaSheet = CAPS_FORMULA_SHEETS[grade] || CAPS_FORMULA_SHEETS['Grade 8'];

  return {
    grade,
    formulaSheet,
    worksheet: {
      title: `${grade} CAPS Mathematics Practice Worksheet`,
      subtitle: 'Ever After Education • South African Homeschool & Tutoring Solutions',
      date: new Date().toLocaleDateString('en-ZA'),
      problems: problems.map((p, idx) => ({
        index: idx + 1,
        id: p.id,
        title: p.title,
        topic: p.topic,
        subtopic: p.subtopic,
        question: p.questionText,
        latex: p.latexExpression,
        steps: p.steps.map(s => s.prompt),
        capsRef: p.capsRef
      }))
    },
    memo: {
      title: `${grade} CAPS Mathematics Teacher/Parent Marking Memo`,
      subtitle: 'Complete Worked Solutions & Misconception Diagnostics',
      date: new Date().toLocaleDateString('en-ZA'),
      problems: problems.map((p, idx) => ({
        index: idx + 1,
        id: p.id,
        title: p.title,
        topic: p.topic,
        question: p.questionText,
        solution: p.solution,
        stepBreakdown: p.steps.map(s => ({
          stepNumber: s.stepNumber,
          prompt: s.prompt,
          expected: s.expectedAnswer,
          correctOption: s.options ? s.options.find(o => o.isCorrect)?.text : s.expectedAnswer,
          keyMisconceptionTraps: s.options ? s.options.filter(o => !o.isCorrect).map(o => ({
            distractor: o.text,
            diagnostic: o.explanation
          })) : []
        }))
      }))
    }
  };
}

