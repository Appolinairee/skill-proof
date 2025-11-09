import { LinkedInData } from '../types';

export class LinkedInJsonParser {
  parse(json: any): LinkedInData['parsedSections'] {
    return {
      experience: this.extractExperience(json),
      education: this.extractEducation(json),
      skills: this.extractSkills(json),
    };
  }

  private extractExperience(json: any): string | undefined {
    const positions = json.positions || json.Positions;
    return positions ? JSON.stringify(positions) : undefined;
  }

  private extractEducation(json: any): string | undefined {
    const education = json.education || json.Education;
    return education ? JSON.stringify(education) : undefined;
  }

  private extractSkills(json: any): string[] | undefined {
    const skills = json.skills || json.Skills;
    
    if (!skills) return undefined;
    
    return Array.isArray(skills) 
      ? skills.map((s: any) => s.name || s).filter(Boolean)
      : undefined;
  }
}
