import { LinkedInData } from '../types';
import { LINKEDIN_SECTION_PATTERNS } from '../constants';
import { SectionExtractor } from '../section-extractor';

export class LinkedInTextParser {
  parse(text: string): LinkedInData['parsedSections'] {
    const extractor = new SectionExtractor({
      experience: LINKEDIN_SECTION_PATTERNS.EXPERIENCE,
      education: LINKEDIN_SECTION_PATTERNS.EDUCATION,
      skills: LINKEDIN_SECTION_PATTERNS.SKILLS,
    });

    const sections = extractor.extract(text);

    return {
      experience: sections.experience,
      education: sections.education,
      skills: sections.skills ? sections.skills.split('\n') : undefined,
    };
  }
}
