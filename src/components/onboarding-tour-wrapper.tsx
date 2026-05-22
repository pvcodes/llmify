'use client';

import dynamic from 'next/dynamic';

const OnboardingTour = dynamic(
  () => import('@/components/onboarding-tour').then((mod) => mod.OnboardingTour),
  { ssr: false, loading: () => null }
);

const onboardingSteps = [
  {
    target: '#new-chat-btn',
    title: 'Start a new chat',
    content: 'Click here to start a conversation with any AI model',
    placement: 'bottom' as const,
  },
  {
    target: '#model-selector',
    title: 'Choose your model',
    content: 'Switch between GPT, Claude, DeepSeek and more',
    placement: 'bottom' as const,
  },
  {
    target: '#user-menu',
    title: 'Your profile',
    content: 'Manage settings, API keys, and account',
    placement: 'bottom' as const,
  },
];

export function OnboardingTourWrapper({ userId }: { userId: string | number }) {
  const key = typeof userId === 'number' ? `onboarding-${userId}` : userId;
  return <OnboardingTour steps={onboardingSteps} storageKey={key} />;
}
