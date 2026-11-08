/**
 * CAPS Senior Phase Mathematics — Grade 9
 * Module: Exponents & Factorisation
 * 
 * Topics:
 * - Laws of exponents (Product, Quotient, Power of a Power)
 * - Factorisation by Highest Common Factor (HCF)
 * - Factorisation: Difference of Two Squares (a^2 - b^2)
 * - Factorisation: Quadratic Trinomials (x^2 + bx + c)
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
        prompt: 'Step 1: Multiply the numerator terms: multiply the numerical coefficients (3 * 4) and apply the Product Law of exponents to x^4 * x^3 (add the exponents).',
        expectedAnswer: '12x^7 / (2x^2)',
        acceptedAnswers: [
          '12x^7 / (2x^2)',
          '12x^7 / 2x^2',
          '12x^7/2x^2',
          '(12x^7)/(2x^2)'
        ],
        hint: 'Product Law: x^a * x^b = x^(a + b). 4 + 3 = 7.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Divide the coefficients (12 / 2) and apply the Quotient Law of exponents (x^7 / x^2, subtract exponents).',
        expectedAnswer: '6x^5',
        acceptedAnswers: [
          '6x^5',
          '6x^(5)'
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
        prompt: 'Step 1: Identify the Highest Common Factor (HCF) of both terms: find the HCF of the numbers (6, 9), the powers of x (x^3, x^2), and powers of y (y, y^2).',
        expectedAnswer: '3x^2y',
        acceptedAnswers: [
          '3x^2y',
          '3x^2*y',
          'HCF = 3x^2y'
        ],
        hint: 'HCF of 6 and 9 is 3. Lowest power of x is x^2, and lowest power of y is y.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Divide each term by the HCF and express the result as HCF(quotient).',
        expectedAnswer: '3x^2y(2x - 3y)',
        acceptedAnswers: [
          '3x^2y(2x - 3y)',
          '3x^2y(2x-3y)',
          '3*x^2*y*(2x - 3y)'
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
        prompt: 'Step 1: Identify the square roots of the two terms: sqrt(4x^2) and sqrt(49).',
        expectedAnswer: '2x and 7',
        acceptedAnswers: [
          '2x and 7',
          '2x, 7',
          '2x,7',
          '7, 2x',
          '2x and 7'
        ],
        hint: 'sqrt(4) = 2, sqrt(x^2) = x, and sqrt(49) = 7.'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Apply the rule a^2 - b^2 = (a - b)(a + b) to write the factorised brackets.',
        expectedAnswer: '(2x - 7)(2x + 7)',
        acceptedAnswers: [
          '(2x - 7)(2x + 7)',
          '(2x + 7)(2x - 7)',
          '(2x-7)(2x+7)',
          '(2x+7)(2x-7)'
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
        prompt: 'Step 1: Find two integers that multiply to give the constant term +12, and add to give the coefficient of the middle term +7.',
        expectedAnswer: '3 and 4',
        acceptedAnswers: [
          '3 and 4',
          '4 and 3',
          '3, 4',
          '4, 3',
          '3,4',
          '4,3'
        ],
        hint: 'Factors of 12 include 1*12 (sum=13), 2*6 (sum=8), 3*4 (sum=7).'
      },
      {
        stepNumber: 2,
        prompt: 'Step 2: Write the expression as the product of two binomials: (x + p)(x + q).',
        expectedAnswer: '(x + 3)(x + 4)',
        acceptedAnswers: [
          '(x + 3)(x + 4)',
          '(x + 4)(x + 3)',
          '(x+3)(x+4)',
          '(x+4)(x+3)'
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
