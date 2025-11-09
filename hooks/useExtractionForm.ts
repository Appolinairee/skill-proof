'use client';

import { useState, useCallback } from 'react';
import { ExtractionFormState, ExtractionFormData } from '@/types/extraction-form';
import { FormValidator } from '@/lib/validators/form-validator';

const INITIAL_STATE: ExtractionFormState = {
  data: {
    name: '',
    cvFile: null,
    githubUrl: '',
    linkedinText: '',
  },
  errors: {},
  isSubmitting: false,
  isValid: false,
};

export function useExtractionForm() {
  const [state, setState] = useState<ExtractionFormState>(INITIAL_STATE);
  const validator = new FormValidator();

  const updateField = useCallback((field: keyof ExtractionFormData, value: any) => {
    setState(prev => {
      const newData = { ...prev.data, [field]: value };
      const errors = validator.validate(newData);
      
      return {
        ...prev,
        data: newData,
        errors,
        isValid: Object.keys(errors).length === 0,
      };
    });
  }, []);

  const setName = useCallback((name: string) => {
    updateField('name', name);
  }, [updateField]);

  const setCvFile = useCallback((file: File | null) => {
    updateField('cvFile', file);
  }, [updateField]);

  const setGithubUrl = useCallback((url: string) => {
    updateField('githubUrl', url);
  }, [updateField]);

  const setLinkedinText = useCallback((text: string) => {
    updateField('linkedinText', text);
  }, [updateField]);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    setName,
    setCvFile,
    setGithubUrl,
    setLinkedinText,
    setSubmitting,
    reset,
  };
}
