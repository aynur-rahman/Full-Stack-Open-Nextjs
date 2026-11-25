import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { readingList } from '@/db/schema'
import { getCurrentUser } from '@/lib/session'
import { generateToken, markAsRead } from '@/app/actions'
import { ActionForm, SubmitButton } from '@/components/action-form'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'My reading room' }
export default async function Me() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const readings = await db.query.readingList.findMany({ where: eq(readingList.userId, user.id), with: { blog: true } })
  const unread = readings.filter(item => !item.read), read = readings.filter(item => item.read)
  const entries = (list: typeof readings) => <ul className="divide-y divide-stone-200">{list.map(item => <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div className="min-w-0 max-w-full"><Link className="[overflow-wrap:anywhere] font-serif text-xl hover:underline" href={`/blogs/${item.blog.id}`}>{item.blog.title}</Link><p className="mt-1 text-sm text-stone-600">{item.blog.author}</p></div>{!item.read && <ActionForm action={markAsRead} field="readingId" id={item.id} label="Mark as read" testId={`mark-read-${item.id}`} />}</li>)}</ul>
  return <section><div data-testid="user-profile" className="mb-10"><p className="eyebrow">Your reading room</p><h1 data-testid="user-name" className="page-title [overflow-wrap:anywhere]">{user.name}</h1><p data-testid="user-username" className="text-stone-600">@{user.username}</p></div><div className="grid gap-7 lg:grid-cols-[1fr_320px]"><section data-testid="reading-list-section" className="panel"><h2 className="mb-5 text-3xl">Your reading list</h2>{!readings.length && <p data-testid="empty-reading-list" className="mb-6 text-stone-600">Your list is empty. <Link href="/blogs" className="underline">Find your next read.</Link></p>}<section data-testid="unread-section"><h3 className="text-xl">Unread <span className="font-sans text-sm text-stone-500">({unread.length})</span></h3>{unread.length ? entries(unread) : <p data-testid="no-unread-blogs" className="py-4 text-stone-600">No unread blogs.</p>}</section><section data-testid="read-section" className="mt-7 border-t border-stone-200 pt-6"><h3 className="text-xl">Read <span className="font-sans text-sm text-stone-500">({read.length})</span></h3>{read.length ? entries(read) : <p className="py-4 text-stone-600">Finished articles will appear here.</p>}</section></section><aside data-testid="api-token-section" className="panel h-fit"><h2 className="mb-3 text-2xl">Personal API token</h2><p className="mb-5 text-sm leading-relaxed text-stone-600">Use this token to access your profile through the API. Keep it private. Generating a new token replaces the old one.</p>{user.token ? <div data-testid="token-display" className="mb-5 rounded-md bg-stone-100 p-3"><code data-testid="api-token" className="break-all text-sm">{user.token}</code></div> : <p data-testid="no-token-message" className="mb-5 text-sm text-stone-600">No token generated yet.</p>}<form action={generateToken}><SubmitButton testId="generate-token-button">{user.token ? 'Generate new token' : 'Generate token'}</SubmitButton></form></aside></div></section>
}
