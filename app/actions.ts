'use server'
import { eq, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { blogs } from '@/db/schema'

const field = (data: FormData, key: string) => {
  const value = data.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function createBlog(data: FormData) {
  const title = field(data, 'title'), author = field(data, 'author'), url = field(data, 'url')
  if (!title || !author || !url) return
  await db.insert(blogs).values({ title, author, url })
  revalidatePath('/blogs')
  redirect('/blogs')
}

export async function like(data: FormData) {
  const id = Number(field(data, 'id'))
  if (!Number.isSafeInteger(id) || id < 1) return
  await db.update(blogs).set({ likes: sql`${blogs.likes} + 1` }).where(eq(blogs.id, id))
  revalidatePath('/blogs')
  revalidatePath(`/blogs/${id}`)
}
