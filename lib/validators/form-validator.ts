import { ExtractionFormData, ExtractionFormErrors } from '@/types/extraction-form';

export class FormValidator {
    validate(data: ExtractionFormData): ExtractionFormErrors {
        const errors: ExtractionFormErrors = {};

        this.validateAtLeastOneSource(data, errors);
        // Removed strict GitHub URL validation - let the API handle it

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
}
