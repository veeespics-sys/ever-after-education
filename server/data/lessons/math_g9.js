/**
 * CAPS Senior Phase Mathematics — Grade 9
 * Module: Exponents & Factorisation
 * 
 * Misconception-Driven Multiple-Choice Question (MCQ) Engine
 * Distractors focus on notorious South African CAPS Senior Phase traps:
 * - Exponent multiplication trap: x^a * x^b -> x^(a*b) instead of x^(a+b)
 * - Exponent division trap: x^a / x^b -> x^(a/b) instead of x^(a-b)
 * - DOTS coefficient square root trap: 4x^2 - 49 -> (4x - 7)(4x + 7) (forgetting sqrt(4) = 2)
 * - DOTS false binomial expansion: (a - b)^2 = a^2 - b^2
 * - Trinomial factor pairing trap: factors multiplying to c that do NOT sum to b
 */

export const MATH_GRADE_9_PROBLEMS = [
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
  }
];
