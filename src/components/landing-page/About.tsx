import { motion } from 'framer-motion';
import Image from 'next/image';

import { APP_NAME } from '@/lib/constant';

import pilot from '../../../public/assets/pilot.png';

import { Statistics } from './Statistics';

export const About = () => {
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

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id='about' className='container py-24 sm:py-32'>
      <motion.div
        className='bg-muted/50 border rounded-lg py-12'
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-100px' }}
        variants={container}
      >
        <div className='px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12'>
          <motion.div variants={imageVariants} className='flex items-center justify-center'>
            <Image
              src={pilot}
              alt='pilot'
              className='w-[300px] object-contain rounded-lg'
              priority
            />
          </motion.div>

          <motion.div className='bg-background flex flex-col justify-between' variants={container}>
            <motion.div className='pb-6' variants={item}>
              <h2 className='text-3xl md:text-4xl font-bold'>
                <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
                  About{' '}
                </span>
                {APP_NAME}
              </h2>
              <motion.p className='text-xl text-muted-foreground mt-4' variants={item}>
                Welcome to LLMify, your gateway to the world of advanced language models. Our
                platform is designed to empower developers, researchers, and innovators by providing
                easy access to a diverse range of large language models (LLMs) through a single,
                user-friendly interface.
              </motion.p>
            </motion.div>

            <motion.div variants={item}>
              <Statistics />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
