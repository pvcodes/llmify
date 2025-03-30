import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

import { Button } from '../ui/button';

import { HeroCards } from './HeroCards';

export const Hero = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className='container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10'
      initial='hidden'
      animate='show'
      variants={container}
    >
      <div className='text-center lg:text-start space-y-6'>
        <motion.main className='text-5xl md:text-6xl font-bold' variants={item}>
          <h1 className='inline'>
            <span className='inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text'>
              LLMs
            </span>{' '}
            under one
          </h1>{' '}
          <h2>
            <span className='inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text'>
              roof
            </span>{' '}
            together
          </h2>
        </motion.main>

        <motion.p
          className='text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0'
          variants={item}
        >
          Access diverse LLMs effortlessly with all the tools you need for your project.
        </motion.p>

        <motion.div className='space-y-4 md:space-y-0 md:space-x-4' variants={item}>
          <Button className='w-full md:w-1/3' onClick={() => signIn()}>
            Get Started
          </Button>
        </motion.div>
      </div>

      {/* Hero cards sections */}
      <motion.div
        className='z-10'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <HeroCards />
      </motion.div>

      {/* Shadow effect */}
      <div className='shadow' />
    </motion.section>
  );
};
