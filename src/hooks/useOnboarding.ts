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

  const config = getProductConfig(productId);
  const totalSteps = config?.fields.length || 0;

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
    const currentField = config.fields[step - 1];
    if (!currentField.required) return true;

    const val = form[currentField.name];
    if (currentField.type === 'multiselect') {
      return Array.isArray(val) && val.length > 0;
    }
    return !!val;
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
  };
};
