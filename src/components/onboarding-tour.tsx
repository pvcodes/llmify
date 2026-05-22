'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';

interface TooltipStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  steps: TooltipStep[];
  onComplete?: () => void;
  storageKey?: string;
}

export function OnboardingTour({
  steps,
  onComplete,
  storageKey = 'onboarding-tour-completed',
}: OnboardingTourProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setIsClient(true);
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, [storageKey]);

  const calculatePosition = useCallback(() => {
    if (typeof window === 'undefined' || !steps[currentStep]) return { top: 0, left: 0 };

    const element = document.querySelector(steps[currentStep].target);
    if (!element) return { top: 0, left: 0 };

    const rect = element.getBoundingClientRect();
    const placement = steps[currentStep].placement || 'bottom';

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - 160;
        left = rect.left + rect.width / 2 - 150;
        break;
      case 'bottom':
        top = rect.bottom + 16;
        left = rect.left + rect.width / 2 - 150;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - 50;
        left = rect.left - 320;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - 50;
        left = rect.right + 16;
        break;
    }

    return {
      top: Math.max(16, top),
      left: Math.max(16, Math.min(left, window.innerWidth - 316)),
    };
  }, [currentStep, steps]);

  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      const pos = calculatePosition();
      setPosition(pos);
    }
  }, [isVisible, currentStep, calculatePosition, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const completeTour = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && steps[currentStep] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-0 z-50'
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='absolute inset-0 bg-foreground/20'
            onClick={handleSkip}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='absolute w-[300px] bg-card border rounded-lg shadow-sm p-4'
            style={{ top: position.top, left: position.left }}
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-xs text-muted-foreground'>
                {currentStep + 1} of {steps.length}
              </span>
              <Button variant='ghost' size='icon' className='h-6 w-6' onClick={handleSkip}>
                <X className='h-3 w-3 text-muted-foreground' />
              </Button>
            </div>

            <h3 className='text-sm font-medium text-foreground mb-1'>{steps[currentStep].title}</h3>
            <p className='text-xs text-muted-foreground mb-4 leading-relaxed'>
              {steps[currentStep].content}
            </p>

            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleSkip}
                className='flex-1 text-muted-foreground'
              >
                Skip
              </Button>
              <Button size='sm' onClick={handleNext} className='flex-1'>
                {currentStep === steps.length - 1 ? 'Done' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function OnboardingTooltip({
  storageKey,
  children,
  title,
  content,
}: {
  storageKey: string;
  children: React.ReactNode;
  title: string;
  content: string;
}) {
  const [isClient, setIsClient] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      setShowTooltip(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setShowTooltip(false);
  };

  if (!isClient) return <>{children}</>;

  return (
    <div className='relative group'>
      {children}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className='absolute z-50 w-56 bg-card border rounded-md shadow-sm p-3 -top-2 left-full ml-2'
        >
          <div className='flex items-start justify-between gap-2 mb-1'>
            <h4 className='text-sm font-medium'>{title}</h4>
            <Button
              variant='ghost'
              size='icon'
              className='h-5 w-5 flex-shrink-0'
              onClick={handleDismiss}
            >
              <X className='h-3 w-3 text-muted-foreground' />
            </Button>
          </div>
          <p className='text-xs text-muted-foreground leading-relaxed'>{content}</p>
        </motion.div>
      )}
    </div>
  );
}

export function WelcomeModal({
  isOpen,
  onClose,
  onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to LLMify',
      content:
        'Your unified interface for interacting with multiple AI models. Let me show you around.',
    },
    {
      title: 'Choose Your Model',
      content:
        'Select from GPT, Claude, DeepSeek, Grok and more. Each model has unique strengths for different tasks.',
    },
    {
      title: 'Your Conversations',
      content:
        'All your chats appear here in the sidebar. Click any chat to resume where you left off.',
    },
    {
      title: 'Ready to Go',
      content:
        'Type any question in the chat box to get started. No API key needed to begin exploring!',
    },
  ];

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className='fixed inset-0 z-50 flex items-center justify-center'
    >
      <div className='absolute inset-0 bg-foreground/15' onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='relative z-10 w-full max-w-sm mx-4 bg-card border rounded-lg shadow-sm p-5'
      >
        <div className='flex items-center justify-center mb-4'>
          <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-foreground'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
              />
            </svg>
          </div>
        </div>

        <div className='text-center mb-5'>
          <h2 className='text-base font-medium mb-1.5'>{tourSteps[step].title}</h2>
          <p className='text-xs text-muted-foreground leading-relaxed'>{tourSteps[step].content}</p>
        </div>

        <div className='flex gap-1.5 justify-center mb-4'>
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 rounded-full transition-all ${
                i === step ? 'w-5 bg-foreground' : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className='flex gap-2'>
          <Button variant='ghost' onClick={onClose} className='flex-1 text-muted-foreground'>
            Skip
          </Button>
          <Button onClick={handleNext} className='flex-1'>
            {step === tourSteps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
