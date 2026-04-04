'use client';

import { MessageSquare, Cpu, Settings, BarChart3, ArrowRight, Zap } from 'lucide-react';
import { signIn } from 'next-auth/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'Multi-Model Access',
    description: 'GPT, Claude, DeepSeek, Grok and more — unified interface',
    icon: Cpu,
  },
  {
    title: 'Smart Conversations',
    description: 'Context-aware chat with memory and customization',
    icon: MessageSquare,
  },
  {
    title: 'Fine-Tuned Controls',
    description: 'Adjust creativity, length, and technical depth',
    icon: Settings,
  },
  {
    title: 'Usage Analytics',
    description: 'Track tokens, costs, and model performance',
    icon: BarChart3,
  },
];

export const Hero = () => {
  return (
    <div className='min-h-screen bg-background md:min-w-3xl'>
      <div className='mx-auto px-2 pt-24 pb-16 md:pt-32 md:pb-24'>
        <div className='mb-16 animate-fade-up'>
          <Badge variant='outline' className='mb-6'>
            <Zap className='w-3 h-3 mr-1.5' />
            AI Platform
          </Badge>
          <h1 className='text-5xl md:text-7xl font-display uppercase tracking-tighter mb-4'>
            LLMs Under
            <br />
            One Roof
          </h1>
          <p className='text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed'>
            Access diverse AI models effortlessly. GPT, Claude, DeepSeek — all unified in one
            powerful interface.
          </p>
        </div>

        <div
          className='flex flex-col sm:flex-row gap-3 mb-16 animate-fade-up'
          style={{ animationDelay: '0.1s' }}
        >
          <Button size='lg' onClick={() => signIn()}>
            Get Started
            <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
          <Button size='lg' variant='outline' onClick={() => signIn()}>
            View Demo
          </Button>
        </div>

        <nav className='space-y-3'>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className='block group animate-fade-up'
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className='hover:border-primary/50 hover:bg-secondary/20 transition-all duration-300 cursor-pointer border bg-card'>
                <div className='flex flex-row items-center gap-4 p-4'>
                  <div className='w-12 h-12 flex items-center justify-center bg-secondary/50 border border-border group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors'>
                    <feature.icon className='h-5 w-5 text-foreground group-hover:text-primary transition-colors' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-medium mb-1'>{feature.title}</h3>
                    <p className='text-sm text-muted-foreground'>{feature.description}</p>
                  </div>
                  <ArrowRight className='h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300' />
                </div>
              </div>
            </div>
          ))}
        </nav>

        <footer
          className='mt-16 pt-8 border-t border-border animate-fade-up'
          style={{ animationDelay: '0.6s' }}
        >
          <p className='text-xs text-muted-foreground uppercase tracking-wider'>
            Built for developers
          </p>
        </footer>
      </div>
    </div>
  );
};
