"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SessionProvider } from 'next-auth/react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()

<<<<<<<< HEAD:src/components/Provider.tsx
export default function Provider({
========
export default function Providers({
>>>>>>>> 4ce793a220faf90213ba364559ab5218d6cec054:src/components/Providers.tsx
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
<<<<<<<< HEAD:src/components/Provider.tsx
    </NextThemesProvider>
========
    </NextThemesProvider >
>>>>>>>> 4ce793a220faf90213ba364559ab5218d6cec054:src/components/Providers.tsx
}
