import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { blogs } from '@/db/schema'
import { like } from '@/app/actions'

export const dynamic = 'force-dynamic'

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  if (!Number.isSafeInteger(id) || id < 1) notFound()
  const blog = await db.query.blogs.findFirst({ where: eq(blogs.id, id), with: { user: true } })
  if (!blog) notFound()
  return (
    <div>
      <h1>{blog.title}</h1>
      <p>by {blog.author}</p>
      <p><a href={blog.url}>{blog.url}</a></p>
      <form action={like} className="inline">
        <input type="hidden" name="id" value={blog.id} />
        <span data-testid="like-count">{blog.likes} likes</span>
        <button type="submit">like</button>
      </form>
      {blog.user && <p>added by <Link href={`/users/${blog.user.username}`}>{blog.user.name}</Link></p>}
    </div>
  )
}
