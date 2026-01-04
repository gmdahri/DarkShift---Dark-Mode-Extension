import { useState, useEffect } from 'react';
import { isOnboardingCompleted, setOnboardingCompleted } from '../../utils/onboarding';

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await isOnboardingCompleted();
      setShowOnboarding(!completed);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    await setOnboardingCompleted(true);
    setShowOnboarding(false);
  };

  const resetOnboarding = async () => {
    await setOnboardingCompleted(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    loading,
    completeOnboarding,
    resetOnboarding,
  };
}



