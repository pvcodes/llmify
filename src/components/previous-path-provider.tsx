import { usePathname } from 'next/navigation';
import { createContext, useContext, useRef, useEffect, useState } from 'react';

import type { ReactNode } from 'react';

// Define the context type
type PreviousPathContextType = {
  previousPath: string | null;
};

// Create the context with default value
const PreviousPathContext = createContext<PreviousPathContextType>({ previousPath: null });

// Props for the provider component
type PreviousPathProviderProps = {
  children: ReactNode;
};

/**
 * Provider component that tracks the previous path
 */
export function PreviousPathProvider({ children }: PreviousPathProviderProps) {
  const currentPath = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    // On first mount, just store current path
    if (prevPathRef.current === null) {
      prevPathRef.current = currentPath;
      return;
    }

    // If path has changed, update previous path
    if (currentPath !== prevPathRef.current) {
      setPreviousPath(prevPathRef.current);
      prevPathRef.current = currentPath;
    }
  }, [currentPath]);

  return (
    <PreviousPathContext.Provider value={{ previousPath }}>{children}</PreviousPathContext.Provider>
  );
}

/**
 * Hook to use the previous path from context
 */
export function usePreviousPath(): string | null {
  const context = useContext(PreviousPathContext);

  if (context === undefined) {
    throw new Error('usePreviousPath must be used within a PreviousPathProvider');
  }

  return context.previousPath;
}
