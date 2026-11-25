import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { users } from './db/schema'
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 60 * 60 },
  providers: [Credentials({
    credentials: { username: {}, password: {} },
    async authorize(credentials) {
      const { username, password } = credentials
      if (typeof username !== 'string' || typeof password !== 'string' || Buffer.byteLength(password) > 72) return null
      const user = await db.query.users.findFirst({ where: eq(users.username, username) })
      if (!user?.passwordHash || !await bcrypt.compare(password, user.passwordHash)) return null
      return { id: String(user.id), name: user.name, email: user.username }
    }
  })],
  callbacks: {
    session({ session, token }) { if (session.user && token.sub) session.user.id = token.sub; return session }
  }
})
