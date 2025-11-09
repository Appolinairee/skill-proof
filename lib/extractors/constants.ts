export const SUPPORTED_MIME_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  TEXT: 'text/plain',
} as const;

export const CV_SECTION_PATTERNS = {
  EXPERIENCE: /expérience professionnelle|experience|emploi|postes/gi,
  EDUCATION: /formation|éducation|education|diplôme|études/gi,
  SKILLS: /compétences|skills|technologies|langages/gi,
} as const;

export const LINKEDIN_SECTION_PATTERNS = {
  EXPERIENCE: /expérience|experience|emploi|postes|positions/gi,
  EDUCATION: /formation|éducation|education|diplôme|études/gi,
  SKILLS: /compétences|skills|qualifications/gi,
} as const;

export const GITHUB_CONFIG = {
  MAX_REPOS: 100,
  TOP_REPOS_COUNT: 10,
  DEFAULT_RATE_LIMIT: 60,
} as const;
