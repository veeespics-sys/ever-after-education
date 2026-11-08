/**
 * CAPS Senior Phase Mathematics — Grade 8
 * Module: Algebraic Expressions & Equations
 * 
 * Topics:
 * - Distributive property and expanding brackets
 * - Isolating single variables in linear equations: ax + b = c
 * - Solving linear equations with variables on both sides
 * - Algebraic substitution
 */

export const MATH_GRADE_8_PROBLEMS = [
  {
    id: 'g8_alg_01',
    grade: 'Grade 8',
    topic: 'Algebraic Expressions & Equations',
    subtopic: 'Expanding Brackets & Distributive Property',
    title: 'Expanding Brackets with a Constant',
    questionText: 'Expand and simplify the algebraic expression: 3(2x - 4) + 5',
    latexExpression: '3(2x - 4) + 5',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Apply the distributive law by multiplying 3 with both terms inside the bracket (2x and -4).',
        expectedAnswer: '6x - 12 + 5',
        acceptedAnswers: [
          '6x - 12 + 5',
          '6x-12+5',
          '6x + -12 + 5'
        ],
        hint: 'Multiply: 3 * 2x = 6x, and 3 * (-4) = -12.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Collect the like terms (the constants -12 and +5) to get the final simplified expression.',
        expectedAnswer: '6x - 7',
        acceptedAnswers: [
          '6x - 7',
          '6x-7',
          '-7 + 6x',
          '-7+6x'
        ],
        hint: 'Calculate: -12 + 5.'
      }
    ],
    solution: [
      '3(2x - 4) + 5',
      '= (3 * 2x) + (3 * -4) + 5',
      '= 6x - 12 + 5',
      '= 6x - 7'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'The Distributive Law states: a(b + c) = ab + ac. Every term inside the parentheses must be multiplied by the factor outside.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Multiply 3 by 2x to get 6x, and 3 by -4 to get -12. Then bring down the +5: 6x - 12 + 5. Now combine the constant numbers -12 and +5.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) Multiply out: 3 * 2x = 6x, and 3 * (-4) = -12.\n2) Expression becomes: 6x - 12 + 5.\n3) Combine constant numbers: -12 + 5 = -7.\nFinal Answer: 6x - 7'
      }
    ]
  },
  {
    id: 'g8_alg_02',
    grade: 'Grade 8',
    topic: 'Algebraic Expressions & Equations',
    subtopic: 'Solving Linear Equations (ax + b = c)',
    title: 'Solving Linear Equation with Parentheses',
    questionText: 'Solve for x: 4(x + 3) = 28',
    latexExpression: '4(x + 3) = 28',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.3',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Expand the bracket on the left side of the equation.',
        expectedAnswer: '4x + 12 = 28',
        acceptedAnswers: [
          '4x + 12 = 28',
          '4x+12=28',
          '28 = 4x + 12',
          'x + 3 = 7' // alternative dividing both sides by 4
        ],
        hint: 'Multiply 4 by x and 4 by 3.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Subtract 12 from both sides to isolate the 4x term.',
        expectedAnswer: '4x = 16',
        acceptedAnswers: [
          '4x = 16',
          '4x=16',
          '16 = 4x'
        ],
        hint: 'Subtract 12 from 28 (28 - 12 = 16).'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Divide both sides by 4 to solve for x.',
        expectedAnswer: 'x = 4',
        acceptedAnswers: [
          'x = 4',
          'x=4',
          '4'
        ],
        hint: 'Divide 16 by 4.'
      }
    ],
    solution: [
      '4(x + 3) = 28',
      '4x + 12 = 28',
      '4x = 28 - 12',
      '4x = 16',
      'x = 16 / 4',
      'x = 4'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'To solve an equation, use inverse operations in reverse order: expand or simplify first, then undo addition/subtraction, and finally undo multiplication/division.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Expand 4(x + 3) to 4x + 12 = 28. Then subtract 12 from both sides to isolate 4x: 4x = 16. Finally divide 16 by 4.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) 4x + 12 = 28\n2) 4x = 28 - 12\n3) 4x = 16\n4) x = 16 / 4\nx = 4'
      }
    ]
  },
  {
    id: 'g8_alg_03',
    grade: 'Grade 8',
    topic: 'Algebraic Expressions & Equations',
    subtopic: 'Variables on Both Sides',
    title: 'Isolating Variables on Both Sides',
    questionText: 'Solve for x: 5x - 8 = 2x + 7',
    latexExpression: '5x - 8 = 2x + 7',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.3',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Subtract 2x from both sides so that variable terms are on the left side.',
        expectedAnswer: '3x - 8 = 7',
        acceptedAnswers: [
          '3x - 8 = 7',
          '3x-8=7',
          '5x - 2x - 8 = 7',
          '-8 = -3x + 7'
        ],
        hint: '5x - 2x gives 3x.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Add 8 to both sides to isolate the 3x term.',
        expectedAnswer: '3x = 15',
        acceptedAnswers: [
          '3x = 15',
          '3x=15',
          '15 = 3x'
        ],
        hint: '7 + 8 = 15.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Divide both sides by 3 to find x.',
        expectedAnswer: 'x = 5',
        acceptedAnswers: [
          'x = 5',
          'x=5',
          '5'
        ],
        hint: 'Divide 15 by 3.'
      }
    ],
    solution: [
      '5x - 8 = 2x + 7',
      '5x - 2x - 8 = 7',
      '3x - 8 = 7',
      '3x = 7 + 8',
      '3x = 15',
      'x = 5'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Group like terms on opposite sides of the equals sign: move all variable terms (x) to one side and all constant numbers to the other side.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Subtract 2x from 5x to leave 3x - 8 = 7. Next, add 8 to both sides to get 3x = 15. Then divide by 3.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) 5x - 2x - 8 = 7 => 3x - 8 = 7\n2) 3x = 7 + 8 => 3x = 15\n3) x = 15 / 3 => x = 5'
      }
    ]
  },
  {
    id: 'g8_alg_04',
    grade: 'Grade 8',
    topic: 'Algebraic Expressions & Equations',
    subtopic: 'Algebraic Substitution',
    title: 'Evaluating Quadratic Expressions with Negative Values',
    questionText: 'If x = -3, evaluate the value of the expression: 2x^2 - 4x + 5',
    latexExpression: '2x^2 - 4x + 5 \\quad \\text{when } x = -3',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Substitute -3 into the expression in place of every x.',
        expectedAnswer: '2(-3)^2 - 4(-3) + 5',
        acceptedAnswers: [
          '2(-3)^2 - 4(-3) + 5',
          '2(-3)^2-4(-3)+5',
          '2*(-3)^2 - 4*(-3) + 5',
          '2(9) - 4(-3) + 5',
          '2(9) + 12 + 5'
        ],
        hint: 'Use brackets around -3: 2(-3)^2 - 4(-3) + 5.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Apply order of operations (BODMAS/PEMDAS) by computing (-3)^2 = 9 and -4 * (-3) = +12.',
        expectedAnswer: '18 + 12 + 5',
        acceptedAnswers: [
          '18 + 12 + 5',
          '18+12+5',
          '30 + 5'
        ],
        hint: '2 * 9 = 18, and -4 * (-3) = +12.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Add the numbers to calculate the final numerical value.',
        expectedAnswer: '35',
        acceptedAnswers: [
          '35',
          'value = 35'
        ],
        hint: '18 + 12 + 5 = 35.'
      }
    ],
    solution: [
      '2x^2 - 4x + 5 (when x = -3)',
      '= 2(-3)^2 - 4(-3) + 5',
      '= 2(9) + 12 + 5',
      '= 18 + 12 + 5',
      '= 35'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'When substituting negative numbers, always place parentheses around the value: (-3)^2 = +9, because a negative number multiplied by a negative number is positive.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Follow BODMAS: First square -3 to get 9: 2(9) = 18. Next calculate -4 * (-3) = +12. Then calculate 18 + 12 + 5.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) Substitute: 2(-3)^2 - 4(-3) + 5\n2) Square (-3): 2(9) + 12 + 5\n3) Multiply: 18 + 12 + 5\n4) Sum: 35'
      }
    ]
  }
];
