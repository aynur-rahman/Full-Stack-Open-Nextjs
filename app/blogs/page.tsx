import Link from 'next/link'
import { desc, asc, ilike } from 'drizzle-orm'
import { db } from '@/db'
import { blogs } from '@/db/schema'
import { BlogList } from '@/components/blog-list'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Blogs' }
export default async function Blogs({ searchParams }: { searchParams: Promise<{ filter?: string | string[] }> }) {
  const query = await searchParams
  const filter = typeof query.filter === 'string' ? query.filter : ''
  const escaped = filter.replace(/[\\%_]/g, '\\$&')
  const collection = await db.select().from(blogs).where(filter ? ilike(blogs.title, `%${escaped}%`) : undefined).orderBy(desc(blogs.likes), asc(blogs.id))
  return <section><div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Picked by readers</p><h1 className="page-title">The collection</h1><p className="text-stone-600">Good reads, most liked first.</p></div><Link className="button" href="/blogs/new">Share a blog</Link></div><form action="/blogs" className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="field flex-1" htmlFor="filter">Search by title<input className="input" id="filter" name="filter" data-testid="filter-input" defaultValue={filter} placeholder="Find an article…" /></label><button className="secondary" data-testid="search-button">Search</button>{filter && <Link href="/blogs" className="secondary">Clear</Link>}</form><BlogList blogs={collection} /></section>
}
