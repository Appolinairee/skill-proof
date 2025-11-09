export interface ExtractionFormData {
  name: string;
  cvFile: File | null;
  githubUrl: string;
  linkedinText: string;
}

export interface ExtractionFormErrors {
  name?: string;
  cvFile?: string;
  githubUrl?: string;
  linkedinText?: string;
  general?: string;
}

export interface ExtractionFormState {
  data: ExtractionFormData;
  errors: ExtractionFormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}
