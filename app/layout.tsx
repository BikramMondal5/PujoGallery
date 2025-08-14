import type { Metadata } from 'next'
import { PostProvider } from '@/context/PostContext'
import { SuppressHydrationWarnings } from '@/components/suppress-hydration-warnings'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'PujoGallery - Share Your Pujo Moments',
  description: 'A social feed where users can share their pujo moments',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SuppressHydrationWarnings>
            <PostProvider>
              {children}
            </PostProvider>
          </SuppressHydrationWarnings>
        </ThemeProvider>
      </body>
    </html>
  )
}
