import { DM_Sans, Oswald, JetBrains_Mono } from 'next/font/google';

import { Provider } from '@/components/Provider';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constant';
import { cn } from '@/lib/utils';

import type { Metadata, Viewport } from 'next';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(dmSans.variable, oswald.variable, jetbrainsMono.variable)}
    >
      <body className='min-h-screen'>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <Provider attribute='class' defaultTheme='dark'>
              <Toaster position='top-center' />
              {children}
            </Provider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
