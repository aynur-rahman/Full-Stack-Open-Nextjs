import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = { title: 'Blog app', description: 'A list of interesting blogs' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">home</Link>
          <Link href="/blogs">blogs</Link>
          <Link href="/blogs/new">new blog</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
