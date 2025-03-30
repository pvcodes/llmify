import { motion } from 'framer-motion';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

import { Button, buttonVariants as shadcnButtonVariants } from '../ui/button';

export const Cta = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.section
      id='cta'
      className='bg-muted/50 py-16 my-24 sm:my-32 px-2'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <div className='container lg:grid lg:grid-cols-2 place-items-center'>
        <motion.div
          className='lg:col-start-1'
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
        >
          <motion.h2 className='text-3xl md:text-4xl font-bold' variants={item}>
            Unleash the Power of
            <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
              {' '}
              Language Models{' '}
            </span>
            with Ease
          </motion.h2>
          <motion.p className='text-muted-foreground text-xl mt-4 mb-8 lg:mb-0' variants={item}>
            Effortlessly connect to diverse AI models and transform your projects with LLMify&aops;s
            seamless interface. Discover the future of AI-driven innovation today!
          </motion.p>
        </motion.div>

        <motion.div
          className='space-y-4 lg:col-start-2'
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
        >
          <motion.div variants={item}>
            <Button className='w-full md:mr-4 md:w-auto' onClick={() => signIn()}>
              No more scrolling, Get Started
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Link
              className={`w-full md:w-auto ${shadcnButtonVariants({ variant: 'outline' })}`}
              href='#features'
            >
              <motion.span whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                View All Features
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
