import { useState, useEffect, useCallback, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

type UseProgressiveFormReturn = {
  currentStep: number;
  isLastStep: boolean;
  progress: number;
  formMethods: any;
  handleSubmit: (data: any) => void;
  formData: any;
};

export const useProgressiveForm = ({
  steps,
  onStepComplete,
  onFinalSubmit,
}: UseProgressiveFormProps): UseProgressiveFormReturn => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isValidating, setIsValidating] = useState(false);

  const currentStepIndex = currentStep - 1;
  const isLastStep = currentStep === steps.length;
  const progress = (currentStep / steps.length) * 100;

  const formMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver(steps[currentStepIndex].validation),
    defaultValues: formData,
  });

  const { watch, trigger, getValues, reset } = formMethods;

  useEffect(() => {
    reset({ ...formData });
  }, [currentStep, formData, reset, isValidating]);

  const validateAndProceed = useCallback(async () => {
    if (isValidating) return;

    try {
      setIsValidating(true);
      const currentFields = steps[currentStepIndex].fields;
      const isValid = await trigger(currentFields as any);

      if (isValid) {
        const currentValues = getValues(currentFields as any);
        const newData = { ...formData, ...currentValues };
        setFormData(newData);
        onStepComplete?.(currentStep, newData);

        if (!isLastStep) {
          setCurrentStep(prev => prev + 1);
        }
      }
    } finally {
      setIsValidating(false);
    }
  }, [currentStep, currentStepIndex, formData, getValues, isLastStep, onStepComplete, steps, trigger, isValidating]);

  const currentFields = useMemo(
    () => steps[currentStepIndex].fields,
    [steps, currentStepIndex]
  );

  const watchedValues = watch(currentFields as any);

  useEffect(() => {
    const values = getValues(currentFields as any);
    const hasValues = Object.values(values).some(value => value !== undefined && value !== '');

    if (hasValues) {
      const debounceTimer = setTimeout(() => {
        validateAndProceed();
      }, 1000);

      return () => clearTimeout(debounceTimer);
    }
  }, [currentFields, getValues, validateAndProceed, watchedValues]);

  const handleSubmit = useCallback((data: any) => {
    const finalData = {
      ...formData,
      ...data,
    };
    onFinalSubmit?.(finalData);
  }, [formData, onFinalSubmit]);

  return {
    currentStep,
    isLastStep,
    progress,
    formMethods,
    handleSubmit,
    formData,
  };
};
