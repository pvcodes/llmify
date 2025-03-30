import { motion } from 'framer-motion';
import Image from 'next/image';

import cubeLeg from '../../../public/assets/cube-leg.png';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

import { MagnifierIcon, WalletIcon, ChartIcon } from './Icons';

import type { JSX } from 'react';

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: 'Diverse Model Access',
    description:
      'Connect with a broad range of AI models to suit various project needs and maximize creativity.',
    icon: <ChartIcon />,
  },
  {
    title: 'Effortless Integration',
    description:
      'Quickly integrate your projects using personal API keys or our global key for a streamlined experience.',
    icon: <WalletIcon />,
  },
  {
    title: 'Enhanced Productivity',
    description:
      'Boost efficiency by automating repetitive tasks with AI-driven solutions tailored to your workflow.',
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
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

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 10,
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  return (
    <section className='container py-24 sm:py-32'>
      <div className='grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center'>
        <motion.div
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, margin: '-100px' }}
          variants={container}
        >
          <motion.h2 className='text-3xl md:text-4xl font-bold' variants={item}>
            <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
              LLMify{' '}
            </span>
            Services
          </motion.h2>

          <motion.p className='text-muted-foreground text-xl mt-4 mb-8' variants={item}>
            Elevate your projects with AI-powered capabilities and seamless integration tailored to
            your needs.
          </motion.p>

          <motion.div className='flex flex-col gap-8' variants={container}>
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <motion.div key={title} variants={item} whileHover={{ y: -5 }}>
                <Card className='hover:shadow-lg transition-shadow'>
                  <CardHeader className='space-y-1 flex md:flex-row justify-start items-start gap-4'>
                    <motion.div
                      className='mt-1 bg-primary/20 p-1 rounded-2xl'
                      variants={iconVariants}
                      whileHover='hover'
                    >
                      {icon}
                    </motion.div>
                    <div>
                      <CardTitle>{title}</CardTitle>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <CardDescription className='text-md mt-2'>{description}</CardDescription>
                      </motion.div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
          whileHover='hover'
          className='w-[300px] md:w-[500px] lg:w-[600px]'
        >
          <Image src={cubeLeg} alt='About services' className='object-contain' priority />
        </motion.div>
      </div>
    </section>
  );
};
