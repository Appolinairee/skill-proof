import { ExtractionFormData, ExtractionFormErrors } from '@/types/extraction-form';

export class FormValidator {
  validate(data: ExtractionFormData): ExtractionFormErrors {
    const errors: ExtractionFormErrors = {};

    this.validateAtLeastOneSource(data, errors);
    this.validateName(data.name, errors);
    this.validateGithubUrl(data.githubUrl, errors);

    return errors;
  }

  private validateName(name: string, errors: ExtractionFormErrors): void {
    const hasName = name && name.trim().length > 0;
    if (!hasName) {
      errors.name = 'Le nom est requis';
    }
  }

  private validateAtLeastOneSource(
    data: ExtractionFormData, 
    errors: ExtractionFormErrors
  ): void {
    const hasSource = data.cvFile || data.githubUrl || data.linkedinText;
    
    if (!hasSource) {
      errors.general = 'Au moins une source est requise (CV, GitHub ou LinkedIn)';
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
