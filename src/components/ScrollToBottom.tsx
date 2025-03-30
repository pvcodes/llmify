import { ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

const ScrollToBottom = ({ className }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled up from bottom
      const scrolledFromBottom =
        window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 200;

      setIsVisible(scrolledFromBottom);
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup listener
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToBottom}
          className={cn('fixed bottom-25 right-4 z-50 opacity-90 shadow-md', className)}
          size='icon'
          variant='secondary'
        >
          <ArrowDown className='h-4 w-4' />
        </Button>
      )}
    </>
  );
};

export default ScrollToBottom;
