/**
 * CAPS Senior Phase Mathematics — Grade 9
 * Modules:
 * 1. Exponents & Factorisation
 * 2. Euclidean Geometry (Pythagoras, Parallel Lines & Triangle Congruency)
 * 3. Financial Mathematics (Compound Interest & Inflation)
 * 
 * Misconception-Driven Multiple-Choice Question (MCQ) Engine
 * Distractors focus on notorious South African CAPS Senior Phase traps:
 * - Exponent multiplication trap: x^a * x^b -> x^(a*b) instead of x^(a+b)
 * - Exponent division trap: x^a / x^b -> x^(a/b) instead of x^(a-b)
 * - DOTS coefficient square root trap: 4x^2 - 49 -> (4x - 7)(4x + 7) (forgetting sqrt(4) = 2)
 * - Pythagoras direct sum trap: PR = PQ + QR without squaring sides
 * - Parallel lines co-interior trap: assuming co-interior angles are equal instead of supplementary (180°)
 * - Triangle congruency trap: confusing SSA (non-included angle) with valid SAS
 * - Compound interest vs Simple interest trap: neglecting compounding on accrued interest
 * - Inflation percentage decimal trap: using i = 5 instead of i = 0.05
 */

export const MATH_GRADE_9_PROBLEMS = [
  // --- MODULE 1: EXPONENTS & FACTORISATION ---
  {
    id: 'g9_exp_01',
    grade: 'Grade 9',
    topic: 'Exponents & Factorisation',
    subtopic: 'Laws of Exponents (Multiplication & Division)',
    title: 'Simplifying Algebraic Exponential Fractions',
    questionText: 'Simplify the exponential expression fully: (3x^4 * 4x^3) / (2x^2)',
    latexExpression: '\\frac{3x^4 \\cdot 4x^3}{2x^2}',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.1 & 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Simplify the numerator: multiply the numbers (3 * 4) and apply the Product Law of exponents to x^4 * x^3.',
        expectedAnswer: '12x^7 / (2x^2)',
        options: [
          {
            id: 'opt_1a',
            text: '12x^7 / (2x^2)',
            isCorrect: true,
            explanation: 'Correct! Coefficients multiply: 3 * 4 = 12. For like bases, exponents ADD: 4 + 3 = 7. So the numerator is 12x^7.'
          },
          {
            id: 'opt_1b',
            text: '12x^12 / (2x^2)',
            isCorrect: false,
            explanation: 'Exponent Product Trap: When multiplying powers with the same base (x^4 * x^3), you must ADD the exponents (4 + 3 = 7), NOT multiply them (4 * 3 = 12)! You only multiply exponents when raising a power to a power: (x^4)^3 = x^12.'
          },
          {
            id: 'opt_1c',
            text: '7x^7 / (2x^2)',
            isCorrect: false,
            explanation: 'Coefficient Addition Trap: You added the coefficients 3 + 4 = 7. The operation between 3 and 4 is multiplication: 3 * 4 = 12.'
          },
          {
            id: 'opt_1d',
            text: '12x^1 / (2x^2)',
            isCorrect: false,
            explanation: 'Exponent Subtraction Trap: You subtracted the exponents 4 - 3 = 1. Subtraction is used for division, but the numerator is a multiplication (x^4 * x^3).'
          }
        ],
        hint: 'Product Law: x^a * x^b = x^(a + b). Calculate: 3 * 4 = 12 and 4 + 3 = 7.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Divide the coefficients (12 / 2) and apply the Quotient Law to the variables (x^7 / x^2).',
        expectedAnswer: '6x^5',
        options: [
          {
            id: 'opt_2a',
            text: '6x^5',
            isCorrect: true,
            explanation: 'Spot on! 12 / 2 = 6, and Quotient Law subtracts exponents: 7 - 2 = 5. Result: 6x^5.'
          },
          {
            id: 'opt_2b',
            text: '6x^3.5',
            isCorrect: false,
            explanation: 'Exponent Division Trap: You divided the exponents 7 / 2 = 3.5. Remember: when dividing like bases, SUBTRACT the exponents (7 - 2 = 5), do not divide them!'
          },
          {
            id: 'opt_2c',
            text: '10x^5',
            isCorrect: false,
            explanation: 'Coefficient Subtraction Trap: You subtracted 12 - 2 = 10. The numbers are in a fraction; perform regular division: 12 / 2 = 6.'
          },
          {
            id: 'opt_2d',
            text: '6x^9',
            isCorrect: false,
            explanation: 'Exponents Added in Division: You added 7 + 2 = 9. Because x^2 is in the denominator, you subtract: 7 - 2 = 5.'
          }
        ],
        hint: '12 / 2 = 6, and 7 - 2 = 5.'
      }
    ],
    solution: [
      '(3x^4 * 4x^3) / (2x^2)',
      '= (12x^(4 + 3)) / (2x^2)',
      '= (12x^7) / (2x^2)',
      '= (12 / 2) * x^(7 - 2)',
      '= 6x^5'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Laws of Exponents: When multiplying like bases, add exponents: x^a * x^b = x^(a+b). When dividing like bases, subtract exponents: x^a / x^b = x^(a-b).'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'First simplify the numerator: 3 * 4 = 12, and x^4 * x^3 = x^7. So the fraction is 12x^7 / 2x^2. Then divide: 12/2 = 6, and x^(7-2) = x^5.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) Numerator: 3 * 4 = 12, x^(4+3) = x^7 => 12x^7\n2) Divide by denominator: 12x^7 / 2x^2\n3) Coefficients: 12 / 2 = 6\n4) Exponents: 7 - 2 = 5\nFinal Answer: 6x^5'
      }
    ]
  },
  {
    id: 'g9_fact_02',
    grade: 'Grade 9',
    topic: 'Exponents & Factorisation',
    subtopic: 'Highest Common Factor (HCF)',
    title: 'Factorising by Common Monomial Factor',
    questionText: 'Factorise fully by taking out the highest common factor (HCF): 6x^3y - 9x^2y^2',
    latexExpression: '6x^3y - 9x^2y^2',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Identify the Highest Common Factor (HCF) among the coefficients (6, 9) and variable powers (x^3, x^2 and y, y^2).',
        expectedAnswer: '3x^2y',
        options: [
          {
            id: 'opt_1a',
            text: '3x^2y',
            isCorrect: true,
            explanation: 'Correct! HCF(6, 9) = 3. Lowest power of x is x^2, and lowest power of y is y^1.'
          },
          {
            id: 'opt_1b',
            text: '3xy',
            isCorrect: false,
            explanation: 'Incomplete Factorisation: While 3xy is a common factor, both terms have at least x^2. The HIGHEST common factor is 3x^2y.'
          },
          {
            id: 'opt_1c',
            text: '9x^3y^2',
            isCorrect: false,
            explanation: 'LCM vs HCF Confusion: 9x^3y^2 contains powers that the other term does not have (6 does not divide 9, and the first term only has y^1, not y^2).'
          },
          {
            id: 'opt_1d',
            text: '3x^3y',
            isCorrect: false,
            explanation: 'Power Exceeded Trap: The second term only contains x^2, so x^3 cannot be factored out from both.'
          }
        ],
        hint: 'HCF of 6 and 9 is 3. Lowest power of x is x^2, lowest power of y is y.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Divide each term by the HCF 3x^2y and write in the form HCF(quotient).',
        expectedAnswer: '3x^2y(2x - 3y)',
        options: [
          {
            id: 'opt_2a',
            text: '3x^2y(2x - 3y)',
            isCorrect: true,
            explanation: 'Spot on! 6x^3y / (3x^2y) = 2x, and -9x^2y^2 / (3x^2y) = -3y.'
          },
          {
            id: 'opt_2b',
            text: '3x^2y(2 - 3)',
            isCorrect: false,
            explanation: 'Dropped Variables Trap: When dividing 6x^3y by 3x^2y, an x remains (x^3 / x^2 = x). When dividing -9x^2y^2 by 3x^2y, a y remains.'
          },
          {
            id: 'opt_2c',
            text: '3x^2y(2x + 3y)',
            isCorrect: false,
            explanation: 'Sign Error: The second term in the original expression is negative (-9x^2y^2), so the term inside the bracket must be -3y, not +3y.'
          },
          {
            id: 'opt_2d',
            text: '(2x - 3y)',
            isCorrect: false,
            explanation: 'Missing HCF: You found the quotient inside the bracket, but factorising requires showing the HCF outside: 3x^2y(2x - 3y).'
          }
        ],
        hint: '6x^3y / (3x^2y) = 2x, and -9x^2y^2 / (3x^2y) = -3y.'
      }
    ],
    solution: [
      '6x^3y - 9x^2y^2',
      'HCF = 3x^2y',
      'First term quotient: 6x^3y / 3x^2y = 2x',
      'Second term quotient: -9x^2y^2 / 3x^2y = -3y',
      '= 3x^2y(2x - 3y)'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'To factorise by HCF, find the greatest numerical factor and the lowest exponent for each common variable. Factorise as HCF * (remainder).'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'The HCF of 6 and 9 is 3. Between x^3 and x^2, the common factor is x^2. Between y and y^2, the common factor is y. So HCF is 3x^2y. Divide both terms by 3x^2y to get what stays inside the bracket.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) HCF = 3x^2y\n2) Divide 6x^3y by 3x^2y = 2x\n3) Divide -9x^2y^2 by 3x^2y = -3y\nFinal Factorised Form: 3x^2y(2x - 3y)'
      }
    ]
  },
  {
    id: 'g9_fact_03',
    grade: 'Grade 9',
    topic: 'Exponents & Factorisation',
    subtopic: 'Difference of Two Squares (DOTS)',
    title: 'Factorising Difference of Two Squares',
    questionText: 'Factorise fully using the difference of two squares: 4x^2 - 49',
    latexExpression: '4x^2 - 49',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Identify the square roots of both terms: sqrt(4x^2) and sqrt(49).',
        expectedAnswer: '2x and 7',
        options: [
          {
            id: 'opt_1a',
            text: '2x and 7',
            isCorrect: true,
            explanation: 'Correct! sqrt(4x^2) = 2x, and sqrt(49) = 7.'
          },
          {
            id: 'opt_1b',
            text: '4x and 7',
            isCorrect: false,
            explanation: 'Unsquared Coefficient Trap: You took the square root of x^2 to get x, but forgot to take the square root of 4! sqrt(4) = 2, so the term is 2x, not 4x.'
          },
          {
            id: 'opt_1c',
            text: '2x and 49',
            isCorrect: false,
            explanation: 'Unsquared Constant: Remember to take the square root of 49 as well: sqrt(49) = 7.'
          },
          {
            id: 'opt_1d',
            text: '16x and 7',
            isCorrect: false,
            explanation: 'Squaring instead of Square Root: 4 squared is 16, but we need the SQUARE ROOT of 4, which is 2.'
          }
        ],
        hint: 'sqrt(4) = 2, sqrt(x^2) = x, and sqrt(49) = 7.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Apply the identity a^2 - b^2 = (a - b)(a + b) to write the factorised binomials.',
        expectedAnswer: '(2x - 7)(2x + 7)',
        options: [
          {
            id: 'opt_2a',
            text: '(2x - 7)(2x + 7)',
            isCorrect: true,
            explanation: 'Great! (2x - 7)(2x + 7) expands to 4x^2 + 14x - 14x - 49 = 4x^2 - 49.'
          },
          {
            id: 'opt_2b',
            text: '(2x - 7)^2',
            isCorrect: false,
            explanation: 'Square of a Binomial Trap: (2x - 7)^2 = (2x - 7)(2x - 7) = 4x^2 - 28x + 49! It introduces a middle term (-28x) and a positive 49. Difference of two squares must have ONE minus and ONE plus.'
          },
          {
            id: 'opt_2c',
            text: '(4x - 7)(4x + 7)',
            isCorrect: false,
            explanation: 'Coefficient Trap: If you expand (4x - 7)(4x + 7), you get 16x^2 - 49, not 4x^2 - 49. Use 2x, not 4x.'
          },
          {
            id: 'opt_2d',
            text: '(2x + 7)^2',
            isCorrect: false,
            explanation: 'Sum Squared Trap: (2x + 7)^2 = 4x^2 + 28x + 49. Difference of squares requires opposite signs: (2x - 7)(2x + 7).'
          }
        ],
        hint: 'Use (2x - 7) and (2x + 7).'
      }
    ],
    solution: [
      '4x^2 - 49',
      '= (2x)^2 - (7)^2',
      '= (2x - 7)(2x + 7)'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Difference of Two Squares identity: a^2 - b^2 = (a - b)(a + b). It only applies when two perfect squares are separated by a minus sign.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'The square root of 4x^2 is 2x. The square root of 49 is 7. Put them into two binomial factors: one with a minus and one with a plus.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) 4x^2 is the square of 2x\n2) 49 is the square of 7\n3) Write in the form (a - b)(a + b):\nAnswer: (2x - 7)(2x + 7)'
      }
    ]
  },
  {
    id: 'g9_fact_04',
    grade: 'Grade 9',
    topic: 'Exponents & Factorisation',
    subtopic: 'Quadratic Trinomials (x^2 + bx + c)',
    title: 'Factorising a Quadratic Trinomial',
    questionText: 'Factorise the quadratic trinomial: x^2 + 7x + 12',
    latexExpression: 'x^2 + 7x + 12',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.2',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Find two integers that multiply to give the constant term +12, and add to give the middle coefficient +7.',
        expectedAnswer: '3 and 4',
        options: [
          {
            id: 'opt_1a',
            text: '3 and 4',
            isCorrect: true,
            explanation: 'Correct! 3 * 4 = 12, and 3 + 4 = 7. Both conditions are satisfied.'
          },
          {
            id: 'opt_1b',
            text: '6 and 2',
            isCorrect: false,
            explanation: 'Sum Mismatch Trap: 6 * 2 = 12, but 6 + 2 = 8, NOT 7! We need two factors that sum to the middle coefficient 7.'
          },
          {
            id: 'opt_1c',
            text: '1 and 12',
            isCorrect: false,
            explanation: 'Sum Mismatch: 1 * 12 = 12, but 1 + 12 = 13 (not 7).'
          },
          {
            id: 'opt_1d',
            text: '-3 and -4',
            isCorrect: false,
            explanation: 'Sign Trap: (-3) * (-4) = +12, but (-3) + (-4) = -7. The middle term is +7, so both numbers must be positive (+3 and +4).'
          }
        ],
        hint: 'Factors of 12: (1, 12), (2, 6), (3, 4). Which pair adds to 7?'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Write the expression as the product of two binomials: (x + p)(x + q).',
        expectedAnswer: '(x + 3)(x + 4)',
        options: [
          {
            id: 'opt_2a',
            text: '(x + 3)(x + 4)',
            isCorrect: true,
            explanation: 'Brilliant! (x + 3)(x + 4) expands to x^2 + 4x + 3x + 12 = x^2 + 7x + 12.'
          },
          {
            id: 'opt_2b',
            text: '(x - 3)(x - 4)',
            isCorrect: false,
            explanation: 'Sign Error: (x - 3)(x - 4) expands to x^2 - 7x + 12, which has a negative middle term.'
          },
          {
            id: 'opt_2c',
            text: '(x + 6)(x + 2)',
            isCorrect: false,
            explanation: 'Incorrect Factors: Expanding gives x^2 + 8x + 12, but our middle term is 7x.'
          },
          {
            id: 'opt_2d',
            text: '(x + 7)(x + 12)',
            isCorrect: false,
            explanation: 'Coefficient Direct Insertion Trap: You directly placed 7 and 12 into the brackets. Factorising requires finding factors of 12 that add to 7, which are 3 and 4.'
          }
        ],
        hint: 'Use the two numbers found: (x + 3)(x + 4).'
      }
    ],
    solution: [
      'x^2 + 7x + 12',
      'Pairs of factors for 12: (1, 12), (2, 6), (3, 4)',
      '3 * 4 = 12 and 3 + 4 = 7',
      '= (x + 3)(x + 4)'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Trinomial factoring for x^2 + bx + c: Look for two numbers p and q such that p * q = c and p + q = b. Then factorise as (x + p)(x + q).'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'List the factors of 12: 1 and 12 (sum 13), 2 and 6 (sum 8), 3 and 4 (sum 7). Since 3 + 4 = 7, the two numbers are +3 and +4.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) Factors of 12 that add to 7 are +3 and +4 (3 * 4 = 12, 3 + 4 = 7)\n2) Put into brackets: (x + 3)(x + 4)\nVerification: (x+3)(x+4) = x^2 + 4x + 3x + 12 = x^2 + 7x + 12.'
      }
    ]
  },

  // --- MODULE 2: EUCLIDEAN GEOMETRY ---
  {
    id: 'g9_geom_01',
    grade: 'Grade 9',
    topic: 'Euclidean Geometry',
    subtopic: 'Theorem of Pythagoras',
    title: 'Calculating Hypotenuse in Right-Angled Triangle',
    questionText: 'In triangle PQR, angle Q = 90°, side PQ = 8 cm, and QR = 15 cm. Calculate the length of the hypotenuse PR with the correct geometric reason.',
    latexExpression: 'PR^2 = PQ^2 + QR^2',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.3',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: State the Theorem of Pythagoras relation and geometric reason for hypotenuse PR.',
        expectedAnswer: 'PR^2 = PQ^2 + QR^2 [Pythagoras]',
        options: [
          {
            id: 'opt_1a',
            text: 'PR^2 = PQ^2 + QR^2 [Pythagoras]',
            isCorrect: true,
            explanation: 'Correct! In any right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. Reason: [Pythagoras].'
          },
          {
            id: 'opt_1b',
            text: 'PR = PQ + QR [sum of sides]',
            isCorrect: false,
            explanation: 'Direct Addition Trap: Side lengths cannot be added directly without squaring! By the triangle inequality and Pythagoras, PR is sqrt(8^2 + 15^2) = 17 cm, whereas 8 + 15 = 23 cm.'
          },
          {
            id: 'opt_1c',
            text: 'PR^2 = QR^2 - PQ^2 [Pythagoras]',
            isCorrect: false,
            explanation: 'Subtraction Trap: You subtracted the side squares! Subtraction is only used when finding a shorter side (e.g. PQ^2 = PR^2 - QR^2). To find the longest side (hypotenuse PR opposite 90°), you ADD the squares.'
          },
          {
            id: 'opt_1d',
            text: 'PR^2 = PQ^2 + QR^2 (no reason given)',
            isCorrect: false,
            explanation: 'Reason Omission Trap: Under CAPS assessment guidelines, a geometric statement without its formal geometric reason receives zero marks!'
          }
        ],
        hint: 'Hypotenuse opposite the 90° angle: PR^2 = PQ^2 + QR^2 [Pythagoras].'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Substitute PQ = 8 cm and QR = 15 cm to calculate PR^2.',
        expectedAnswer: 'PR^2 = 289',
        options: [
          {
            id: 'opt_2a',
            text: 'PR^2 = 289',
            isCorrect: true,
            explanation: 'Spot on! 8^2 = 64, and 15^2 = 225. 64 + 225 = 289.'
          },
          {
            id: 'opt_2b',
            text: 'PR^2 = 46',
            isCorrect: false,
            explanation: 'Multiplication by 2 Trap: You calculated 8 * 2 = 16 and 15 * 2 = 30 (16 + 30 = 46). Squaring means multiplying a number by itself: 8 * 8 = 64 and 15 * 15 = 225.'
          },
          {
            id: 'opt_2c',
            text: 'PR^2 = 161',
            isCorrect: false,
            explanation: 'Subtracted Squares: 225 - 64 = 161. For the hypotenuse, you must ADD the squares: 225 + 64 = 289.'
          },
          {
            id: 'opt_2d',
            text: 'PR^2 = 79',
            isCorrect: false,
            explanation: 'Single Squaring Trap: You squared 8 (64) but forgot to square 15 (64 + 15 = 79). Both sides must be squared!'
          }
        ],
        hint: '8^2 = 64 and 15^2 = 225. 64 + 225 = 289.'
      },
      {
        stepNumber: 3,
        prompt: 'Step 3: Take the square root of both sides to find the length of hypotenuse PR.',
        expectedAnswer: 'PR = 17 cm',
        options: [
          {
            id: 'opt_3a',
            text: 'PR = 17 cm',
            isCorrect: true,
            explanation: 'Brilliant! sqrt(289) = 17 cm. Hypotenuse PR is 17 cm.'
          },
          {
            id: 'opt_3b',
            text: 'PR = 289 cm',
            isCorrect: false,
            explanation: 'Forgotten Square Root: 289 is PR^2 (the square of the hypotenuse). To get the side length PR, you must take the square root: sqrt(289) = 17 cm.'
          },
          {
            id: 'opt_3c',
            text: 'PR = 144.5 cm',
            isCorrect: false,
            explanation: 'Halving instead of Square Root: You divided 289 by 2 to get 144.5. You must find the number whose square is 289, which is 17 (17 * 17 = 289).'
          },
          {
            id: 'opt_3d',
            text: 'PR = 23 cm',
            isCorrect: false,
            explanation: 'Direct Side Addition: 23 is 8 + 15, which violates Pythagoras. The correct length is sqrt(289) = 17 cm.'
          }
        ],
        hint: 'Calculate sqrt(289) = 17.'
      }
    ],
    solution: [
      'In ΔPQR, ∠Q = 90°',
      'PR^2 = PQ^2 + QR^2  [Pythagoras]',
      'PR^2 = (8)^2 + (15)^2',
      'PR^2 = 64 + 225 = 289',
      'PR = sqrt(289)',
      'PR = 17 cm'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Theorem of Pythagoras: In a right-angled triangle, hypotenuse^2 = leg1^2 + leg2^2. Always cite the reason [Pythagoras].'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'The hypotenuse PR is opposite the 90° angle. Write PR^2 = 8^2 + 15^2. Calculate 64 + 225 = 289. Finally, take the square root.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) PR^2 = PQ^2 + QR^2 [Pythagoras]\n2) PR^2 = 8^2 + 15^2 = 64 + 225 = 289\n3) PR = sqrt(289) = 17 cm'
      }
    ]
  },
  {
    id: 'g9_geom_02',
    grade: 'Grade 9',
    topic: 'Euclidean Geometry',
    subtopic: 'Parallel Lines & Transversals',
    title: 'Co-Interior Angles on Parallel Lines',
    questionText: 'Given parallel lines AB || CD cut by transversal EF at points G and H. If angle AGH = 115°, calculate the size of co-interior angle GHD with the correct geometric reason.',
    latexExpression: '\\angle AGH + \\angle GHD = 180^\\circ \\quad [\\text{co-int } \\angle\\text{s}; AB \\parallel CD]',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.3',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Identify the geometric relationship and CAPS reason between angle AGH and angle GHD.',
        expectedAnswer: 'angle AGH + angle GHD = 180° [co-int ∠s; AB || CD]',
        options: [
          {
            id: 'opt_1a',
            text: 'angle AGH + angle GHD = 180° [co-int ∠s; AB || CD]',
            isCorrect: true,
            explanation: 'Correct! Co-interior angles on parallel lines form a "U" or "C" shape between the parallel lines on the same side of the transversal and are SUPPLEMENTARY (sum to 180°).'
          },
          {
            id: 'opt_1b',
            text: 'angle GHD = angle AGH = 115° [co-int ∠s; AB || CD]',
            isCorrect: false,
            explanation: 'Equal Co-interior Trap: Co-interior angles are NOT equal! Only alternate angles ("Z" shape) and corresponding angles ("F" shape) are equal. Co-interior angles add up to 180°.'
          },
          {
            id: 'opt_1c',
            text: 'angle AGH + angle GHD = 180° [alt ∠s; AB || CD]',
            isCorrect: false,
            explanation: 'Reason Confusion: Alternate angles are EQUAL, not supplementary! The angles that add to 180° inside parallel lines are co-interior angles.'
          },
          {
            id: 'opt_1d',
            text: 'angle AGH + angle GHD = 180° [co-int ∠s] (no parallel lines specified)',
            isCorrect: false,
            explanation: 'Missing Parallel Condition: In CAPS, co-interior angles are only supplementary IF lines are parallel. You must include the line names: [co-int ∠s; AB || CD].'
          }
        ],
        hint: 'Co-interior angles lie inside parallel lines on the same side of the transversal and add to 180°: [co-int ∠s; AB || CD].'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Substitute angle AGH = 115° and solve for angle GHD.',
        expectedAnswer: 'angle GHD = 65°',
        options: [
          {
            id: 'opt_2a',
            text: 'angle GHD = 65°',
            isCorrect: true,
            explanation: 'Spot on! 180° - 115° = 65°.'
          },
          {
            id: 'opt_2b',
            text: 'angle GHD = 115°',
            isCorrect: false,
            explanation: 'Equal Angle Trap: That would mean the two angles sum to 230°, which is impossible for co-interior angles on parallel lines.'
          },
          {
            id: 'opt_2c',
            text: 'angle GHD = 75°',
            isCorrect: false,
            explanation: 'Arithmetic Borrowing Error: 180 - 115 = 65, not 75 (115 + 75 = 190).'
          },
          {
            id: 'opt_2d',
            text: 'angle GHD = 295°',
            isCorrect: false,
            explanation: 'Addition instead of Subtraction: You added 180° + 115° = 295°. The two angles add to 180°, so subtract: 180° - 115° = 65°.'
          }
        ],
        hint: '180° - 115° = 65°.'
      }
    ],
    solution: [
      'AB || CD  [Given]',
      'angle AGH + angle GHD = 180°  [co-int ∠s; AB || CD]',
      '115° + angle GHD = 180°',
      'angle GHD = 180° - 115°',
      'angle GHD = 65°'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Parallel Lines Angle Rules: Alternate angles are equal [alt ∠s; ||]. Corresponding angles are equal [corr ∠s; ||]. Co-interior angles are supplementary (= 180°) [co-int ∠s; ||].'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Angles AGH and GHD are between AB and CD on the interior side. Set 115° + angle GHD = 180°. Solve by subtracting 115° from 180°.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) Statement & Reason: angle AGH + angle GHD = 180° [co-int ∠s; AB || CD]\n2) 115° + angle GHD = 180°\n3) angle GHD = 180° - 115° = 65°'
      }
    ]
  },
  {
    id: 'g9_geom_03',
    grade: 'Grade 9',
    topic: 'Euclidean Geometry',
    subtopic: 'Triangle Congruency Conditions',
    title: 'Proving Triangle Congruency (SAS Condition)',
    questionText: 'In triangles ABC and DEF, it is given that AB = DE = 7 cm, BC = EF = 10 cm, and included angle B = angle E = 52°. Identify whether the triangles are congruent and state the rigorous CAPS congruency condition.',
    latexExpression: '\\Delta ABC \\equiv \\Delta DEF \\quad [\\text{SAS}]',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.3',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Check whether the equal angle is the strictly INCLUDED angle between the two given pairs of equal sides.',
        expectedAnswer: 'Yes, angle B is between sides AB and BC, and angle E is between sides DE and EF',
        options: [
          {
            id: 'opt_1a',
            text: 'Yes, angle B is between sides AB and BC, and angle E is between sides DE and EF',
            isCorrect: true,
            explanation: 'Correct! Angle B is formed where sides AB and BC meet. Angle E is formed where sides DE and EF meet. Thus both are the strictly included angle (SAS).'
          },
          {
            id: 'opt_1b',
            text: 'No, the position of the angle does not matter; any two sides and any angle prove congruency (SSA)',
            isCorrect: false,
            explanation: 'SSA Trap: SSA (Side-Side-Angle) is NOT a valid congruency condition! If the angle is not strictly included between the two sides, two completely different triangles can be formed (ambiguous case).'
          },
          {
            id: 'opt_1c',
            text: 'No, congruency can only be proved if all three sides are known (SSS)',
            isCorrect: false,
            explanation: 'Exclusivity Fallacy: SSS is one of four valid conditions, but SAS (Side, Included Angle, Side) is equally valid and rigorously accepted.'
          },
          {
            id: 'opt_1d',
            text: 'No, the angles must be 90° for any congruency proof to work',
            isCorrect: false,
            explanation: 'RHS Confusion: RHS (Right-angle, Hypotenuse, Side) specifically requires a 90° angle, but SAS applies to ANY triangle with an included angle.'
          }
        ],
        hint: 'Look at the letters: side AB and side BC meet at vertex B, so angle B is the included angle.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: State the formal congruency conclusion with the correct CAPS condition.',
        expectedAnswer: 'ΔABC ≡ ΔDEF [SAS]',
        options: [
          {
            id: 'opt_2a',
            text: 'ΔABC ≡ ΔDEF [SAS]',
            isCorrect: true,
            explanation: 'Spot on! Two sides and the included angle are equal, so ΔABC ≡ ΔDEF [SAS].'
          },
          {
            id: 'opt_2b',
            text: 'ΔABC ≡ ΔDEF [SSS]',
            isCorrect: false,
            explanation: 'Condition Mismatch: Only two pairs of sides were given (AB=DE, BC=EF), not the third side (AC=DF). You cannot state SSS.'
          },
          {
            id: 'opt_2c',
            text: 'ΔABC ≡ ΔDEF [AAS]',
            isCorrect: false,
            explanation: 'Condition Mismatch: AAS requires two pairs of equal angles and one pair of sides. Here we have two sides and only one angle.'
          },
          {
            id: 'opt_2d',
            text: 'ΔABC ||| ΔDEF [AAA]',
            isCorrect: false,
            explanation: 'Similarity vs Congruency: "|||" denotes similarity, not congruency ("≡"). Moreover, AAA only proves similarity (shapes are scaled), not congruency.'
          }
        ],
        hint: 'Two pairs of sides and one included angle: ΔABC ≡ ΔDEF [SAS].'
      }
    ],
    solution: [
      'In ΔABC and ΔDEF:',
      '1. AB = DE = 7 cm  [Given]',
      '2. angle B = angle E = 52°  [Given, included angle]',
      '3. BC = EF = 10 cm  [Given]',
      'Therefore, ΔABC ≡ ΔDEF  [SAS]'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'The 4 Congruency Conditions in CAPS: 1) SSS (all 3 sides equal), 2) SAS (2 sides and the included angle equal), 3) AAS (2 angles and a corresponding side equal), 4) RHS (right-angle, hypotenuse, side equal).'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Check what is given: AB = DE (Side), angle B = angle E (Angle), BC = EF (Side). Because angle B is between AB and BC, it is the included angle. The reason is [SAS].'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) List 3 conditions: AB = DE, angle B = angle E, BC = EF\n2) Verify angle B is between AB and BC\n3) Conclusion: ΔABC ≡ ΔDEF [SAS]'
      }
    ]
  },

  // --- MODULE 3: FINANCIAL MATHEMATICS ---
  {
    id: 'g9_fin_01',
    grade: 'Grade 9',
    topic: 'Financial Mathematics',
    subtopic: 'Compound Interest Growth',
    title: 'Compound Interest Growth Calculation',
    questionText: 'Sipho invests R10 000 in a fixed deposit savings account earning 8% compound interest per annum compounded annually. Calculate the accumulated amount A after 3 years.',
    latexExpression: 'A = P(1 + i)^n',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.4',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Identify the compound interest formula and write down the parameters P, i (as a decimal), and n.',
        expectedAnswer: 'A = 10 000(1 + 0.08)^3',
        options: [
          {
            id: 'opt_1a',
            text: 'A = 10 000(1 + 0.08)^3',
            isCorrect: true,
            explanation: 'Correct! P = 10 000, i = 8 / 100 = 0.08, and n = 3 years. Formula: A = P(1 + i)^n.'
          },
          {
            id: 'opt_1b',
            text: 'A = 10 000(1 + 8)^3',
            isCorrect: false,
            explanation: 'Percentage Trap: 8% must be converted to a decimal by dividing by 100: i = 8 / 100 = 0.08, not 8!'
          },
          {
            id: 'opt_1c',
            text: 'A = 10 000(1 + 0.08 * 3)',
            isCorrect: false,
            explanation: 'Simple Interest Trap: A = P(1 + in) is the formula for SIMPLE interest. The problem specifies COMPOUND interest, where time n is an exponent: (1 + i)^n.'
          },
          {
            id: 'opt_1d',
            text: 'A = 10 000(1 + 0.08) * 3',
            isCorrect: false,
            explanation: 'Exponent as Multiplier: The time period n = 3 is an exponent (power), not a multiplier outside the bracket.'
          }
        ],
        hint: 'Formula is A = P(1 + i)^n. Convert 8% to decimal: 8 / 100 = 0.08.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Calculate the accumulated value A = 10 000 * (1.08)^3.',
        expectedAnswer: 'A = R12 597.12',
        options: [
          {
            id: 'opt_2a',
            text: 'A = R12 597.12',
            isCorrect: true,
            explanation: 'Spot on! (1.08)^3 = 1.259712. 10 000 * 1.259712 = R12 597.12.'
          },
          {
            id: 'opt_2b',
            text: 'A = R12 400.00',
            isCorrect: false,
            explanation: 'Simple Interest Result: R12 400 is what Sipho would get under simple interest (10 000 * 1.24). Compound interest earns R197.12 more because interest earns interest each year!'
          },
          {
            id: 'opt_2c',
            text: 'A = R10 240.00',
            isCorrect: false,
            explanation: 'Calculation Error: You added 8 * 3 = 24 and multiplied by 10. (1.08)^3 = 1.259712.'
          },
          {
            id: 'opt_2d',
            text: 'A = R25 971.20',
            isCorrect: false,
            explanation: 'Decimal Shift Error: Check your multiplication by 10 000: 10 000 * 1.259712 = R12 597.12, not R25 971.20.'
          }
        ],
        hint: '1.08 * 1.08 * 1.08 = 1.259712. Multiply by 10 000.'
      }
    ],
    solution: [
      'P = R10 000, i = 8% = 0.08, n = 3 years',
      'A = P(1 + i)^n',
      'A = 10 000 * (1 + 0.08)^3',
      'A = 10 000 * (1.08)^3',
      'A = 10 000 * 1.259712',
      'A = R12 597.12'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Compound Interest Formula: A = P(1 + i)^n, where P is the principal amount, i is annual interest rate as a decimal (r/100), and n is number of compounding periods in years.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Substitute P = 10 000, i = 0.08, and n = 3 into A = P(1 + i)^n. Evaluate 1.08 to the power of 3, then multiply by 10 000.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) A = 10 000(1 + 0.08)^3\n2) 1.08^3 = 1.259712\n3) A = 10 000 * 1.259712 = R12 597.12\nInterest earned = R2 597.12.'
      }
    ]
  },
  {
    id: 'g9_fin_02',
    grade: 'Grade 9',
    topic: 'Financial Mathematics',
    subtopic: 'Inflation Rate Adjustments',
    title: 'Projecting Costs with Annual Inflation',
    questionText: 'A high school CAPS Mathematics textbook currently costs R400. If educational textbook prices inflate at an average rate of 5% per annum, calculate the projected price of the textbook in 2 years.',
    latexExpression: 'A = P(1 + i)^n',
    capsRef: 'DBE CAPS Senior Phase (Grades 7-9) Mathematics, Section 3.4',
    steps: [
      {
        stepNumber: 1,
        prompt: 'Step 1: Set up the compound growth formula for inflation: A = P(1 + i)^n with P = 400, i = 0.05, n = 2.',
        expectedAnswer: 'A = 400(1 + 0.05)^2',
        options: [
          {
            id: 'opt_1a',
            text: 'A = 400(1 + 0.05)^2',
            isCorrect: true,
            explanation: 'Correct! Inflation behaves like compound interest: price grows annually on the previous year\'s inflated price.'
          },
          {
            id: 'opt_1b',
            text: 'A = 400(1 + 0.5)^2',
            isCorrect: false,
            explanation: 'Decimal Shift: 5% is 5 / 100 = 0.05, not 0.5! 0.5 represents 50% inflation.'
          },
          {
            id: 'opt_1c',
            text: 'A = 400(1 - 0.05)^2',
            isCorrect: false,
            explanation: 'Decay Formula: Minus sign is used for depreciation (loss of value). Inflation causes prices to RISE, so use (1 + i).'
          },
          {
            id: 'opt_1d',
            text: 'A = 400 + (5 * 2)',
            isCorrect: false,
            explanation: 'Adding Percentage to Currency: You cannot add percentage points directly to currency. 5% of R400 is R20, not R5.'
          }
        ],
        hint: 'Inflation increases price over time: A = P(1 + i)^n with i = 0.05.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Calculate the projected textbook price A after 2 years.',
        expectedAnswer: 'A = R441.00',
        options: [
          {
            id: 'opt_2a',
            text: 'A = R441.00',
            isCorrect: true,
            explanation: 'Spot on! (1.05)^2 = 1.1025. 400 * 1.1025 = R441.00.'
          },
          {
            id: 'opt_2b',
            text: 'A = R440.00',
            isCorrect: false,
            explanation: 'Simple Inflation Trap: R440 assumes simple growth (20 + 20). In year 2, inflation applies to the new price R420 (5% of 420 is R21), giving R441.'
          },
          {
            id: 'opt_2c',
            text: 'A = R420.00',
            isCorrect: false,
            explanation: '1 Year Only: R420 is the cost after only 1 year. The problem asks for 2 years.'
          },
          {
            id: 'opt_2d',
            text: 'A = R480.00',
            isCorrect: false,
            explanation: 'Multiplication Error: 400 * 1.1025 is R441, not R480.'
          }
        ],
        hint: '400 * (1.05)^2 = 400 * 1.1025 = R441.00.'
      }
    ],
    solution: [
      'P = R400, i = 5% = 0.05, n = 2 years',
      'A = P(1 + i)^n',
      'A = 400 * (1 + 0.05)^2',
      'A = 400 * (1.05)^2',
      'A = 400 * 1.1025',
      'A = R441.00'
    ],
    hints: [
      {
        tier: 1,
        type: 'Conceptual Rule',
        text: 'Inflation is the general increase in prices over time and is calculated using the compound growth formula: A = P(1 + i)^n.'
      },
      {
        tier: 2,
        type: 'Structural Hint',
        text: 'Calculate year 1: 400 * 1.05 = R420. Calculate year 2: 420 * 1.05 = R441. Or directly: 400 * (1.05)^2.'
      },
      {
        tier: 3,
        type: 'Complete Worked Solution',
        text: '1) A = 400(1 + 0.05)^2\n2) (1.05)^2 = 1.1025\n3) A = 400 * 1.1025 = R441.00\nThe textbook will cost R441.00 after 2 years.'
      }
    ]
  }
];
