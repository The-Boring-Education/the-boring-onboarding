import { useState, useEffect } from 'react';
import { getProductConfig, isValidProduct } from '../config/products';
import { getUserById, submitOnboarding } from '../utils/api';
import { User, UseOnboardingReturn } from '../types/onboarding';

interface UseOnboardingProps {
  userId: string;
  productId: string;
  redirect: string;
  token?: string;
}

export const useOnboarding = ({
  userId,
  productId,
  redirect,
  token,
}: UseOnboardingProps): UseOnboardingReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const config = getProductConfig(productId);

  // Get unique step numbers that have at least one field
  const stepNumbersWithFields = config ? Array.from(new Set(config.fields.map(f => f.step))).sort((a, b) => a - b) : [];
  const totalSteps = stepNumbersWithFields.length;

  // Map visible step index (1-based) to actual step number
  const getActualStepNumber = (visibleStep: number) => stepNumbersWithFields[visibleStep - 1];

  // Reset form when product changes
  useEffect(() => {
    setForm({});
    setStep(1);
  }, [productId]);

  // Fetch user data and prefill form
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const u = await getUserById(userId, token);
      setUser(u);

      if (u && config) {
        // Prefill form using product configuration
        const prefillData: any = {};
        config.fields.forEach(field => {
          if (field.prefill?.fromUser) {
            prefillData[field.name] = field.prefill.fromUser(u);
          } else {
            prefillData[field.name] =
              field.prefill?.defaultValue ||
              (field.type === 'multiselect' ? [] : '');
          }
        });
        setForm(prefillData);
      }
      setLoading(false);
    }

    if (userId && isValidProduct(productId)) {
      fetchUser();
    }
  }, [userId, productId, token, config]);

  const handleNext = () => {
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleFinish = async () => {
    if (!config) return;

    setSubmitting(true);
    setError('');

    const { success, error: apiError } = await submitOnboarding(
      productId,
      userId,
      form,
      token
    );
    setSubmitting(false);

    if (success) {
      window.location.href = redirect;
    } else {
      setError(apiError || 'Submission failed');
    }
  };

  const isFieldValid = () => {
    if (!config) return false;
    const actualStep = getActualStepNumber(step);
    const currentFields = config.fields.filter(f => f.step === actualStep);
    // All required fields for this step must be valid
    return currentFields.every(currentField => {
      if (!currentField.required) return true;
      const val = form[currentField.name];
      if (currentField.type === 'multiselect') {
        return Array.isArray(val) && val.length > 0;
      }
      const hasValue = !!val;
      if (currentField.checkAvailability && hasValue) {
        return usernameAvailable && !usernameChecking;
      }
      return hasValue;
    });
  };

  return {
    user,
    step,
    form,
    setForm,
    loading,
    error,
    submitting,
    config,
    totalSteps,
    handleNext,
    handleBack,
    handleFinish,
    isFieldValid: isFieldValid(),
    setUsernameAvailability: setUsernameAvailable,
    setUsernameChecking,
    // Optionally export stepNumbersWithFields and getActualStepNumber if needed elsewhere
  };
};
