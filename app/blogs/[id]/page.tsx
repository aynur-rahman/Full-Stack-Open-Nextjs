import Link from 'next/link'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { blogs, readingList } from '@/db/schema'
import { getCurrentUser } from '@/lib/session'
import { positiveId } from '@/lib/validation'
import { ActionForm } from '@/components/action-form'
import { likeBlog, addToReadingList } from '@/app/actions'
export const dynamic = 'force-dynamic'
export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const id = positiveId((await params).id)
  if (!id) notFound()
  const blog = await db.query.blogs.findFirst({ where: eq(blogs.id, id), with: { user: { columns: { name: true, username: true } } } })
  if (!blog) notFound()
  const user = await getCurrentUser()
  const saved = user ? await db.query.readingList.findFirst({ where: and(eq(readingList.userId, user.id), eq(readingList.blogId, id)) }) : null
  return <article className="mx-auto max-w-3xl" data-testid="blog-detail"><Link href="/blogs" className="mb-7 inline-flex min-h-11 items-center text-sm font-semibold text-[#175c52]">← Back to blogs</Link><div className="panel"><p className="eyebrow">From the collection</p><h1 data-testid="blog-title" className="page-title [overflow-wrap:anywhere]">{blog.title}</h1><p data-testid="blog-author" className="mb-7 text-lg text-stone-600">By {blog.author}</p><a href={/^https?:\/\//i.test(blog.url) ? blog.url : '#'} target="_blank" rel="noopener noreferrer" className="mb-8 inline-block break-all font-semibold text-[#175c52] underline underline-offset-4">{blog.url}</a><div className="border-t border-stone-200 pt-6"><p className="mb-4" data-testid="like-count">{blog.likes} {blog.likes === 1 ? 'like' : 'likes'}</p><div className="flex flex-wrap gap-3">{user && <ActionForm action={likeBlog} field="blogId" id={blog.id} label="Like" />}{user && blog.userId !== user.id && !saved && <ActionForm action={addToReadingList} field="blogId" id={blog.id} label="Add to reading list" testId="add-to-reading-list-button" />}{saved && <p className="flex min-h-11 items-center text-sm text-[#175c52]">Saved to your reading list</p>}</div>{!user && <p className="mt-4 text-sm"><Link href="/login" className="underline">Log in</Link> to like or save this article.</p>}{blog.user && <p className="mt-6 text-sm text-stone-600">Shared by <Link className="underline" href={`/users/${blog.user.username}`}>{blog.user.name}</Link></p>}</div></div></article>
}
