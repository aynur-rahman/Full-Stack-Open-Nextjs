"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useNotification } from './providers'
export function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname(), router = useRouter(), notify = useNotification()
  const item = (href: string, name: string) => <Link href={href} aria-current={pathname === href ? 'page' : undefined} className={`inline-flex min-h-11 items-center px-2 text-sm font-semibold ${pathname === href ? 'text-[#175c52] underline underline-offset-8' : 'text-stone-600 hover:text-[#175c52]'}`}>{name}</Link>
  return <header className="border-b border-stone-300 bg-white/80"><nav aria-label="Main navigation" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8"><Link href="/" className="mr-6 flex min-h-11 items-center font-serif text-2xl font-bold tracking-tight">Reading Room<span aria-hidden="true" className="ml-1 text-amber-700">.</span></Link><div className="flex flex-wrap items-center gap-2 sm:gap-4">{item('/', 'home')}{item('/blogs', 'blogs')}{item('/users', 'users')}{session ? <>{item('/blogs/new', 'new blog')}{item('/me', 'me')}<button className="secondary text-sm" onClick={async () => { await signOut({ redirect: false }); notify('Logged out.'); router.push('/'); router.refresh() }}>Logout</button></> : status !== 'loading' ? <>{item('/login', 'login')}{item('/register', 'register')}</> : <span className="text-sm text-stone-600" role="status">Loading account…</span>}</div></nav></header>
}
