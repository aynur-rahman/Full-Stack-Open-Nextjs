import 'server-only'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id || !/^\d+$/.test(session.user.id)) return null
  return await db.query.users.findFirst({ where: eq(users.id, Number(session.user.id)) }) || null
}
