type SectionType = 'experience' | 'education' | 'skills';

interface SectionPatterns {
  [key: string]: RegExp;
}

export class SectionExtractor {
  constructor(private patterns: SectionPatterns) {}

  extract(text: string): Record<string, string> {
    const lines = this.getLines(text);
    const accumulator = this.createAccumulator();
    
    return this.processLines(lines, accumulator);
  }

  private getLines(text: string): string[] {
    return text.split('\n').map(line => line.trim()).filter(Boolean);
  }

  private createAccumulator() {
    return {
      currentSection: null as SectionType | null,
      sections: {} as Record<string, string[]>,
    };
  }

  private processLines(
    lines: string[], 
    accumulator: ReturnType<typeof this.createAccumulator>
  ): Record<string, string> {
    for (const line of lines) {
      const matchedSection = this.matchSection(line);
      
      if (matchedSection) {
        accumulator.currentSection = matchedSection;
        continue;
      }

      this.addLineToCurrentSection(line, accumulator);
    }

    return this.formatSections(accumulator.sections);
  }

  private matchSection(line: string): SectionType | null {
    for (const [section, pattern] of Object.entries(this.patterns)) {
      if (pattern.test(line)) {
        return section as SectionType;
      }
    }
    return null;
  }

  private addLineToCurrentSection(
    line: string,
    accumulator: ReturnType<typeof this.createAccumulator>
  ): void {
    const { currentSection, sections } = accumulator;
    
    if (!currentSection) return;

    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }

    sections[currentSection].push(line);
  }

  private formatSections(sections: Record<string, string[]>): Record<string, string> {
    const formatted: Record<string, string> = {};

    for (const [key, lines] of Object.entries(sections)) {
      if (lines.length > 0) {
        formatted[key] = lines.join('\n');
      }
    }

    return formatted;
  }
}
