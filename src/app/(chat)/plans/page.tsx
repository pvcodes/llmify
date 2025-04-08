import { BillingLevel } from '@prisma/client';
import { Check, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { getUserBilling } from '@/actions/billing';
import { getAuthenticatedUser } from '@/actions/misc';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SUPPORT_EMAIL } from '@/lib/constant';
import { type PlanProps, PLANS } from '@/lib/plans';
import { formatDate } from '@/lib/utils';

import { PaypalButton } from './paypal-button';

export default async function PlanPage() {
  const user = await getAuthenticatedUser();
  const billingInfo = await getUserBilling(user.id);
  if (!billingInfo) return;
  const currentTier = billingInfo?.level;

  // Find enterprise plan for reference
  const enterprisePlan = PLANS.find((plan) => plan.tier === 'ENTERPRISE');

  // Enterprise Tier View
  if (currentTier === 'ENTERPRISE') {
    return (
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <section className='pt-10 pb-16 sm:pb-24 text-center'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight'>
            Your{' '}
            <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text mx-2'>
              Enterprise
            </span>{' '}
            Plan
          </h2>
          <h3 className='text-lg sm:text-xl lg:text-2xl text-muted-foreground mt-4 max-w-2xl mx-auto'>
            You&apos;re enjoying our highest tier with maximum capabilities.
          </h3>
        </section>

        <div className='max-w-3xl mx-auto'>
          <Card className='border shadow-md'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-xl sm:text-2xl font-semibold flex items-center gap-2'>
                    <Sparkles className='h-6 w-6 text-primary' />
                    Enterprise Plan
                  </CardTitle>
                  <CardDescription className='mt-2'>Your subscription details</CardDescription>
                </div>
                <div className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium'>
                  Active
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='p-4 bg-muted/50 rounded-lg'>
                    <p className='text-sm text-muted-foreground'>Subscription Started</p>
                    <p className='font-medium'>{formatDate(billingInfo.startDate)}</p>
                  </div>
                  <div className='p-4 bg-muted/50 rounded-lg'>
                    <p className='text-sm text-muted-foreground'>Token Usage</p>
                    <p className='font-medium'>{billingInfo?.tokenUsage ?? 0} / Unlimited</p>
                  </div>
                </div>

                <div className='pt-4'>
                  <h4 className='font-medium mb-3'>Plan Features</h4>
                  <ul className='space-y-3'>
                    {enterprisePlan?.benefitList.map((benefit) => (
                      <li key={benefit} className='flex items-center gap-2'>
                        <Check className='h-5 w-5 text-green-500 flex-shrink-0' />
                        <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300'>
                          {benefit}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col sm:flex-row gap-4 pt-6'>
              <Button variant='secondary' className='w-full sm:w-auto' asChild>
                <Link href={`mailto:${SUPPORT_EMAIL}`}>Need Custom Solutions? Contact Support</Link>
              </Button>
              <span className='text-sm text-muted-foreground'>or</span>
              <Link href='/support' className='underline text-sm text-muted-foreground'>
                Raise a ticket at support
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Premium Tier View - Show current plan and upgrade option to Enterprise
  if (currentTier === 'PREMIUM') {
    // Find both premium and enterprise plans
    const premiumPlan = PLANS.find((plan) => plan.tier === 'PREMIUM');

    return (
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <section className='pt-10 pb-16 sm:pb-24 text-center'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight'>
            Your{' '}
            <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text mx-2'>
              Premium
            </span>{' '}
            Plan
          </h2>
          <h3 className='text-lg sm:text-xl lg:text-2xl text-muted-foreground mt-4 max-w-2xl mx-auto'>
            Upgrade to unlock even more capabilities or customize your experience.
          </h3>
        </section>

        <div className='grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 pb-12 max-w-5xl mx-auto'>
          {/* Current Plan Card */}
          <Card className='flex flex-col border shadow-sm hover:shadow-md transition-shadow duration-300 border-primary/20 bg-primary/5'>
            <CardHeader className='pb-4'>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='text-xl sm:text-2xl font-semibold flex items-center gap-2'>
                    <Award className='h-5 w-5 text-primary' />
                    {premiumPlan?.title}
                  </CardTitle>
                  <div className='flex items-baseline gap-2 mt-2'>
                    <span className='text-3xl sm:text-4xl font-bold text-primary'>
                      {premiumPlan?.currencySymbol}
                      {premiumPlan?.price}
                    </span>
                    <span className='text-sm text-muted-foreground'>/month</span>
                  </div>
                </div>
                <div className='bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium'>
                  Current Plan
                </div>
              </div>
              <CardDescription className='mt-3 text-sm sm:text-base'>
                {premiumPlan?.description || 'Your current premium subscription'}
              </CardDescription>
            </CardHeader>

            <CardContent className='pt-0 flex-grow'>
              <div className='space-y-2'>
                <div className='p-3 bg-muted/50 rounded-lg'>
                  <p className='text-sm text-muted-foreground'>Subscription Started</p>
                  <p className='font-medium'>{formatDate(billingInfo.startDate)}</p>
                </div>
                <div className='p-3 bg-muted/50 rounded-lg'>
                  <p className='text-sm text-muted-foreground'>Token Usage</p>
                  <p className='font-medium'>{billingInfo?.tokenUsage ?? 0} tokens used</p>
                </div>
              </div>
            </CardContent>

            <hr className='w-11/12 mx-auto border-gray-200 dark:border-gray-800' />

            <CardFooter className='pt-6'>
              <ul className='space-y-3 w-full'>
                {premiumPlan?.benefitList.map((benefit) => (
                  <li key={benefit} className='flex items-center gap-2'>
                    <Check className='h-5 w-5 text-green-500 flex-shrink-0' />
                    <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300'>
                      {benefit}
                    </p>
                  </li>
                ))}
              </ul>
            </CardFooter>
          </Card>

          {/* Enterprise Upgrade Card */}
          <Card className='flex flex-col border shadow-sm hover:shadow-md transition-shadow duration-300'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl sm:text-2xl font-semibold flex items-center gap-2'>
                <Sparkles className='h-5 w-5 text-primary' />
                {enterprisePlan?.title || 'Enterprise'}
              </CardTitle>
              <div className='flex items-baseline gap-2'>
                <span className='text-3xl sm:text-4xl font-bold text-primary'>
                  {enterprisePlan?.currencySymbol || '$'}
                  {enterprisePlan?.price || '99'}
                </span>
                <span className='text-sm text-muted-foreground'>/month</span>
              </div>
              <CardDescription className='mt-2 text-sm sm:text-base'>
                {enterprisePlan?.description || 'For businesses with advanced AI needs'}
              </CardDescription>
            </CardHeader>

            <CardContent className='pt-0 flex-grow'>
              <PaypalButton
                paypalClientId={process.env.PAYPAL_CLIENT_ID!}
                environment={process.env.NODE_ENV === 'development' ? 'sandbox' : 'production'}
                tier='ENTERPRISE'
              />
            </CardContent>

            <hr className='w-11/12 mx-auto border-gray-200 dark:border-gray-800' />

            <CardFooter className='pt-6'>
              <ul className='space-y-3 w-full'>
                {enterprisePlan?.benefitList.map((benefit) => (
                  <li key={benefit} className='flex items-center gap-2'>
                    <Check className='h-5 w-5 text-green-500 flex-shrink-0' />
                    <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300'>
                      {benefit}
                    </p>
                  </li>
                ))}
              </ul>
            </CardFooter>
          </Card>
        </div>

        <div className='text-center pb-12'>
          <p className='text-muted-foreground mb-2'>Need a custom solution?</p>
          <Button variant='outline' asChild>
            <a href={`mailto:${SUPPORT_EMAIL}`}>Contact our support team</a>
          </Button>
        </div>
      </div>
    );
  }

  // Free Tier View - Show all plans (original code)
  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
      {/* Header Section */}
      <section className='pt-10 pb-16 sm:pb-24 text-center'>
        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight'>
          Get
          <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text mx-2'>
            Unlimited
          </span>
          Access
        </h2>
        <h3 className='text-lg sm:text-xl lg:text-2xl text-muted-foreground mt-4 max-w-2xl mx-auto'>
          Choose the plan that best fits your AI needs and unlock unlimited potential with LLMify.
        </h3>
      </section>

      {/* Plans Grid */}
      <section className='grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 pb-12 max-w-5xl mx-auto'>
        {PLANS.map(
          (plan: PlanProps) =>
            plan.tier !== BillingLevel.FREE && (
              <Card
                key={plan.title}
                className='flex flex-col border shadow-sm hover:shadow-md transition-shadow duration-300'
              >
                <CardHeader className='pb-4'>
                  <CardTitle className='text-xl sm:text-2xl font-semibold'>{plan.title}</CardTitle>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-3xl sm:text-4xl font-bold text-primary'>
                      {plan.currencySymbol}
                      {plan.price}
                    </span>
                    <span className='text-sm text-muted-foreground'>/month</span>
                  </div>
                  <CardDescription className='mt-2 text-sm sm:text-base'>
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className='pt-0 flex-grow'>
                  <PaypalButton
                    paypalClientId={process.env.PAYPAL_CLIENT_ID!}
                    environment={process.env.NODE_ENV === 'development' ? 'sandbox' : 'production'}
                    tier={plan.tier}
                  />
                </CardContent>

                <hr className='w-11/12 mx-auto border-gray-200 dark:border-gray-800' />

                <CardFooter className='pt-6'>
                  <ul className='space-y-3 w-full'>
                    {plan.benefitList.map((benefit: string) => (
                      <li key={benefit} className='flex items-center gap-2'>
                        <Check className='h-5 w-5 text-green-500 flex-shrink-0' />
                        <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300'>
                          {benefit}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardFooter>
              </Card>
            )
        )}
      </section>
      <div className='text-center pb-12 flex flex-col'>
        <div>
          <p className='text-muted-foreground mb-2'>Need a custom solution?</p>
          <Button variant='outline' asChild>
            <a href={`mailto:${SUPPORT_EMAIL}`}>Contact our support team</a>
          </Button>
        </div>
        <span className='text-sm text-muted-foreground'>or</span>
        <div>
          <Link href='/support' className='underline text-sm text-muted-foreground'>
            Raise a ticket at support
          </Link>
        </div>
      </div>
    </div>
  );
}
