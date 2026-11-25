import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/db'
import { users } from '@/db/schema'
import { testingAllowed } from '@/lib/testing'
import { registrationErrors, uniqueViolation } from '@/lib/validation'
export async function POST(request: Request) {
  if (!testingAllowed()) return NextResponse.json({ error: 'This endpoint is not available' }, { status: 403 })
  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const { username, name, password } = body || {}
  if ([username, name, password].some(value => typeof value !== 'string')) return NextResponse.json({ error: 'Invalid fields' }, { status: 400 })
  const errors = registrationErrors({ username, name, password, passwordConfirm: password })
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 })
  try {
    const [user] = await db.insert(users).values({ username, name, passwordHash: await bcrypt.hash(password, 10) }).returning({ id: users.id, username: users.username, name: users.name })
    return NextResponse.json(user, { status: 201 })
  } catch (error) { if (uniqueViolation(error)) return NextResponse.json({ error: 'Username already exists' }, { status: 400 }); throw error }
}
