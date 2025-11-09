import { ExtractionFormData } from '@/types/extraction-form';

export interface ExtractionResponse {
    success: boolean;
    data?: {
        sources: any;
        analysis: any;
    };
    error?: string;
    details?: string;
}

export class ExtractionApiClient {
    private readonly endpoint = '/api/extract';

    async extract(formData: ExtractionFormData): Promise<ExtractionResponse> {
        const body = this.buildFormData(formData);

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                body,
            });

            if (!response.ok) {
                const text = await response.text();
                return {
                    success: false,
                    error: `Erreur ${response.status}`,
                    details: text.substring(0, 200),
                };
            }

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                return {
                    success: false,
                    error: 'Réponse invalide du serveur',
                    details: 'Le serveur n\'a pas retourné du JSON',
                };
            }

            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Erreur de connexion',
                details: error instanceof Error ? error.message : 'Erreur inconnue',
            };
        }
    }

    private buildFormData(data: ExtractionFormData): FormData {
        const formData = new FormData();

        formData.append('name', data.name);

        if (data.cvFile) {
            formData.append('cv', data.cvFile);
        }

        if (data.githubUrl) {
            formData.append('githubUrl', data.githubUrl);
        }

        if (data.linkedinText) {
            formData.append('linkedinText', data.linkedinText);
        }

        return formData;
    }
}
