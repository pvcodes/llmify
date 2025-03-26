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
  return (
    <section id='features' className='container py-24 sm:py-32 space-y-8'>
      <h2 className='text-3xl lg:text-4xl font-bold md:text-center'>
        Many{' '}
        <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
          Great Features
        </span>
      </h2>

      <div className='flex flex-wrap md:justify-center gap-4'>
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant='secondary' className='text-sm'>
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <Image alt='About feature' src={image} className='w-[200px] lg:w-[300px] mx-auto' />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
