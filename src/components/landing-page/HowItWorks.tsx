import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from './Icons';

import type { JSX } from 'react';

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: 'Model Diversity',
    description:
      'Access a wide range of language models to suit different project needs and creativity levels.',
  },
  {
    icon: <MapIcon />,
    title: 'Community Support',
    description:
      'Join a vibrant community of AI enthusiasts and developers to share insights and collaborate.',
  },
  {
    icon: <PlaneIcon />,
    title: 'Seamless Integration',
    description:
      'Effortlessly integrate with our API using your own keys or our global key for smooth operations.',
  },
  {
    icon: <GiftIcon />,
    title: 'User-Friendly Experience',
    description:
      'Enjoy an intuitive interface designed to enhance productivity and streamline your AI interactions.',
  },
];
export const HowItWorks = () => {
  return (
    <section id='howItWorks' className='container text-center py-24 sm:py-32'>
      <h2 className='text-3xl md:text-4xl font-bold '>
        How It{' '}
        <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
          Works{' '}
        </span>
        Step-by-Step Guide
      </h2>
      <p className='md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground'>
        Effortlessly connect to powerful language models using your own API keys or our global API
        key. Simply choose a model, start your interaction, and let LLMify handle the rest!
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title} className='bg-muted/50'>
            <CardHeader>
              <CardTitle className='grid gap-4 place-items-center'>
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
