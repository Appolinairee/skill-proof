export interface ExtractionInput {
  cvFile?: File | null;
  githubUrl?: string | null;
  linkedinText?: string | null;
  name: string;
}

export class ExtractionValidator {
  validate(input: ExtractionInput): void {
    this.validateAtLeastOneData(input);
  }

  private validateAtLeastOneData(input: ExtractionInput): void {
    const hasName = input.name && input.name.trim().length > 0;
    const hasCv = input.cvFile !== null && input.cvFile !== undefined;
    const hasGithub = input.githubUrl && input.githubUrl.trim().length > 0;
    const hasLinkedin = input.linkedinText && input.linkedinText.trim().length > 0;

    if (!hasName && !hasCv && !hasGithub && !hasLinkedin) {
      throw new Error('Au moins une donnée est requise (nom, CV, GitHub ou LinkedIn)');
    }
  }
}
