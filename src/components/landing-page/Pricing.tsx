import { BillingLevel } from '@prisma/client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { PLANS } from '@/lib/plans';

const plans = [
  {
    title: 'Free',
    price: 0,
    description: 'Experience powerful AI capabilities at no cost using your own API key!',
    currency: 'USD',
    currencySymbol: '$',
    benefitList: [
      '100k free tokens to get started',
      'Unlimited conversations',
      'Switch between models seamlessly',
      'Access to selected OpenAI, DeepSeek, and Anthropic models',
      "Access all the features if you got your model's API key!",
    ],
    tier: BillingLevel.FREE,
  },
  ...PLANS,
];

export const Pricing = () => {
  const router = useRouter();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const listItem = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <section id='plans' className='container py-24 sm:py-32'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
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
      </motion.div>

      <motion.div
        className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
        variants={container}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-50px' }}
      >
        {plans.map((plan) => (
          <motion.div key={plan.title}>
            <Card>
              <CardHeader>
                <div>
                  <span className='text-3xl font-bold'>
                    {plan.currencySymbol}
                    {plan.price}
                  </span>
                  <span className='text-muted-foreground'> /month</span>
                </div>

                <CardDescription>
                  {plan.description}
                  {plan.title === 'Free' && <p>No API key? Still can use 5000 tokens for free</p>}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button
                  className='w-full'
                  onClick={() =>
                    plan.tier === 'FREE' ? router.push('/new') : router.push('/plans')
                  }
                >
                  Get Started
                </Button>
              </CardContent>

              <hr className='w-4/5 m-auto mb-4' />

              <CardFooter className='flex'>
                <motion.div className='space-y-4' initial='hidden' animate='visible'>
                  {plan.benefitList.map((benefit: string, i: number) => (
                    <motion.span key={benefit} className='flex' custom={i} variants={listItem}>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.2,
                        }}
                      >
                        <Check className='text-green-500' />
                      </motion.div>
                      <h3 className='ml-2'>{benefit}</h3>
                    </motion.span>
                  ))}
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
