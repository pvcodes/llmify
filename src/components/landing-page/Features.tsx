import { motion } from 'framer-motion';
import Image from 'next/image';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import image from '../../../public/assets/growth.png';
import image4 from '../../../public/assets/looking-ahead.png';
import image3 from '../../../public/assets/reflecting.png';
import { Badge } from '../ui/badge';

import type { StaticImageData } from 'next/image';

interface FeatureProps {
  title: string;
  description: string;
  image: StaticImageData;
}

const features: FeatureProps[] = [
  {
    title: 'Diverse Model Access',
    description:
      'Easily connect with a wide range of AI models to meet various project requirements.',
    image: image4,
  },
  {
    title: 'Seamless Integration',
    description:
      'Quickly integrate using your API keys or our global key for a smooth setup process.',
    image: image3,
  },
  {
    title: 'AI-Powered Insights',
    description:
      'Leverage AI to gain valuable insights and enhance decision-making in your projects.',
    image: image,
  },
];

const featureList: string[] = [
  'Multi-Model Access',
  'Easy Integration',
  'AI Insights',
  'User-Friendly Interface',
  'Community Support',
  'Real-Time Collaboration',
  'Scalable Solutions',
  'Flexible API',
];

export const Features = () => {
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

  const badgeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    show: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 200,
      },
    }),
    hover: { scale: 1.05 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: { y: -5 },
  };

  return (
    <section id='features' className='container py-24 sm:py-32 space-y-8'>
      <motion.h2
        className='text-3xl lg:text-4xl font-bold md:text-center'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        Many{' '}
        <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
          Great Features
        </span>
      </motion.h2>

      <motion.div
        className='flex flex-wrap md:justify-center gap-4'
        variants={container}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-50px' }}
      >
        {featureList.map((feature: string, i: number) => (
          <motion.div key={feature} variants={badgeVariants} custom={i} whileHover='hover'>
            <Badge variant='secondary' className='text-sm'>
              {feature}
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
        variants={container}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-100px' }}
      >
        {features.map(({ title, description, image }: FeatureProps) => (
          <motion.div key={title} variants={cardVariants} whileHover='hover'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {description}
                </motion.p>
              </CardContent>

              <CardFooter>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.4,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Image
                    alt='About feature'
                    src={image}
                    className='w-[200px] lg:w-[300px] mx-auto'
                    loading='lazy'
                    width={300}
                    height={200}
                  />
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
