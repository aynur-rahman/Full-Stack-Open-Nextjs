import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
export const metadata: Metadata = { title: { default: 'Reading Room', template: '%s | Reading Room' }, description: 'A shared collection of thoughtful articles and a reading list of your own.' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Skip to content</a><Providers><Navigation /><main id="main" className="mx-auto min-h-[75vh] max-w-6xl px-5 py-10 sm:px-8 sm:py-16">{children}</main><footer className="mx-auto max-w-6xl border-t border-stone-300 px-5 py-7 text-sm text-stone-600 sm:px-8">Reading Room · A place for good reads.</footer></Providers></body></html>
}
