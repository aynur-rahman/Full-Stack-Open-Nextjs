import Link from 'next/link'
import { BlogForm } from '@/components/forms'
import { getCurrentUser } from '@/lib/session'
export const metadata = { title: 'Share a blog' }
export default async function NewBlog() {
  const user = await getCurrentUser()
  return <section className="mx-auto max-w-xl"><p className="eyebrow">Pass a good idea along</p><h1 className="page-title">Share a blog</h1><p className="mb-7 text-stone-600">Add an article to the collection and your reading list.</p>{!user && <p className="mb-5 rounded-lg border border-amber-400 bg-amber-50 p-4"><Link href="/login" className="font-semibold underline">Log in</Link> to publish your recommendation.</p>}<div className="panel"><BlogForm /></div></section>
}
