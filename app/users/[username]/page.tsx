import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { users } from '@/db/schema'
import { BlogList } from '@/components/blog-list'
export const dynamic = 'force-dynamic'
export default async function User({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const user = await db.query.users.findFirst({ where: eq(users.username, username), columns: { id: true, name: true, username: true }, with: { blogs: true } })
  if (!user) notFound()
  return <section><p className="eyebrow">Reader profile</p><h1 className="page-title [overflow-wrap:anywhere]">{user.name}</h1><p className="mb-8 text-stone-600">@{user.username}</p><h2 className="mb-5 text-2xl">Shared articles</h2><BlogList blogs={user.blogs} /></section>
}
