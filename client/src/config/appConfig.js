/**
 * Central Brand and Application Configuration
 * 
 * Public-facing platform brand: Ever After Education
 * Descriptor: Homeschool & Tutoring Solutions
 * Parent/publisher brand: EverAfter Media
 */

export const APP_CONFIG = {
  // Brand identity
  brandName: 'Ever After Education',
  descriptor: 'Homeschool & Tutoring Solutions',
  publisherBrand: 'EverAfter Media',
  brandTagline: 'Homeschool & Tutoring Solutions',
  brandSubtext: 'Premium, mastery-based South African CAPS home education and tutoring for Grades R through 12.',
  
  // Brand Assets
  emblemPath: '/brand/everafter-emblem.png',
  mediaLogoPath: '/brand/everafter-media-logo.png',
  promoImagePath: '/brand/everafter-promo.jpg',
  faviconPath: '/favicon.png',

  // Brand Color Palette tokens
  palette: {
    primaryBronze: '#6B3E21',
    metallicBronze: '#B87D4B',
    warmIvory: '#FBF9F5',
    softParchment: '#F5F0EA',
    deepGreen: '#234938',
    mutedSage: '#557B68',
    sageLight: '#E8EFEA'
  },
  
  // Pilot Stage Information
  version: '1.0.0-pilot',
  stageName: 'Stage 1 — Application Foundation',
  curriculumStandard: 'DBE CAPS (Curriculum and Assessment Policy Statement)',
  primarySubject: 'Mathematics (Grades R–12)',
  
  // South African Grade Phases
  phases: [
    { id: 'foundation', name: 'Foundation Phase', grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'intermediate', name: 'Intermediate Phase', grades: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'senior', name: 'Senior Phase', grades: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'fet', name: 'FET Phase', grades: ['Grade 10', 'Grade 11', 'Grade 12'] }
  ],

  // Avatar presets for learner profiles
  avatarOptions: [
    { code: 'sprout', name: 'Little Sprout', icon: '🌱' },
    { code: 'explorer', name: 'Karoo Explorer', icon: '🧭' },
    { code: 'scientist', name: 'Curious Chemist', icon: '🔬' },
    { code: 'inventor', name: 'Tech Inventor', icon: '💡' },
    { code: 'cub', name: 'Savanna Cub', icon: '🦁' },
    { code: 'falcon', name: 'High Falcon', icon: '🦅' },
    { code: 'star', name: 'Night Star', icon: '⭐' }
  ],

  // Demo accounts for instant multi-family isolation testing
  demoAccounts: [
    {
      key: 'molefe',
      familyName: 'Molefe Family',
      parentEmail: 'thabo@molefe.co.za',
      parentName: 'Thabo Molefe',
      learnersSummary: 'Kamohelo (Gr 4) & Lesedi (Gr 7)'
    },
    {
      key: 'vandermerwe',
      familyName: 'Van der Merwe Family',
      parentEmail: 'annelize@vandermerwe.co.za',
      parentName: 'Annelize van der Merwe',
      learnersSummary: 'Liam (Gr 9)'
    }
  ]
};
