/**
 * CAPS Senior Phase Mathematics — Grade 8
 * Module: Algebraic Expressions & Equations
 * 
 * Misconception-Driven Multiple-Choice Question (MCQ) Engine
 * Each distractor addresses typical South African CAPS algebraic errors:
 * - Distributive law neglect: 3(2x - 4) -> 6x - 4 (forgetting to multiply second term)
 * - Sign rules with negatives: (-3) * (-4) -> -12 instead of +12
 * - Adding coefficients instead of multiplying: 3 * 2x -> 5x
 * - Transposition sign errors: 4x + 12 = 28 -> 4x = 40 (adding instead of subtracting)
 */

export const MATH_GRADE_8_PROBLEMS = [
  {
    id: 'g8_alg_01',
    grade: 'Grade 8',
    topic: 'Algebraic Expressions & Equations',
    subtopic: 'Expanding Brackets & Distributive Property',
    title: 'Expanding Brackets with a Constant Factor',
    questionText: 'Expand and simplify the algebraic expression: 3(2x - 4) + 5',
    latexExpression: '3(2x - 4) + 5',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Apply the distributive law by multiplying 3 into each term inside the parentheses (2x and -4).',
        expectedAnswer: '6x - 12 + 5',
        options: [
          {
            id: 'opt_1a',
            text: '6x - 12 + 5',
            isCorrect: true,
            explanation: 'Correct! The 3 outside multiplies both 2x (3 * 2x = 6x) and -4 (3 * -4 = -12).'
          },
          {
            id: 'opt_1b',
            text: '6x - 4 + 5',
            isCorrect: false,
            explanation: 'Partial Distribution Trap: You multiplied 3 by 2x to get 6x, but forgot to multiply the 3 by the -4! Remember: every term inside the bracket must be multiplied.'
          },
          {
            id: 'opt_1c',
            text: '6x + 12 + 5',
            isCorrect: false,
            explanation: 'Sign Rule Trap: Remember that multiplying a positive by a negative yields a negative: (+3) * (-4) = -12, not +12.'
          },
          {
            id: 'opt_1d',
            text: '5x - 12 + 5',
            isCorrect: false,
            explanation: 'Operation Confusion: 3 * 2x is multiplication (giving 6x), not addition (3 + 2x = 5x).'
          }
        ],
        hint: 'Multiply the 3 outside by both 2x and -4: 3 * 2x = 6x, and 3 * (-4) = -12.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Collect the like terms (the constant numbers -12 and +5) to produce the final simplified expression.',
        expectedAnswer: '6x - 7',
        options: [
          {
            id: 'opt_2a',
            text: '6x - 7',
            isCorrect: true,
            explanation: 'Excellent! -12 + 5 = -7, so the final simplified expression is 6x - 7.'
          },
          {
            id: 'opt_2b',
            text: '6x - 17',
            isCorrect: false,
            explanation: 'Integer Sign Trap: You subtracted 5 from -12 (-12 - 5 = -17). But the 5 has a positive sign: -12 + 5 moves 5 units to the right on the number line, reaching -7.'
          },
          {
            id: 'opt_2c',
            text: '6x + 7',
            isCorrect: false,
            explanation: 'Sign Magnitude Trap: Because -12 has a larger absolute magnitude than +5, the result must stay negative: -12 + 5 = -7.'
          },
          {
            id: 'opt_2d',
            text: '-x',
            isCorrect: false,
            explanation: 'Unlike Terms Trap: You cannot combine 6x and -7 into -1x! 6x has a variable while -7 is a constant number; they are unlike terms.'
          }
        ],
        hint: 'Add the integers: -12 + 5 = -7.'
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
        prompt: 'Step 1: Expand the parentheses on the left side of the equation.',
        expectedAnswer: '4x + 12 = 28',
        options: [
          {
            id: 'opt_1a',
            text: '4x + 12 = 28',
            isCorrect: true,
            explanation: 'Correct! 4 * x = 4x and 4 * 3 = 12.'
          },
          {
            id: 'opt_1b',
            text: '4x + 3 = 28',
            isCorrect: false,
            explanation: 'Bracket Neglect Trap: 4 must multiply BOTH terms inside the bracket. 4 * 3 is 12, not 3!'
          },
          {
            id: 'opt_1c',
            text: '4x + 7 = 28',
            isCorrect: false,
            explanation: 'Addition instead of Multiplication: 4 * 3 is 12, not 4 + 3 = 7.'
          },
          {
            id: 'opt_1d',
            text: 'x + 12 = 28',
            isCorrect: false,
            explanation: 'Missing Coefficient: The 4 also multiplies the x, giving 4x (not just x).'
          }
        ],
        hint: 'Multiply 4 by x and 4 by 3.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Subtract 12 from both sides of the equation to isolate the variable term 4x.',
        expectedAnswer: '4x = 16',
        options: [
          {
            id: 'opt_2a',
            text: '4x = 16',
            isCorrect: true,
            explanation: 'Great job! 28 - 12 = 16, leaving 4x = 16.'
          },
          {
            id: 'opt_2b',
            text: '4x = 40',
            isCorrect: false,
            explanation: 'Transposition Sign Trap: When moving +12 across the equals sign, you must perform the inverse operation: subtract 12 (28 - 12 = 16), not add 12 (28 + 12 = 40).'
          },
          {
            id: 'opt_2c',
            text: '4x = 12',
            isCorrect: false,
            explanation: 'Arithmetic Mistake: 28 - 12 = 16, not 12.'
          },
          {
            id: 'opt_2d',
            text: 'x = 16',
            isCorrect: false,
            explanation: 'Skipped Division: The coefficient 4 is still attached to the x! You have 4x = 16, not x = 16.'
          }
        ],
        hint: 'Calculate: 28 - 12.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Divide both sides by 4 to solve for x.',
        expectedAnswer: 'x = 4',
        options: [
          {
            id: 'opt_3a',
            text: 'x = 4',
            isCorrect: true,
            explanation: 'Spot on! 16 / 4 = 4. You have solved the equation!'
          },
          {
            id: 'opt_3b',
            text: 'x = 12',
            isCorrect: false,
            explanation: 'Subtraction Trap: The relationship between 4 and x is multiplication (4 * x = 16). The inverse is division (16 / 4 = 4), not subtraction (16 - 4 = 12).'
          },
          {
            id: 'opt_3c',
            text: 'x = 64',
            isCorrect: false,
            explanation: 'Multiplication Trap: You multiplied 16 * 4 instead of dividing 16 / 4.'
          },
          {
            id: 'opt_3d',
            text: 'x = 2',
            isCorrect: false,
            explanation: 'Division Mistake: 16 divided by 4 equals 4 (since 4 * 4 = 16).'
          }
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
        text: 'To solve an equation, use inverse operations in reverse order: expand or simplify first, undo addition/subtraction, and finally undo multiplication/division.'
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
        prompt: 'Step 1: Subtract 2x from both sides so all variable terms are grouped on the left.',
        expectedAnswer: '3x - 8 = 7',
        options: [
          {
            id: 'opt_1a',
            text: '3x - 8 = 7',
            isCorrect: true,
            explanation: 'Correct! 5x - 2x = 3x, leaving 3x - 8 = 7.'
          },
          {
            id: 'opt_1b',
            text: '7x - 8 = 7',
            isCorrect: false,
            explanation: 'Addition Trap: To cancel +2x from the right side, you must subtract 2x from both sides (5x - 2x = 3x), not add (5x + 2x = 7x).'
          },
          {
            id: 'opt_1c',
            text: '3x = 7',
            isCorrect: false,
            explanation: 'Term Omission: Do not forget the -8 on the left! It must remain: 3x - 8 = 7.'
          },
          {
            id: 'opt_1d',
            text: '3x - 8 = 2x',
            isCorrect: false,
            explanation: 'Misplaced Terms: When subtracting 2x from both sides, the 2x on the right cancels, leaving +7.'
          }
        ],
        hint: '5x - 2x gives 3x.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Add 8 to both sides to isolate 3x.',
        expectedAnswer: '3x = 15',
        options: [
          {
            id: 'opt_2a',
            text: '3x = 15',
            isCorrect: true,
            explanation: 'Spot on! 7 + 8 = 15, so 3x = 15.'
          },
          {
            id: 'opt_2b',
            text: '3x = -1',
            isCorrect: false,
            explanation: 'Sign Reversal: To eliminate -8, you must ADD 8 to both sides: 7 + 8 = 15, not 7 - 8 = -1.'
          },
          {
            id: 'opt_2c',
            text: '3x = 1',
            isCorrect: false,
            explanation: 'Arithmetic Mistake: 7 + 8 = 15 (not 1).'
          },
          {
            id: 'opt_2d',
            text: 'x = 15',
            isCorrect: false,
            explanation: 'Premature Result: The coefficient 3 is still multiplying x. You have 3x = 15.'
          }
        ],
        hint: '7 + 8 = 15.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Divide both sides by 3 to find x.',
        expectedAnswer: 'x = 5',
        options: [
          {
            id: 'opt_3a',
            text: 'x = 5',
            isCorrect: true,
            explanation: 'Awesome! 15 / 3 = 5. Solution complete!'
          },
          {
            id: 'opt_3b',
            text: 'x = 12',
            isCorrect: false,
            explanation: 'Inverse Operation Error: 3 is multiplied by x; divide 15 by 3, do not subtract 3.'
          },
          {
            id: 'opt_3c',
            text: 'x = 45',
            isCorrect: false,
            explanation: 'Multiplication Trap: You multiplied 15 * 3 instead of dividing 15 / 3.'
          },
          {
            id: 'opt_3d',
            text: 'x = 3',
            isCorrect: false,
            explanation: 'Arithmetic Mistake: 15 / 3 = 5, because 3 * 5 = 15.'
          }
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
    questionText: 'If x = -3, evaluate the numerical value of: 2x^2 - 4x + 5',
    latexExpression: '2x^2 - 4x + 5 \\quad (\\text{for } x = -3)',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Substitute x = -3 into the expression using parentheses.',
        expectedAnswer: '2(-3)^2 - 4(-3) + 5',
        options: [
          {
            id: 'opt_1a',
            text: '2(-3)^2 - 4(-3) + 5',
            isCorrect: true,
            explanation: 'Correct! Always wrap substituted negative values in parentheses to preserve signs.'
          },
          {
            id: 'opt_1b',
            text: '2 - 3^2 - 4 - 3 + 5',
            isCorrect: false,
            explanation: 'Missing Multiplication Trap: 2x^2 means 2 TIMES x^2. Without parentheses, 2(-3)^2 looks like 2 minus 3^2.'
          },
          {
            id: 'opt_1c',
            text: '2(3)^2 - 4(3) + 5',
            isCorrect: false,
            explanation: 'Dropped Negative Sign: The given value is x = -3, not positive 3!'
          },
          {
            id: 'opt_1d',
            text: '2(-3)^2 + 4(-3) + 5',
            isCorrect: false,
            explanation: 'Altered Operator: The original middle term is -4x, so it is -4(-3).'
          }
        ],
        hint: 'Write: 2(-3)^2 - 4(-3) + 5.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Calculate (-3)^2 = 9 and -4 * (-3) = +12 according to order of operations.',
        expectedAnswer: '18 + 12 + 5',
        options: [
          {
            id: 'opt_2a',
            text: '18 + 12 + 5',
            isCorrect: true,
            explanation: 'Great! 2 * 9 = 18 and (-4) * (-3) = +12. Both terms become positive.'
          },
          {
            id: 'opt_2b',
            text: '-18 - 12 + 5',
            isCorrect: false,
            explanation: 'Negative Squaring Trap: (-3)^2 is (-3)*(-3) = +9 (positive!). Multiplied by 2, it gives +18, not -18.'
          },
          {
            id: 'opt_2c',
            text: '18 - 12 + 5',
            isCorrect: false,
            explanation: 'Double Negative Trap: -4 * (-3) is a negative times a negative, which produces POSITIVE 12 (+12).'
          },
          {
            id: 'opt_2d',
            text: '36 + 12 + 5',
            isCorrect: false,
            explanation: 'Order of Operations Trap: You multiplied 2 * (-3) first to get -6, and then squared it to 36. Under BODMAS, evaluate the exponent FIRST: (-3)^2 = 9, then 2 * 9 = 18.'
          }
        ],
        hint: '(-3)^2 is +9. 2 * 9 = 18. -4 * (-3) = +12.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Add the terms to find the final numerical value.',
        expectedAnswer: '35',
        options: [
          {
            id: 'opt_3a',
            text: '35',
            isCorrect: true,
            explanation: 'Brilliant! 18 + 12 + 5 = 35. Complete evaluation verified.'
          },
          {
            id: 'opt_3b',
            text: '11',
            isCorrect: false,
            explanation: 'Sign Arithmetic Trap: If you subtracted 12 (18 - 12 + 5), you get 11. But remember the middle term is +12: 18 + 12 = 30, and 30 + 5 = 35.'
          },
          {
            id: 'opt_3c',
            text: '25',
            isCorrect: false,
            explanation: 'Addition Mistake: 18 + 12 = 30. Then 30 + 5 = 35, not 25.'
          },
          {
            id: 'opt_3d',
            text: '-25',
            isCorrect: false,
            explanation: 'Negative Sign Error: All three numbers (18, 12, 5) are positive; their sum must be positive 35.'
          }
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
