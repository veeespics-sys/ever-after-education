/**
 * Mathematical Answer Normalizer for Step-by-Step Problem Validation
 * Handles whitespace variations, equivalent commutations of factors, and formatting.
 */

export function normalizeMathString(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .trim()
    .toLowerCase()
    // Replace unicode minus or multiplication
    .replace(/[–—−]/g, '-')
    .replace(/[×*]/g, '*')
    .replace(/÷/g, '/')
    // Remove unnecessary spaces around operators and parentheses
    .replace(/\s*([+\-*/=(),])\s*/g, '$1')
    // Collapse any remaining double spaces
    .replace(/\s+/g, ' ');
}

/**
 * Checks if learner input matches the expected answer or any accepted variants.
 * @param {string} learnerInput 
 * @param {string} expected 
 * @param {string[]} [acceptedVariants=[]] 
 * @returns {boolean}
 */
export function matchesAnswer(learnerInput, expected, acceptedVariants = []) {
  if (!learnerInput) return false;
  
  const normInput = normalizeMathString(learnerInput);
  const normExpected = normalizeMathString(expected);

  if (normInput === normExpected) return true;

  for (const variant of acceptedVariants) {
    if (normInput === normalizeMathString(variant)) {
      return true;
    }
  }

  // Also check commutativity for factored forms e.g. (x-5)(x+2) === (x+2)(x-5)
  // Matching two parentheses groups: (groupA)(groupB)
  const factorRegex = /^\(([^()]+)\)\(([^()]+)\)(=0)?$/;
  const inputMatch = normInput.match(factorRegex);
  const expectedMatch = normExpected.match(factorRegex);

  if (inputMatch && expectedMatch) {
    const eqSuffixInput = inputMatch[3] || '';
    const eqSuffixExpected = expectedMatch[3] || '';
    if (eqSuffixInput === eqSuffixExpected) {
      const inA = inputMatch[1];
      const inB = inputMatch[2];
      const expA = expectedMatch[1];
      const expB = expectedMatch[2];
      if ((inA === expB && inB === expA) || (inA === expA && inB === expB)) {
        return true;
      }
    }
  }

  // Also check commutative "or" answers e.g. "x=5 or x=-2" vs "x=-2 or x=5"
  if (normInput.includes('or') && normExpected.includes('or')) {
    const inParts = normInput.split('or').map(s => s.trim()).sort();
    const expParts = normExpected.split('or').map(s => s.trim()).sort();
    if (inParts.length === expParts.length && inParts.every((val, idx) => val === expParts[idx])) {
      return true;
    }
  }

  return false;
}

