import './globals.css'

import type { Metadata } from 'next'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Inter } from 'next/font/google'

import QueryProvider from '@/providers/query'

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from '@/providers/theme'
import { userLoggedData } from '@/actions/user';

import UserProvider from '@/providers/user'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'App',
  description: 'App',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const user = await userLoggedData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <UserProvider value={user}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <Toaster />
              {children}
            </ThemeProvider>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
