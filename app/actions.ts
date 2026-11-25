"use server"
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { and, eq, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { blogs, users, readingList } from '@/db/schema'
import { getCurrentUser } from '@/lib/session'
import { text, positiveId, blogErrors, registrationErrors, uniqueViolation, type FormState } from '@/lib/validation'

export async function registerUser(_previous: FormState, data: FormData): Promise<FormState> {
  const values = { username: text(data, 'username'), name: text(data, 'name'), password: text(data, 'password'), passwordConfirm: text(data, 'passwordConfirm') }
  const errors = registrationErrors(values)
  const safeValues = { username: values.username, name: values.name }
  if (Object.keys(errors).length) return { errors, values: safeValues }
  try { await db.insert(users).values({ username: values.username, name: values.name.trim(), passwordHash: await bcrypt.hash(values.password, 10) }) }
  catch (error) { if (uniqueViolation(error)) return { errors: { username: 'Username is already taken.' }, values: safeValues }; throw error }
  revalidatePath('/users')
  redirect('/login')
}
export async function createBlog(_previous: FormState, data: FormData): Promise<FormState> {
  const values = { title: text(data, 'title'), author: text(data, 'author'), url: text(data, 'url') }
  const user = await getCurrentUser()
  if (!user) return { errors: { form: 'Please log in before creating a blog.' }, values }
  const errors = blogErrors(values)
  if (Object.keys(errors).length) return { errors, values }
  await db.transaction(async tx => {
    const [blog] = await tx.insert(blogs).values({ title: values.title.trim(), author: values.author.trim(), url: values.url.trim(), userId: user.id }).returning()
    await tx.insert(readingList).values({ userId: user.id, blogId: blog.id })
  })
  revalidatePath('/blogs'); revalidatePath('/me'); revalidatePath('/users'); revalidatePath(`/users/${user.username}`)
  return { success: true, message: 'Blog added to the collection.' }
}
export async function likeBlog(_previous: FormState, data: FormData): Promise<FormState> {
  if (!await getCurrentUser()) return { errors: { form: 'Log in to like a blog.' } }
  const id = positiveId(data.get('blogId'))
  if (!id) return { errors: { form: 'Invalid blog.' } }
  const result = await db.update(blogs).set({ likes: sql`${blogs.likes} + 1` }).where(eq(blogs.id, id)).returning({ id: blogs.id })
  if (!result.length) return { errors: { form: 'Blog not found.' } }
  revalidatePath('/blogs'); revalidatePath(`/blogs/${id}`)
  return { success: true, message: 'Like added.' }
}
export async function generateToken(): Promise<void> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  await db.update(users).set({ token: randomUUID() }).where(eq(users.id, user.id))
  revalidatePath('/me')
}
export async function addToReadingList(_previous: FormState, data: FormData): Promise<FormState> {
  const user = await getCurrentUser()
  if (!user) return { errors: { form: 'Log in to save a blog.' } }
  const id = positiveId(data.get('blogId'))
  if (!id || !await db.query.blogs.findFirst({ where: eq(blogs.id, id) })) return { errors: { form: 'Blog not found.' } }
  await db.insert(readingList).values({ userId: user.id, blogId: id }).onConflictDoNothing()
  revalidatePath('/me'); revalidatePath(`/blogs/${id}`)
  return { success: true, message: 'Added to your reading list.' }
}
export async function markAsRead(_previous: FormState, data: FormData): Promise<FormState> {
  const user = await getCurrentUser()
  if (!user) return { errors: { form: 'Log in to update your reading list.' } }
  const id = positiveId(data.get('readingId'))
  if (!id) return { errors: { form: 'Invalid reading-list entry.' } }
  const result = await db.update(readingList).set({ read: true }).where(and(eq(readingList.id, id), eq(readingList.userId, user.id))).returning({ id: readingList.id })
  if (!result.length) return { errors: { form: 'Reading-list entry not found.' } }
  revalidatePath('/me')
  return { success: true, message: 'Marked as read.' }
}

export async function loginUser(_previous: FormState, data: FormData): Promise<FormState> {
  try {
    await signIn('credentials', { username: text(data, 'username'), password: text(data, 'password'), redirect: false })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) return { errors: { form: error.type === 'CredentialsSignin' ? 'Incorrect username or password.' : 'Login is unavailable. Please try again.' }, values: { username: text(data, 'username') } }
    throw error
  }
}
