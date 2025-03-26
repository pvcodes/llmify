import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: 'Free',
    popular: 0,
    price: 0,
    description: 'Explore all LLMs with your API key.',
    buttonText: 'Get Started',
    benefitList: [
      'Unlimited Chats',
      'Change models anytime during chat',
      'Access to all streamlined LLM models',
    ],
  },
  {
    title: 'Premium',
    popular: 1,
    price: 299,
    description: 'Unlock more potential with our Premium plan.',
    buttonText: 'Get Started',
    benefitList: [
      'Unlimited Chats',
      'Change models anytime during chat',
      'Access to 3 LLM models (GPT, Gemini, DeepSeek)',
      '20,000 tokens per month',
    ],
  },
  {
    title: 'Enterprise',
    popular: 0,
    price: 999,
    description: 'Maximize your capabilities with our Enterprise plan.',
    buttonText: 'Contact Us',
    benefitList: [
      'Unlimited Chats',
      'Change models anytime during chat',
      'Access to all LLM models',
      'No token limit',
    ],
  },
];

export const Pricing = () => {
  return (
    <section id='pricing' className='container py-24 sm:py-32'>
      <h2 className='text-3xl md:text-4xl font-bold text-center'>
        Get
        <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
          {' '}
          Unlimited{' '}
        </span>
        Access
      </h2>
      <h3 className='text-xl text-center text-muted-foreground pt-4 pb-8'>
        Choose the plan that best fits your AI needs and unlock unlimited potential with LLMify.
      </h3>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? 'drop-shadow-xl shadow-black/10 dark:shadow-white/10'
                : ''
            }
          >
            <CardHeader>
              <CardTitle className='flex item-center justify-between'>
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant='secondary' className='text-sm text-primary'>
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className='text-3xl font-bold'>₹{pricing.price}</span>
                <span className='text-muted-foreground'> /month</span>
              </div>

              <CardDescription>
                {pricing.description}
                {pricing.title === 'Free' && <p>No API key? Still can use 5000 token for free</p>}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button className='w-full' disabled={pricing.title !== 'Free'}>
                {pricing.buttonText}
              </Button>
            </CardContent>

            <hr className='w-4/5 m-auto mb-4' />

            <CardFooter className='flex'>
              <div className='space-y-4'>
                {pricing.benefitList.map((benefit: string) => (
                  <span key={benefit} className='flex'>
                    <Check className='text-green-500' /> <h3 className='ml-2'>{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
