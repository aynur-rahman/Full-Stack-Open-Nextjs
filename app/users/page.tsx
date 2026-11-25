import Link from 'next/link'
import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Readers' }
export default async function Users() {
  const collection = await db.select({ id: users.id, name: users.name, username: users.username }).from(users).orderBy(asc(users.name))
  return <section><p className="eyebrow">The people behind the picks</p><h1 className="page-title">Our readers</h1><ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{collection.map(user => <li key={user.id} className="panel"><Link className="break-words font-serif text-2xl hover:underline" href={`/users/${user.username}`}>{user.name}</Link><p className="mt-2 break-all text-sm text-stone-600">@{user.username}</p></li>)}</ul>{!collection.length && <p className="mt-6 text-stone-600">No readers yet. Be the first to join.</p>}</section>
}
