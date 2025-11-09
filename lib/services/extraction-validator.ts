export interface ExtractionInput {
  cvFile?: File | null;
  githubUrl?: string | null;
  linkedinText?: string | null;
  name: string;
}

export class ExtractionValidator {
  validate(input: ExtractionInput): void {
    this.validateName(input.name);
    this.validateAtLeastOneSource(input);
  }

  private validateName(name: string | undefined): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Le nom est requis');
    }
  }

  private validateAtLeastOneSource(input: ExtractionInput): void {
    const hasCv = input.cvFile !== null && input.cvFile !== undefined;
    const hasGithub = input.githubUrl !== null && input.githubUrl !== undefined;
    const hasLinkedin = input.linkedinText !== null && input.linkedinText !== undefined;

    if (!hasCv && !hasGithub && !hasLinkedin) {
      throw new Error('Au moins une source est requise (CV, GitHub ou LinkedIn)');
    }
  }
}
