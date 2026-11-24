import Link from 'next/link'
import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

export const dynamic = 'force-dynamic'

export default async function Users() {
  const list = await db.select().from(users).orderBy(asc(users.name))
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {list.map(user => (
          <li key={user.id}><Link href={`/users/${user.username}`}>{user.name}</Link> ({user.username})</li>
        ))}
      </ul>
    </div>
  )
}
