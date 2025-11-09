import { ExtractionFormData, ExtractionFormErrors } from '@/types/extraction-form';

export class FormValidator {
  validate(data: ExtractionFormData): ExtractionFormErrors {
    const errors: ExtractionFormErrors = {};

    this.validateAtLeastOneSource(data, errors);
    this.validateGithubUrl(data.githubUrl, errors);

    return errors;
  }

  private validateAtLeastOneSource(
    data: ExtractionFormData, 
    errors: ExtractionFormErrors
  ): void {
    const hasName = data.name && data.name.trim().length > 0;
    const hasFile = !!data.cvFile;
    const hasGithub = data.githubUrl && data.githubUrl.trim().length > 0;
    const hasLinkedin = data.linkedinText && data.linkedinText.trim().length > 0;
    
    if (!hasName && !hasFile && !hasGithub && !hasLinkedin) {
      errors.general = 'Entrez votre nom, uploadez un CV, ou ajoutez un lien GitHub/LinkedIn';
    }
  }

  private validateGithubUrl(url: string, errors: ExtractionFormErrors): void {
    if (!url) return;

    const isValid = this.isValidGithubUrl(url);
    if (!isValid) {
      errors.githubUrl = 'URL GitHub invalide';
    }
  }

  private isValidGithubUrl(url: string): boolean {
    const patterns = [
      /^https?:\/\/github\.com\/[a-zA-Z0-9-]+$/,
      /^[a-zA-Z0-9-]+$/,
    ];

    return patterns.some(pattern => pattern.test(url));
  }
}
