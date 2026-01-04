import { useState } from 'react';
import { ONBOARDING_STEPS } from '../../utils/onboarding';
import { setOnboardingCompleted } from '../../utils/onboarding';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      await setOnboardingCompleted(true);
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = async () => {
    await setOnboardingCompleted(true);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-[340px] mx-4 rounded-3xl glass border border-white/10 overflow-hidden animate-scale-in">
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 
            flex items-center justify-center border border-rose-500/30 animate-pulse-glow">
            <span className="text-4xl">{step.icon}</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-3">{step.title}</h2>

          {/* Description */}
          <p className="text-sm text-white/60 leading-relaxed mb-8">{step.description}</p>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {ONBOARDING_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-6 bg-gradient-to-r from-rose-500 to-amber-500' 
                    : index < currentStep
                      ? 'bg-rose-500/50'
                      : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white/60 
                bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 
                transition-all duration-300 hover:text-white"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white 
                bg-gradient-to-r from-rose-500 to-amber-500 rounded-xl 
                shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40
                transition-all duration-300 hover:scale-[1.02]"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


