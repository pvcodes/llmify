import { BillingLevel } from '@prisma/client';
export interface PlanProps {
  tier: BillingLevel;
  title: string;
  price: number;
  currency: string;
  currencySymbol: string;
  description: string;
  benefitList: string[];
}
// Move static data outside component
export const PLANS: PlanProps[] = [
  {
    tier: BillingLevel.PREMIUM,
    title: 'Premium',
    price: 2.99,
    description:
      'Supercharge your conversations with our Premium plan — unlock powerful AI capabilities at an incredible value!',
    currency: 'USD',
    currencySymbol: '$',
    benefitList: [
      'Unlimited conversations, no restrictions',
      'Seamlessly switch between models mid-conversation',
      'Access to 3 cutting-edge AI models (GPT, Gemini, DeepSeek)',
      'Generous 2M tokens monthly — enough for 1M+ words of content',
    ],
  },
  {
    title: 'Enterprise',
    price: 9.99,
    description:
      'Elevate your experience with our Enterprise plan — the ultimate toolkit for power users who demand the absolute best in AI technology!',
    currency: 'USD',
    currencySymbol: '$',
    benefitList: [
      'Unlimited conversations with no constraints',
      'Effortlessly switch between any AI model whenever you need',
      'Full access to our complete suite of premium AI models',
      'Unlimited tokens — generate as much content as you need without limits',
    ],
    tier: BillingLevel.ENTERPRISE,
  },
] as const;
