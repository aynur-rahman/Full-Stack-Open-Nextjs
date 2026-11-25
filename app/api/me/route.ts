import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
export async function GET(request: Request) {
  const header = request.headers.get('authorization') || ''
  if (!/^Bearer \S+$/i.test(header)) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  const token = header.slice(7)
  const user = await db.query.users.findFirst({ where: eq(users.token, token), columns: { id: true, username: true, name: true } })
  return user ? NextResponse.json(user, { headers: { 'Cache-Control': 'no-store' } }) : NextResponse.json({ error: 'Invalid token' }, { status: 401 })
}
