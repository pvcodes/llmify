import Image from 'next/image';

import { APP_NAME } from '@/lib/constant';

import pilot from '../../../public/assets/pilot.png';

import { Statistics } from './Statistics';

export const About = () => {
  return (
    <section id='about' className='container py-24 sm:py-32'>
      <div className='bg-muted/50 border rounded-lg py-12'>
        <div className='px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12'>
          <Image src={pilot} alt='pilot' className='w-[300px] object-contain rounded-lg' />
          <div className='bg-green-0 flex flex-col justify-between'>
            <div className='pb-6'>
              <h2 className='text-3xl md:text-4xl font-bold'>
                <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
                  About{' '}
                </span>
                {APP_NAME}
              </h2>
              <p className='text-xl text-muted-foreground mt-4'>
                Welcome to LLMify, your gateway to the world of advanced language models. Our
                platform is designed to empower developers, researchers, and innovators by providing
                easy access to a diverse range of large language models (LLMs) through a single,
                user-friendly interface.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
