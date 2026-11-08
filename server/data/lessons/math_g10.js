/**
 * CAPS Further Education and Training (FET) Phase Mathematics — Grade 10
 * Module: Functions & Quadratic Equations
 * 
 * Misconception-Driven Multiple-Choice Question (MCQ) Engine
 * Distractors focus on key Grade 10 transition traps:
 * - Root sign inversion trap: (x - 5)(x + 2) = 0 -> thinking roots are -5 and +2 (failing to set factor to 0)
 * - Turning point coordinates: confusing (0, q) with (q, 0)
 * - Axis of symmetry confusion: reporting horizontal y = 0 instead of vertical line x = 0
 * - Horizontal vs vertical shift: confusing f(x) = ax^2 + q with horizontal movement
 */

export const MATH_GRADE_10_PROBLEMS = [
  {
    id: 'g10_quad_01',
    grade: 'Grade 10',
    topic: 'Functions & Quadratic Equations',
    subtopic: 'Solving Quadratic Equations via Factorisation',
    title: 'Solving Monic Quadratic Equation',
    questionText: 'Solve for x by factorising: x^2 - 3x - 10 = 0',
    latexExpression: 'x^2 - 3x - 10 = 0',
    capsRef: 'DBE CAPS Grades 10-12 Mathematics, Section 3.1 & 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Factorise the quadratic expression on the left side into two binomials (x + p)(x + q) = 0.',
        expectedAnswer: '(x - 5)(x + 2) = 0',
        options: [
          {
            id: 'opt_1a',
            text: '(x - 5)(x + 2) = 0',
            isCorrect: true,
            explanation: 'Correct! -5 * 2 = -10, and -5 + 2 = -3. The factors match both coefficients.'
          },
          {
            id: 'opt_1b',
            text: '(x + 5)(x - 2) = 0',
            isCorrect: false,
            explanation: 'Middle Term Sign Inversion: Expanding (x + 5)(x - 2) gives x^2 + 3x - 10. The middle term is +3x, but our equation has -3x! The larger factor must be negative (-5).'
          },
          {
            id: 'opt_1c',
            text: '(x - 10)(x + 1) = 0',
            isCorrect: false,
            explanation: 'Factor Pair Mismatch: -10 * 1 = -10, but -10 + 1 = -9, NOT -3.'
          },
          {
            id: 'opt_1d',
            text: '(x - 5)(x - 2) = 0',
            isCorrect: false,
            explanation: 'Constant Sign Error: (-5) * (-2) = +10. The constant in our equation is -10, so the two numbers must have opposite signs.'
          }
        ],
        hint: 'Find factors of -10 that add to -3: (-5) and (+2).'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Apply the Zero Product Property by setting each factor equal to zero.',
        expectedAnswer: 'x - 5 = 0 or x + 2 = 0',
        options: [
          {
            id: 'opt_2a',
            text: 'x - 5 = 0 or x + 2 = 0',
            isCorrect: true,
            explanation: 'Spot on! If A * B = 0, then either factor A = 0 or factor B = 0.'
          },
          {
            id: 'opt_2b',
            text: 'x = 5 and x = 2',
            isCorrect: false,
            explanation: 'Conjunction & Sign Confusion: A single variable x cannot equal two different numbers at the same instant (use "or"). Also, x + 2 = 0 yields x = -2, not +2.'
          },
          {
            id: 'opt_2c',
            text: 'x + 5 = 0 or x - 2 = 0',
            isCorrect: false,
            explanation: 'Sign Reversal: The factors are (x - 5) and (x + 2). Keep the exact signs when setting each bracket to zero.'
          },
          {
            id: 'opt_2d',
            text: 'x = 0 or x = 10',
            isCorrect: false,
            explanation: 'Zero Product Misconception: You must set the parenthesized binomials (x - 5) and (x + 2) to zero, not arbitrary numbers.'
          }
        ],
        hint: 'If A * B = 0, then A = 0 or B = 0.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Solve the two linear equations to find both roots of x.',
        expectedAnswer: 'x = 5 or x = -2',
        options: [
          {
            id: 'opt_3a',
            text: 'x = 5 or x = -2',
            isCorrect: true,
            explanation: 'Awesome! From x - 5 = 0, x = 5. From x + 2 = 0, x = -2. Both roots verified.'
          },
          {
            id: 'opt_3b',
            text: 'x = -5 or x = 2',
            isCorrect: false,
            explanation: 'Root Sign Inversion Trap: The most common trap in CAPS quadratic tests! When solving x - 5 = 0, adding 5 gives x = +5. When solving x + 2 = 0, subtracting 2 gives x = -2. The roots have opposite signs from the numbers in the brackets!'
          },
          {
            id: 'opt_3c',
            text: 'x = 5 or x = 2',
            isCorrect: false,
            explanation: 'Sign Error: x + 2 = 0 requires subtracting 2: x = -2, not positive 2.'
          },
          {
            id: 'opt_3d',
            text: 'x = 10 or x = -1',
            isCorrect: false,
            explanation: 'Incorrect Factors: The factors were 5 and -2, not 10 and -1.'
          }
        ],
        hint: 'x - 5 = 0 => x = 5. x + 2 = 0 => x = -2.'
      }
    ],
    solution: [
      'x^2 - 3x - 10 = 0',
      'Factors of -10 that add to -3 are -5 and +2',
      '(x - 5)(x + 2) = 0',
      'x - 5 = 0  or  x + 2 = 0',
      'x = 5  or  x = -2'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Zero Product Principle: If the product of two factors equals zero, ab = 0, then at least one factor must be zero (a = 0 or b = 0).'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Find two integers that multiply to -10 and add to -3: (-5) * 2 = -10, and -5 + 2 = -3. Write as (x - 5)(x + 2) = 0. Then set each bracket to 0.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) Factorise: (x - 5)(x + 2) = 0\n2) Separate: x - 5 = 0 or x + 2 = 0\n3) Solve: x = 5 or x = -2\nBoth values satisfy the original equation: (5)^2 - 3(5) - 10 = 25 - 15 - 10 = 0.'
      }
    ]
  },
  {
    id: 'g10_quad_02',
    grade: 'Grade 10',
    topic: 'Functions & Quadratic Equations',
    subtopic: 'Solving Quadratic Equations via Factorisation',
    title: 'Solving Non-Monic Quadratic Equation (a > 1)',
    questionText: 'Solve for x by factorising: 2x^2 + 5x - 3 = 0',
    latexExpression: '2x^2 + 5x - 3 = 0',
    capsRef: 'DBE CAPS Grades 10-12 Mathematics, Section 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Factorise the trinomial with leading coefficient 2 into two linear binomials equal to zero.',
        expectedAnswer: '(2x - 1)(x + 3) = 0',
        options: [
          {
            id: 'opt_1a',
            text: '(2x - 1)(x + 3) = 0',
            isCorrect: true,
            explanation: 'Correct! Expanding: 2x * x = 2x^2, 2x * 3 = 6x, -1 * x = -x (6x - x = 5x), and -1 * 3 = -3.'
          },
          {
            id: 'opt_1b',
            text: '(2x + 1)(x - 3) = 0',
            isCorrect: false,
            explanation: 'Sign Trap: Expanding (2x + 1)(x - 3) gives 2x^2 - 6x + x - 3 = 2x^2 - 5x - 3. Notice the middle term is -5x, but we need +5x! Swap the signs.'
          },
          {
            id: 'opt_1c',
            text: '(2x - 3)(x + 1) = 0',
            isCorrect: false,
            explanation: 'Cross-Product Mismatch: Expanding gives 2x^2 + 2x - 3x - 3 = 2x^2 - x - 3. The middle term is -x, not 5x.'
          },
          {
            id: 'opt_1d',
            text: '(x - 1)(x + 3) = 0',
            isCorrect: false,
            explanation: 'Missing Leading Coefficient: The original equation begins with 2x^2. One factor must have 2x: (2x - 1)(x + 3).'
          }
        ],
        hint: 'Use grouping or inspection: (2x - 1)(x + 3) gives 6x - x = 5x.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Solve both factors: 2x - 1 = 0 or x + 3 = 0.',
        expectedAnswer: 'x = 1/2 or x = -3',
        options: [
          {
            id: 'opt_2a',
            text: 'x = 1/2 or x = -3',
            isCorrect: true,
            explanation: 'Great work! From 2x - 1 = 0 => 2x = 1 => x = 1/2 (or 0.5). From x + 3 = 0 => x = -3.'
          },
          {
            id: 'opt_2b',
            text: 'x = -1/2 or x = 3',
            isCorrect: false,
            explanation: 'Double Sign Inversion: For 2x - 1 = 0, add 1: 2x = +1, so x = +1/2. For x + 3 = 0, subtract 3: x = -3.'
          },
          {
            id: 'opt_2c',
            text: 'x = 1 or x = -3',
            isCorrect: false,
            explanation: 'Forgot Coefficient Division: 2x = 1 requires dividing by 2: x = 1/2 (not 1).'
          },
          {
            id: 'opt_2d',
            text: 'x = 2 or x = -3',
            isCorrect: false,
            explanation: 'Multiplied instead of Divided: When 2x = 1, divide 1 by 2 to get 1/2, do not multiply 1 * 2.'
          }
        ],
        hint: '2x - 1 = 0 => 2x = 1 => x = 1/2. x + 3 = 0 => x = -3.'
      }
    ],
    solution: [
      '2x^2 + 5x - 3 = 0',
      'Split middle term: 2x^2 + 6x - x - 3 = 0',
      'Group: 2x(x + 3) - 1(x + 3) = 0',
      '(2x - 1)(x + 3) = 0',
      '2x - 1 = 0  or  x + 3 = 0',
      'x = 1/2 (or 0.5)  or  x = -3'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'When factorising ax^2 + bx + c with a != 1, look for two numbers that multiply to a*c (2 * -3 = -6) and add to b (+5). The numbers are +6 and -1.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Rewrite 5x as 6x - x: 2x^2 + 6x - x - 3 = 0. Factor by grouping: 2x(x + 3) - 1(x + 3) = 0 => (2x - 1)(x + 3) = 0.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) Factorisation: (2x - 1)(x + 3) = 0\n2) Factor 1: 2x - 1 = 0 => 2x = 1 => x = 1/2\n3) Factor 2: x + 3 = 0 => x = -3\nAnswers: x = 1/2 or x = -3'
      }
    ]
  },
  {
    id: 'g10_func_03',
    grade: 'Grade 10',
    topic: 'Functions & Quadratic Equations',
    subtopic: 'Quadratic Function Properties (f(x) = ax^2 + q)',
    title: 'Parabola Features: Turning Point, Symmetry & Y-Intercept',
    questionText: 'Consider the quadratic parabola function: f(x) = 2x^2 - 8. Determine its key geometric features.',
    latexExpression: 'f(x) = 2x^2 - 8',
    capsRef: 'DBE CAPS Grades 10-12 Mathematics, Section 3.3 (Functions)',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Determine the y-intercept of f(x) by setting x = 0.',
        expectedAnswer: '(0, -8)',
        options: [
          {
            id: 'opt_1a',
            text: '(0, -8)',
            isCorrect: true,
            explanation: 'Correct! f(0) = 2(0)^2 - 8 = -8. The y-intercept is at (0, -8).'
          },
          {
            id: 'opt_1b',
            text: '(-8, 0)',
            isCorrect: false,
            explanation: 'Coordinate Axis Reversal Trap: Points on the y-axis always have an x-coordinate of 0: (0, y). Writing (-8, 0) places the point on the x-axis!'
          },
          {
            id: 'opt_1c',
            text: '(0, 8)',
            isCorrect: false,
            explanation: 'Dropped Negative Sign: The equation has -8 (a downward vertical shift). The coordinate is (0, -8).'
          },
          {
            id: 'opt_1d',
            text: '(0, -6)',
            isCorrect: false,
            explanation: 'Substituted x=1: f(1) = 2 - 8 = -6, but for the y-intercept you must substitute x = 0.'
          }
        ],
        hint: 'Substitute x = 0 into 2x^2 - 8: 2(0)^2 - 8 = -8.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: State the equation of the axis of symmetry for this standard parabola f(x) = ax^2 + q.',
        expectedAnswer: 'x = 0',
        options: [
          {
            id: 'opt_2a',
            text: 'x = 0',
            isCorrect: true,
            explanation: 'Spot on! For any standard parabola of the form f(x) = ax^2 + q, the vertical axis of symmetry is the line x = 0 (the y-axis).'
          },
          {
            id: 'opt_2b',
            text: 'y = 0',
            isCorrect: false,
            explanation: 'Horizontal vs Vertical Line Trap: y = 0 is a horizontal line (the x-axis)! A vertical line of symmetry always has the equation x = constant.'
          },
          {
            id: 'opt_2c',
            text: 'x = -8',
            isCorrect: false,
            explanation: 'Vertical Shift Confusion: The -8 represents the vertical shift (q) along the y-axis, not horizontal movement. The parabola is still centered at x = 0.'
          },
          {
            id: 'opt_2d',
            text: 'x = 2',
            isCorrect: false,
            explanation: 'Coefficient Trap: The 2 is the vertical stretch factor (a), not the axis of symmetry.'
          }
        ],
        hint: 'For functions of the form f(x) = ax^2 + q, the axis of symmetry is always the vertical line x = 0.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: State the coordinates (x, y) of the turning point (vertex).',
        expectedAnswer: '(0, -8)',
        options: [
          {
            id: 'opt_3a',
            text: '(0, -8)',
            isCorrect: true,
            explanation: 'Brilliant! Since a = 2 > 0, the parabola opens upwards with a minimum turning point at (0, q) = (0, -8).'
          },
          {
            id: 'opt_3b',
            text: '(-8, 0)',
            isCorrect: false,
            explanation: 'Coordinate Swap: The turning point lies on the axis of symmetry x = 0, so the x-coordinate must be 0: (0, -8).'
          },
          {
            id: 'opt_3c',
            text: '(0, 8)',
            isCorrect: false,
            explanation: 'Sign Error: q = -8, so the vertex is shifted down 8 units to (0, -8).'
          },
          {
            id: 'opt_3d',
            text: '(2, -8)',
            isCorrect: false,
            explanation: 'Included "a" value: The x-value of the vertex for f(x) = ax^2 + q is 0, not a: vertex is (0, -8).'
          }
        ],
        hint: 'Since a = 2 > 0, it has a minimum turning point at (0, q) = (0, -8).'
      }
    ],
    solution: [
      'f(x) = 2x^2 - 8',
      'Standard form: f(x) = ax^2 + q where a = 2 and q = -8',
      '1) y-intercept: let x = 0 => y = -8, coordinate (0, -8)',
      '2) Axis of symmetry: x = 0',
      '3) Turning point: (0, q) = (0, -8)'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'For the parabola f(x) = ax^2 + q: the axis of symmetry is always the line x = 0, and the turning point (vertex) is at the point (0, q).'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'In 2x^2 - 8, the value of a is 2 and the vertical shift q is -8. Since a > 0, the graph opens upwards with a minimum at (0, -8).'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) y-intercept: f(0) = 2(0)^2 - 8 = -8 => (0, -8)\n2) Axis of symmetry: x = 0\n3) Turning point: (0, -8) (minimum)'
      }
    ]
  },
  {
    id: 'g10_func_04',
    grade: 'Grade 10',
    topic: 'Functions & Quadratic Equations',
    subtopic: 'Finding X-Intercepts (Roots) of Parabola',
    title: 'Finding the X-Intercepts of a Parabola',
    questionText: 'Find the x-intercepts (roots) of the parabola f(x) = x^2 - 16 by setting f(x) = 0.',
    latexExpression: 'f(x) = x^2 - 16 \\quad (\\text{where } f(x) = 0)',
    capsRef: 'DBE CAPS Grades 10-12 Mathematics, Section 3.3',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Set equation to 0 and factorise using Difference of Two Squares.',
        expectedAnswer: '(x - 4)(x + 4) = 0',
        options: [
          {
            id: 'opt_1a',
            text: '(x - 4)(x + 4) = 0',
            isCorrect: true,
            explanation: 'Correct! 16 is 4^2, so x^2 - 16 factorises into (x - 4)(x + 4) = 0.'
          },
          {
            id: 'opt_1b',
            text: '(x - 4)^2 = 0',
            isCorrect: false,
            explanation: 'Binomial Square Trap: (x - 4)^2 = x^2 - 8x + 16, which contains a middle term (-8x) and positive 16. Difference of squares requires opposite signs: (x - 4)(x + 4).'
          },
          {
            id: 'opt_1c',
            text: '(x - 8)(x + 8) = 0',
            isCorrect: false,
            explanation: 'Halving instead of Square Root: You divided 16 by 2 to get 8. You must find the SQUARE ROOT: sqrt(16) = 4 (since 4 * 4 = 16).'
          },
          {
            id: 'opt_1d',
            text: '(x + 16)(x - 1) = 0',
            isCorrect: false,
            explanation: 'Incorrect Factors: Expanding gives x^2 + 15x - 16, not x^2 - 16.'
          }
        ],
        hint: 'sqrt(x^2) = x and sqrt(16) = 4.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Solve for x to state the x-intercepts (roots).',
        expectedAnswer: 'x = 4 or x = -4',
        options: [
          {
            id: 'opt_2a',
            text: 'x = 4 or x = -4',
            isCorrect: true,
            explanation: 'Spot on! The parabola cuts the x-axis at (4, 0) and (-4, 0).'
          },
          {
            id: 'opt_2b',
            text: 'x = 16 or x = -16',
            isCorrect: false,
            explanation: 'Unsolved Roots: The roots are the square roots of 16 (x = +4 or -4), not 16 itself.'
          },
          {
            id: 'opt_2c',
            text: 'x = 4 only',
            isCorrect: false,
            explanation: 'Dropped Negative Root Trap: Every standard quadratic with q < 0 has TWO symmetric roots: both +4 and -4 (since (-4)^2 = +16).'
          },
          {
            id: 'opt_2d',
            text: 'x = 8 or x = -8',
            isCorrect: false,
            explanation: '8 squared is 64! The square root of 16 is 4, so roots are 4 and -4.'
          }
        ],
        hint: 'x - 4 = 0 => x = 4. x + 4 = 0 => x = -4.'
      }
    ],
    solution: [
      'f(x) = x^2 - 16 = 0',
      '(x - 4)(x + 4) = 0',
      'x - 4 = 0  or  x + 4 = 0',
      'x = 4  or  x = -4',
      'x-intercepts are (4, 0) and (-4, 0)'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'The x-intercepts of any function are the points where the graph cuts the x-axis, which occurs where y = f(x) = 0.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Set x^2 - 16 = 0. Notice that 16 is a perfect square (4^2). Factorise as difference of two squares: (x - 4)(x + 4) = 0.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) x^2 - 16 = 0\n2) (x - 4)(x + 4) = 0\n3) x - 4 = 0 => x = 4\n4) x + 4 = 0 => x = -4\nCoordinates of x-intercepts: (4, 0) and (-4, 0)'
      }
    ]
  }
];
