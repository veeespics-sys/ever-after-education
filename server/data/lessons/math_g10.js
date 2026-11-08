/**
 * CAPS Further Education and Training (FET) Phase Mathematics — Grade 10
 * Module: Functions & Quadratic Equations
 * 
 * Topics:
 * - Solving standard form quadratic equations by factorisation: ax^2 + bx + c = 0
 * - Non-monic quadratic factorisation: 2x^2 + bx + c = 0
 * - Parabola function properties: f(x) = ax^2 + q (turning point, axis of symmetry, shape, y-intercept)
 * - Finding x-intercepts of quadratic functions
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
        acceptedAnswers: [
          '(x - 5)(x + 2) = 0',
          '(x + 2)(x - 5) = 0',
          '(x-5)(x+2)=0',
          '(x+2)(x-5)=0',
          '(x - 5)(x + 2)',
          '(x + 2)(x - 5)'
        ],
        hint: 'Find two factors of -10 that add up to -3: (-5) and (+2).'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Apply the Zero Product Property by setting each factor equal to zero.',
        expectedAnswer: 'x - 5 = 0 or x + 2 = 0',
        acceptedAnswers: [
          'x - 5 = 0 or x + 2 = 0',
          'x + 2 = 0 or x - 5 = 0',
          'x-5=0 or x+2=0',
          'x+2=0 or x-5=0',
          'x - 5 = 0 and x + 2 = 0'
        ],
        hint: 'If A * B = 0, then either A = 0 or B = 0.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Solve the two linear equations to find both values of x.',
        expectedAnswer: 'x = 5 or x = -2',
        acceptedAnswers: [
          'x = 5 or x = -2',
          'x = -2 or x = 5',
          'x=5 or x=-2',
          'x=-2 or x=5',
          '5, -2',
          '-2, 5',
          'x = 5, x = -2',
          'x = -2, x = 5'
        ],
        hint: 'x = 0 + 5 and x = 0 - 2.'
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
        text: 'Zero Product Principle: If the product of two factors equals zero, ab = 0, then at least one of the factors must be zero (a = 0 or b = 0).'
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
        acceptedAnswers: [
          '(2x - 1)(x + 3) = 0',
          '(x + 3)(2x - 1) = 0',
          '(2x-1)(x+3)=0',
          '(x+3)(2x-1)=0',
          '(2x - 1)(x + 3)',
          '(x + 3)(2x - 1)'
        ],
        hint: 'Use grouping or inspection: (2x * x = 2x^2) and (2x * 3 - 1 * x = 6x - x = 5x).'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Solve both factors: 2x - 1 = 0 or x + 3 = 0.',
        expectedAnswer: 'x = 1/2 or x = -3',
        acceptedAnswers: [
          'x = 1/2 or x = -3',
          'x = -3 or x = 1/2',
          'x = 0.5 or x = -3',
          'x = -3 or x = 0.5',
          '1/2, -3',
          '-3, 1/2',
          'x=1/2 or x=-3',
          'x=-3 or x=1/2'
        ],
        hint: 'From 2x - 1 = 0, 2x = 1, so x = 1/2. From x + 3 = 0, x = -3.'
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
        prompt: 'Step 1: Find the y-intercept by calculating f(0). State as a coordinate (x, y) or y-value.',
        expectedAnswer: '(0, -8)',
        acceptedAnswers: [
          '(0, -8)',
          '(0,-8)',
          'y = -8',
          'y=-8',
          '-8'
        ],
        hint: 'Substitute x = 0 into 2x^2 - 8: 2(0)^2 - 8 = -8.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: State the equation of the line of symmetry (axis of symmetry) for this standard vertical parabola.',
        expectedAnswer: 'x = 0',
        acceptedAnswers: [
          'x = 0',
          'x=0',
          'the y-axis'
        ],
        hint: 'For functions of the form f(x) = ax^2 + q, the axis of symmetry is always the vertical line x = 0.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: State the coordinates (x, y) of the turning point (minimum vertex).',
        expectedAnswer: '(0, -8)',
        acceptedAnswers: [
          '(0, -8)',
          '(0,-8)'
        ],
        hint: 'Since a > 0 (a = 2), it is a concave up (smiling) parabola with a minimum turning point at (0, q).'
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
    latexExpression: 'f(x) = x^2 - 16 \\quad \\text{where } f(x) = 0',
    capsRef: 'DBE CAPS Grades 10-12 Mathematics, Section 3.3',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Set the equation to 0 and factorise using the Difference of Two Squares.',
        expectedAnswer: '(x - 4)(x + 4) = 0',
        acceptedAnswers: [
          '(x - 4)(x + 4) = 0',
          '(x + 4)(x - 4) = 0',
          '(x-4)(x+4)=0',
          '(x+4)(x-4)=0',
          'x^2 = 16'
        ],
        hint: 'sqrt(x^2) = x and sqrt(16) = 4.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Solve for x to state the x-intercepts as values or coordinates.',
        expectedAnswer: 'x = 4 or x = -4',
        acceptedAnswers: [
          'x = 4 or x = -4',
          'x = -4 or x = 4',
          'x=4 or x=-4',
          'x=-4 or x=4',
          '4, -4',
          '-4, 4',
          '(4, 0) and (-4, 0)',
          '(-4, 0) and (4, 0)'
        ],
        hint: 'x - 4 = 0 gives x = 4, and x + 4 = 0 gives x = -4.'
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
