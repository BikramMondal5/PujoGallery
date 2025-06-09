import type { Metadata } from 'next'
import { PostProvider } from '@/context/PostContext'
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
    <html lang="en">
      <body>
        <PostProvider>
          {children}
        </PostProvider>
      </body>
    </html>
  )
}
