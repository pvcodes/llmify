'use client';

import { Moon, Sun, Monitor } from 'lucide-react';

import { useTheme } from '@/components/theme-provider';

import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <Button variant='ghost' size='icon' onClick={cycleTheme} aria-label={`Theme: ${theme}`}>
      <Icon className='w-4 h-4' />
    </Button>
  );
}
