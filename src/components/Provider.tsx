'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export function Provider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  );
}
