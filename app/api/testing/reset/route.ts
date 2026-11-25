import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { testingAllowed } from '@/lib/testing'
export async function DELETE() {
  if (!testingAllowed()) return NextResponse.json({ error: 'This endpoint is not available' }, { status: 403 })
  await db.execute(sql`TRUNCATE TABLE reading_list, blogs, users RESTART IDENTITY CASCADE`)
  return NextResponse.json({ ok: true })
}
