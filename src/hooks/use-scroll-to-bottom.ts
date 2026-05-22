import { useCallback, useEffect, useRef } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  React.RefObject<HTMLDivElement | null>,
  () => void,
] {
  const containerRef = useRef<T | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const isAtBottom = useRef(true);

  const scrollToBottom = useCallback(() => {
    isAtBottom.current = true;
    endRef.current?.scrollIntoView({ block: 'end' });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const threshold = 50;
      isAtBottom.current = scrollHeight - scrollTop - clientHeight <= threshold;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return [containerRef, endRef, scrollToBottom];
}
