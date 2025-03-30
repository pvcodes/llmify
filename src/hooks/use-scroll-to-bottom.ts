import { useEffect, useRef, useState, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T | null>,
  RefObject<T | null>,
  () => void,
] {
  const containerRef = useRef<T | null>(null);
  const endRef = useRef<T | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const handleScroll = () => {
        // Check if user has scrolled up manually
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
        setIsAutoScrolling(isNearBottom);
      };

      container.addEventListener('scroll', handleScroll);

      const observer = new MutationObserver(() => {
        if (isAutoScrolling && end) {
          end.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isAutoScrolling]);

  const scrollToBottom = () => {
    if (endRef.current) {
      setIsAutoScrolling(true);
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return [containerRef, endRef, scrollToBottom];
}
