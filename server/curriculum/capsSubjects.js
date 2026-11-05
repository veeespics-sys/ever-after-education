/**
 * Official South African CAPS Curriculum Subjects Catalog
 * 
 * Sourced from Department of Basic Education (DBE) Curriculum and Assessment Policy Statements (CAPS).
 * Content verification status is strictly tracked and decoupled from application code.
 */

export const CAPS_PHASES = {
  FOUNDATION: {
    id: 'foundation',
    name: 'Foundation Phase',
    grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3'],
    gradeNumbers: [0, 1, 2, 3]
  },
  INTERMEDIATE: {
    id: 'intermediate',
    name: 'Intermediate Phase',
    grades: ['Grade 4', 'Grade 5', 'Grade 6'],
    gradeNumbers: [4, 5, 6]
  },
  SENIOR: {
    id: 'senior',
    name: 'Senior Phase',
    grades: ['Grade 7', 'Grade 8', 'Grade 9'],
    gradeNumbers: [7, 8, 9]
  },
  FET: {
    id: 'fet',
    name: 'Further Education and Training (FET) Phase',
    grades: ['Grade 10', 'Grade 11', 'Grade 12'],
    gradeNumbers: [10, 11, 12]
  }
};

export const CAPS_SUBJECTS = [
  // Foundation Phase (Grades R-3)
  {
    code: 'CAPS-FP-MATH',
    title: 'Mathematics (Foundation Phase)',
    phase: 'Foundation Phase',
    min_grade: 0,
    max_grade: 3,
    description: 'Numbers, Operations and Relationships; Patterns, Functions and Algebra; Space and Shape (Geometry); Measurement; Data Handling.',
    caps_doc_ref: 'DBE CAPS Foundation Phase Mathematics (Grades R-3), Section 2',
    is_core: 1,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-FP-ENG',
    title: 'English Home Language (Foundation Phase)',
    phase: 'Foundation Phase',
    min_grade: 0,
    max_grade: 3,
    description: 'Listening and Speaking, Phonics and Reading, Handwriting, Writing.',
    caps_doc_ref: 'DBE CAPS Foundation Phase Languages, Section 2',
    is_core: 1,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-FP-LS',
    title: 'Life Skills (Foundation Phase)',
    phase: 'Foundation Phase',
    min_grade: 0,
    max_grade: 3,
    description: 'Beginning Knowledge, Personal and Social Well-being, Creative Arts, Physical Education.',
    caps_doc_ref: 'DBE CAPS Foundation Phase Life Skills, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },

  // Intermediate Phase (Grades 4-6)
  {
    code: 'CAPS-IP-MATH',
    title: 'Mathematics (Intermediate Phase)',
    phase: 'Intermediate Phase',
    min_grade: 4,
    max_grade: 6,
    description: 'Numbers, Operations and Relationships; Patterns, Functions and Algebra; Space and Shape; Measurement; Data Handling.',
    caps_doc_ref: 'DBE CAPS Intermediate Phase Mathematics (Grades 4-6), Section 2',
    is_core: 1,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-IP-NST',
    title: 'Natural Sciences and Technology',
    phase: 'Intermediate Phase',
    min_grade: 4,
    max_grade: 6,
    description: 'Life and Living, Matter and Materials, Energy and Change, Planet Earth and Beyond.',
    caps_doc_ref: 'DBE CAPS Intermediate Phase Natural Sciences & Technology, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-IP-ENG',
    title: 'English First Additional Language',
    phase: 'Intermediate Phase',
    min_grade: 4,
    max_grade: 6,
    description: 'Listening and Speaking, Reading and Viewing, Writing and Presenting, Language Structures and Conventions.',
    caps_doc_ref: 'DBE CAPS Intermediate Phase Languages, Section 2',
    is_core: 1,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-IP-SS',
    title: 'Social Sciences (History & Geography)',
    phase: 'Intermediate Phase',
    min_grade: 4,
    max_grade: 6,
    description: 'Geography (Map skills, climate, settlement) and History (Heritage, local history, early societies).',
    caps_doc_ref: 'DBE CAPS Intermediate Phase Social Sciences, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },

  // Senior Phase (Grades 7-9)
  {
    code: 'CAPS-SP-MATH',
    title: 'Mathematics (Senior Phase)',
    phase: 'Senior Phase',
    min_grade: 7,
    max_grade: 9,
    description: 'Numbers, Operations and Relationships; Patterns, Functions and Algebra (Equations, Graphs); Space and Shape; Measurement; Data Handling.',
    caps_doc_ref: 'DBE CAPS Senior Phase Mathematics (Grades 7-9), Section 2',
    is_core: 1,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-SP-NS',
    title: 'Natural Sciences (Senior Phase)',
    phase: 'Senior Phase',
    min_grade: 7,
    max_grade: 9,
    description: 'Life and Living (Cells, Systems, Biodiversity); Matter and Materials; Energy and Change; Earth and Beyond.',
    caps_doc_ref: 'DBE CAPS Senior Phase Natural Sciences, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-SP-TECH',
    title: 'Technology (Senior Phase)',
    phase: 'Senior Phase',
    min_grade: 7,
    max_grade: 9,
    description: 'Design Process, Structures, Mechanical Systems, Electrical Systems, Processing.',
    caps_doc_ref: 'DBE CAPS Senior Phase Technology, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-SP-EMS',
    title: 'Economic and Management Sciences',
    phase: 'Senior Phase',
    min_grade: 7,
    max_grade: 9,
    description: 'The Economy, Financial Literacy (Accounting, Budgets), Entrepreneurship.',
    caps_doc_ref: 'DBE CAPS Senior Phase EMS, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },

  // Further Education and Training (FET) Phase (Grades 10-12)
  {
    code: 'CAPS-FET-MATH',
    title: 'Mathematics (FET Phase)',
    phase: 'FET Phase',
    min_grade: 10,
    max_grade: 12,
    description: 'Functions and Inverses; Number Patterns; Finance, Growth & Decay; Calculus; Trigonometry; Euclidean Geometry & Analytical Geometry; Statistics & Probability.',
    caps_doc_ref: 'DBE CAPS Grades 10-12 Mathematics, Section 2',
    is_core: 1,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-FET-MLIT',
    title: 'Mathematical Literacy (FET Phase)',
    phase: 'FET Phase',
    min_grade: 10,
    max_grade: 12,
    description: 'Finance (Tax, Tariffs, Inflation); Measurement; Maps, Plans and Representations; Data Handling; Probability.',
    caps_doc_ref: 'DBE CAPS Grades 10-12 Mathematical Literacy, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-FET-PHYS',
    title: 'Physical Sciences (Physics & Chemistry)',
    phase: 'FET Phase',
    min_grade: 10,
    max_grade: 12,
    description: 'Mechanics, Waves, Sound & Light, Electricity & Magnetism, Matter & Materials, Chemical Change.',
    caps_doc_ref: 'DBE CAPS Grades 10-12 Physical Sciences, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  },
  {
    code: 'CAPS-FET-LIFE',
    title: 'Life Sciences (Biology)',
    phase: 'FET Phase',
    min_grade: 10,
    max_grade: 12,
    description: 'Life at Molecular, Cellular & Tissue Level; Life Processes in Plants & Animals; Environmental Studies; Diversity, Change & Continuity.',
    caps_doc_ref: 'DBE CAPS Grades 10-12 Life Sciences, Section 2',
    is_core: 0,
    verification_status: 'verified',
    review_date: '2026-01-15'
  }
];

export function gradeToNumber(gradeStr) {
  if (!gradeStr) return 0;
  if (gradeStr === 'Grade R') return 0;
  const match = gradeStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function getSubjectsForGrade(gradeStr) {
  const gradeNum = gradeToNumber(gradeStr);
  return CAPS_SUBJECTS.filter(s => gradeNum >= s.min_grade && gradeNum <= s.max_grade);
}
