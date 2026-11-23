'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { addBlog, likeBlog } from '@/lib/blogs'

const field = (data: FormData, key: string) => {
  const value = data.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function createBlog(data: FormData) {
  const title = field(data, 'title'), author = field(data, 'author'), url = field(data, 'url')
  if (!title || !author || !url) return
  addBlog({ title, author, url })
  revalidatePath('/blogs')
  redirect('/blogs')
}

export async function like(data: FormData) {
  const id = field(data, 'id')
  likeBlog(id)
  revalidatePath('/blogs')
  revalidatePath(`/blogs/${id}`)
}
