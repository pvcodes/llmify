import { BillingLevel } from '@prisma/client';

export interface PlanProps {
  tier: BillingLevel;
  title: string;
  price: number;
  currency: string;
  currencySymbol: string;
  description: string;
  buttonText: string;
  benefitList: string[];
}

// Move static data outside component
export const PLANS: PlanProps[] = [
  {
    tier: BillingLevel.PREMIUM,
    title: 'Premium',
    price: 2.99,
    description: 'Unlock more potential with our Premium plan.',
    buttonText: 'Get Started',
    currency: 'USD',
    currencySymbol: '$',
    benefitList: [
      'Unlimited Chats',
      'Change models anytime during chat',
      'Access to 3 LLM models (GPT, Gemini, DeepSeek)',
      '20,000 tokens per month',
    ],
  },
  {
    title: 'Enterprise',
    price: 999,
    description: 'Maximize your capabilities with our Enterprise plan.',
    buttonText: 'Contact Us',
    currency: 'USD',
    currencySymbol: '$',
    benefitList: [
      'Unlimited Chats',
      'Change models anytime during chat',
      'Access to all LLM models',
      'No token limit',
    ],
    tier: BillingLevel.ENTERPRISE,
  },
] as const;
