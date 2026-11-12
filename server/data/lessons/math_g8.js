/**
 * CAPS Senior Phase Mathematics — Grade 8
 * Modules:
 * 1. Algebraic Expressions & Equations
 * 2. Euclidean Geometry (Straight Lines & Triangles)
 * 3. Financial Mathematics (Simple Interest & Hire Purchase)
 */

export const MATH_GRADE_8_PROBLEMS = [
  // --- MODULE 1: ALGEBRAIC EXPRESSIONS & EQUATIONS ---
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

  // --- MODULE 2: EUCLIDEAN GEOMETRY (STRAIGHT LINES & TRIANGLES) ---
  {
    id: 'g8_geom_01',
    grade: 'Grade 8',
    topic: 'Euclidean Geometry',
    subtopic: 'Geometry of Straight Lines',
    title: 'Supplementary Angles on a Straight Line',
    questionText: 'Adjacent angles on a straight line AB are given as (3x + 10)° and (2x + 20)°. Set up the equation, solve for x, and state the formal CAPS geometric reason.',
    latexExpression: '(3x + 10^\\circ) + (2x + 20^\\circ) = 180^\\circ \\quad [\\angle\\text{s on a straight line}]',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.4',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Set up the geometric equation for adjacent angles on straight line AB, stating the CAPS reason.',
        expectedAnswer: '(3x + 10) + (2x + 20) = 180',
        options: [
          {
            id: 'opt_1a',
            text: '(3x + 10) + (2x + 20) = 180  [∠s on a straight line]',
            isCorrect: true,
            explanation: 'Correct! Angles lying adjacent on a continuous straight line sum to 180° (supplementary).'
          },
          {
            id: 'opt_1b',
            text: '(3x + 10) + (2x + 20) = 90  [complementary ∠s]',
            isCorrect: false,
            explanation: 'Complementary Angle Trap: Complementary angles sum to 90° (a right angle), but angles on a straight line are supplementary and sum to 180°.'
          },
          {
            id: 'opt_1c',
            text: '3x + 10 = 2x + 20  [vertically opposite ∠s]',
            isCorrect: false,
            explanation: 'Vertically Opposite Trap: Vertically opposite angles are across from each other at an intersection X, not adjacent along a single straight line.'
          },
          {
            id: 'opt_1d',
            text: '(3x + 10) + (2x + 20) = 360  [∠s around a point]',
            isCorrect: false,
            explanation: 'Revolution Trap: 360° is the sum of angles forming a full revolution around a point, not a straight line.'
          }
        ],
        hint: 'Angles on a straight line add up to 180°.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Collect like terms (3x + 2x and 10 + 20) and solve for x.',
        expectedAnswer: 'x = 30',
        options: [
          {
            id: 'opt_2a',
            text: 'x = 30',
            isCorrect: true,
            explanation: 'Spot on! 5x + 30 = 180 => 5x = 150 => x = 150 / 5 = 30.'
          },
          {
            id: 'opt_2b',
            text: 'x = 42',
            isCorrect: false,
            explanation: 'Transposition Error: You added 30 to 180 (210 / 5 = 42). Remember to SUBTRACT 30 from 180: 180 - 30 = 150.'
          },
          {
            id: 'opt_2c',
            text: 'x = 25',
            isCorrect: false,
            explanation: 'Arithmetic division error: 150 / 5 = 30, not 25.'
          },
          {
            id: 'opt_2d',
            text: 'x = 12',
            isCorrect: false,
            explanation: 'Used 90° instead of 180°: 90 - 30 = 60 / 5 = 12. Remember straight line angles sum to 180°.'
          }
        ],
        hint: '5x + 30 = 180 => 5x = 150 => x = 30.'
      }
    ],
    solution: [
      '(3x + 10°) + (2x + 20°) = 180°  [∠s on a straight line]',
      '5x + 30° = 180°',
      '5x = 180° - 30° = 150°',
      'x = 150° / 5 = 30°',
      'First angle: 3(30°) + 10° = 100°',
      'Second angle: 2(30°) + 20° = 80°',
      'Check: 100° + 80° = 180°'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Geometric Reason: Adjacent angles on a straight line are supplementary and always sum to 180°. DBE CAPS reason code: [∠s on a straight line].'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Write: (3x + 10) + (2x + 20) = 180. Combine terms: 5x + 30 = 180. Subtract 30, then divide by 5.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) 5x + 30° = 180° [∠s on straight line]\n2) 5x = 150°\n3) x = 30°'
      }
    ]
  },
  {
    id: 'g8_geom_02',
    grade: 'Grade 8',
    topic: 'Euclidean Geometry',
    subtopic: 'Triangle Angle Sum & Exterior Angles',
    title: 'Interior Angle Sum of a Triangle',
    questionText: 'In triangle ABC, angle A = 55° and angle B = 65°. Calculate the size of interior angle C, stating the required CAPS geometric reason.',
    latexExpression: '\\angle A + \\angle B + \\angle C = 180^\\circ \\quad [\\text{sum of } \\angle\\text{s in } \\triangle]',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.4',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Set up the interior angle sum equation for triangle ABC with the formal geometric reason.',
        expectedAnswer: '55 + 65 + C = 180',
        options: [
          {
            id: 'opt_1a',
            text: '55° + 65° + ∠C = 180°  [sum of ∠s in Δ]',
            isCorrect: true,
            explanation: 'Correct! The sum of the interior angles of any triangle is always 180°.'
          },
          {
            id: 'opt_1b',
            text: '55° + 65° + ∠C = 360°  [sum of ∠s in quad]',
            isCorrect: false,
            explanation: 'Quadrilateral Trap: 360° is the sum of angles in a 4-sided polygon (quadrilateral), not a triangle.'
          },
          {
            id: 'opt_1c',
            text: '∠C = 55° + 65°  [exterior ∠ of Δ]',
            isCorrect: false,
            explanation: 'Exterior Angle Confusion: The exterior angle equals the sum of two opposite interior angles, but ∠C is an INTERIOR angle of the triangle.'
          },
          {
            id: 'opt_1d',
            text: '55° + 65° + ∠C = 90°  [complementary ∠s]',
            isCorrect: false,
            explanation: 'Right Angle Trap: Triangles have an angle sum of 180°, never 90°.'
          }
        ],
        hint: 'The three interior angles of a triangle add up to 180°.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Add the known angles (55° + 65°) and subtract from 180° to find ∠C.',
        expectedAnswer: '∠C = 60°',
        options: [
          {
            id: 'opt_2a',
            text: '∠C = 60°',
            isCorrect: true,
            explanation: 'Excellent! 55° + 65° = 120°. Then 180° - 120° = 60°.'
          },
          {
            id: 'opt_2b',
            text: '∠C = 70°',
            isCorrect: false,
            explanation: 'Addition Error: 55 + 65 = 120 (not 110). 180 - 120 = 60°.'
          },
          {
            id: 'opt_2c',
            text: '∠C = 120°',
            isCorrect: false,
            explanation: 'Incomplete Calculation: 120° is the sum of angles A and B; you must subtract this sum from 180°.'
          },
          {
            id: 'opt_2d',
            text: '∠C = 50°',
            isCorrect: false,
            explanation: 'Subtraction Error: 180 - 120 = 60°, not 50°.'
          }
        ],
        hint: '180° - (55° + 65°) = 180° - 120° = 60°.'
      }
    ],
    solution: [
      '∠A + ∠B + ∠C = 180°  [sum of ∠s in Δ]',
      '55° + 65° + ∠C = 180°',
      '120° + ∠C = 180°',
      '∠C = 180° - 120° = 60°'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'The sum of the three interior angles of any Euclidean triangle is always 180°. CAPS Reason: [sum of ∠s in Δ].'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'First add 55° and 65° to get 120°. Then find what is needed to reach 180°.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '∠C = 180° - 120° = 60° [sum of ∠s in Δ]'
      }
    ]
  },

  // --- MODULE 3: FINANCIAL MATHEMATICS (SIMPLE INTEREST & HIRE PURCHASE) ---
  {
    id: 'g8_fin_01',
    grade: 'Grade 8',
    topic: 'Financial Mathematics',
    subtopic: 'Simple Interest Calculations',
    title: 'Calculating Accumulated Amount with Simple Interest',
    questionText: 'Thabo deposits R4 000 into a fixed deposit account at a simple interest rate of 7.5% per annum for 3 years. Calculate the total accumulated amount (A) at the end of the term.',
    latexExpression: 'A = P(1 + i \\cdot n) \\quad \\text{where } P = \\text{R}4\\,000,\\; i = 0.075,\\; n = 3',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.5',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Identify the interest rate in decimal form (i = r / 100) and choose the correct formula.',
        expectedAnswer: 'i = 0.075 and A = P(1 + in)',
        options: [
          {
            id: 'opt_1a',
            text: 'i = 0.075 and A = P(1 + in)',
            isCorrect: true,
            explanation: 'Correct! Percent means per hundred: 7.5 / 100 = 0.075.'
          },
          {
            id: 'opt_1b',
            text: 'i = 7.5 and A = P(1 + in)',
            isCorrect: false,
            explanation: 'Percentage Conversion Trap: You must divide the percentage rate by 100 before using it in formulas! Using 7.5 will yield an interest of 750%!'
          },
          {
            id: 'opt_1c',
            text: 'i = 0.75 and A = P(1 + in)',
            isCorrect: false,
            explanation: 'Decimal Shift Trap: 7.5% is 7.5 / 100 = 0.075, not 0.75 (which would be 75%).'
          },
          {
            id: 'opt_1d',
            text: 'i = 0.075 and A = P(1 + i)^n',
            isCorrect: false,
            explanation: 'Formula Confusion: A = P(1 + i)^n is for COMPOUND interest (Grade 9+). The problem specifies SIMPLE interest: A = P(1 + in).'
          }
        ],
        hint: 'i = 7.5 / 100 = 0.075.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Calculate the simple interest earned (I = P * i * n).',
        expectedAnswer: 'I = R900',
        options: [
          {
            id: 'opt_2a',
            text: 'I = R900',
            isCorrect: true,
            explanation: 'Spot on! I = 4 000 * 0.075 * 3 = 4 000 * 0.225 = R900 interest earned.'
          },
          {
            id: 'opt_2b',
            text: 'I = R300',
            isCorrect: false,
            explanation: 'Single Year Trap: R300 is the interest for only 1 year (4 000 * 0.075). You must multiply by 3 years: 300 * 3 = R900.'
          },
          {
            id: 'opt_2c',
            text: 'I = R9 000',
            isCorrect: false,
            explanation: 'Decimal Error: Did you use 0.75 instead of 0.075? 4 000 * 0.075 * 3 = R900.'
          },
          {
            id: 'opt_2d',
            text: 'I = R90 000',
            isCorrect: false,
            explanation: 'Used un-converted rate 7.5: 4 000 * 7.5 * 3 = R90 000. Always divide by 100 first!'
          }
        ],
        hint: 'I = 4 000 * 0.075 * 3 = R900.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Calculate the total accumulated final amount (A = P + I).',
        expectedAnswer: 'A = R4 900',
        options: [
          {
            id: 'opt_3a',
            text: 'A = R4 900',
            isCorrect: true,
            explanation: 'Excellent! Total accumulated amount = Principal + Interest = R4 000 + R900 = R4 900.'
          },
          {
            id: 'opt_3b',
            text: 'A = R900',
            isCorrect: false,
            explanation: 'Interest Only: R900 is just the interest earned. The accumulated amount includes the original R4 000 investment!'
          },
          {
            id: 'opt_3c',
            text: 'A = R4 300',
            isCorrect: false,
            explanation: 'Added only 1 year of interest: R4 000 + R300 = R4 300. The term was 3 years (R900 interest).'
          },
          {
            id: 'opt_3d',
            text: 'A = R13 000',
            isCorrect: false,
            explanation: 'Calculation Error: R4 000 + R900 = R4 900.'
          }
        ],
        hint: 'A = 4 000 + 900 = R4 900.'
      }
    ],
    solution: [
      'P = R4 000, i = 7.5% = 0.075, n = 3 years',
      'Simple Interest: I = P * i * n',
      'I = 4 000 * 0.075 * 3 = R900',
      'Total Amount: A = P + I = 4 000 + 900 = R4 900'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Simple interest is calculated solely on the original principal amount P: I = P * i * n, and Accumulated Amount A = P + I.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'First calculate 7.5% of R4 000 to find 1 year interest (R300). Multiply by 3 years to get R900. Add to R4 000.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) i = 0.075\n2) I = 4 000 * 0.075 * 3 = R900\n3) A = 4 000 + 900 = R4 900'
      }
    ]
  },
  {
    id: 'g8_fin_02',
    grade: 'Grade 8',
    topic: 'Financial Mathematics',
    subtopic: 'Hire Purchase Calculations',
    title: 'Hire Purchase Deposit and Monthly Instalments',
    questionText: 'A homeschool workstation costs R12 000 cash. Under hire purchase, the buyer pays a 15% cash deposit, and finances the remaining balance with 10% per annum simple interest over 2 years. Calculate the monthly instalment.',
    latexExpression: '\\text{Balance} = \\text{Cash Price} - \\text{Deposit},\\; A = \\text{Balance}(1 + i \\cdot n)',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.5',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Calculate the 15% deposit and the remaining balance owed.',
        expectedAnswer: 'Deposit = R1 800, Balance = R10 200',
        options: [
          {
            id: 'opt_1a',
            text: 'Deposit = R1 800, Balance = R10 200',
            isCorrect: true,
            explanation: 'Correct! 15% of R12 000 = 0.15 * 12 000 = R1 800. Remaining balance = 12 000 - 1 800 = R10 200.'
          },
          {
            id: 'opt_1b',
            text: 'Deposit = R1 200, Balance = R10 800',
            isCorrect: false,
            explanation: '10% vs 15% Error: R1 200 is 10% of R12 000, but the deposit is 15% (1.5 * 1 200 = R1 800).'
          },
          {
            id: 'opt_1c',
            text: 'Deposit = R1 800, Balance = R12 000',
            isCorrect: false,
            explanation: 'Deposit Deduction Omission: You must subtract the deposit from the cash price before calculating interest!'
          },
          {
            id: 'opt_1d',
            text: 'Deposit = R1 500, Balance = R10 500',
            isCorrect: false,
            explanation: 'Percentage Error: 15% of 12 000 is 1 800, not 1 500.'
          }
        ],
        hint: 'Deposit = 0.15 * 12 000 = R1 800. Balance = 12 000 - 1 800 = R10 200.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Calculate the total repayable amount A on the balance R10 200 at 10% simple interest over 2 years.',
        expectedAnswer: 'A = R12 240',
        options: [
          {
            id: 'opt_2a',
            text: 'A = R12 240',
            isCorrect: true,
            explanation: 'Spot on! Interest = 10 200 * 0.10 * 2 = R2 040. Total repayable = 10 200 + 2 040 = R12 240.'
          },
          {
            id: 'opt_2b',
            text: 'A = R14 400',
            isCorrect: false,
            explanation: 'Interest on Full Price Trap: You calculated interest on the full R12 000 (12 000 * 1.2 = 14 400). In hire purchase, interest is charged ONLY on the remaining balance after deposit (R10 200)!'
          },
          {
            id: 'opt_2c',
            text: 'A = R11 220',
            isCorrect: false,
            explanation: 'One Year Trap: 10 200 * 0.10 = R1 020 is only 1 year of interest. The agreement is for 2 years (R2 040 interest).'
          },
          {
            id: 'opt_2d',
            text: 'A = R2 040',
            isCorrect: false,
            explanation: 'Interest Only: R2 040 is only the interest. The total repayable amount is Balance + Interest = R12 240.'
          }
        ],
        hint: 'A = 10 200 * (1 + 0.10 * 2) = 10 200 * 1.20 = R12 240.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Calculate the monthly instalment over 2 years (24 months).',
        expectedAnswer: 'R510 per month',
        options: [
          {
            id: 'opt_3a',
            text: 'R510 per month',
            isCorrect: true,
            explanation: 'Brilliant! 2 years = 24 months. Total R12 240 / 24 months = R510 per month.'
          },
          {
            id: 'opt_3b',
            text: 'R6 120 per month',
            isCorrect: false,
            explanation: 'Annual vs Monthly Trap: You divided by 2 (years) instead of 24 (months)! The question asks for the monthly instalment.'
          },
          {
            id: 'opt_3c',
            text: 'R1 020 per month',
            isCorrect: false,
            explanation: 'Divided by 12 months: 2 years contains 24 months, so divide by 24, not 12.'
          },
          {
            id: 'opt_3d',
            text: 'R600 per month',
            isCorrect: false,
            explanation: 'Used Full Price: 14 400 / 24 = 600. Remember interest was on R10 200 balance, giving R510.'
          }
        ],
        hint: 'Divide total R12 240 by 24 months = R510/month.'
      }
    ],
    solution: [
      'Cash price = R12 000',
      'Deposit = 15% of R12 000 = R1 800',
      'Loan balance = R12 000 - R1 800 = R10 200',
      'Simple Interest = R10 200 * 0.10 * 2 = R2 040',
      'Total repayable = R10 200 + R2 040 = R12 240',
      'Number of monthly instalments = 2 * 12 = 24 months',
      'Monthly instalment = R12 240 / 24 = R510 per month'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Hire Purchase Steps: 1) Calculate deposit. 2) Subtract deposit from cash price to get balance. 3) Apply simple interest to balance. 4) Divide total by number of months.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Deposit is R1 800, leaving R10 200. At 10% for 2 years, total is R10 200 * 1.20 = R12 240. Divide R12 240 by 24 months.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) Balance = R10 200\n2) Total = R10 200 * 1.20 = R12 240\n3) Monthly = R12 240 / 24 = R510'
      }
    ]
  }
];
