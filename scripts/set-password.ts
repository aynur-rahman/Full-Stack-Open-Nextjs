import { config } from 'dotenv'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'
config({ path: '.env.local', quiet: true })
async function main() {
const username = process.argv[2]
const password = process.env.NEW_PASSWORD
if (!username || !password || password.length < 4 || Buffer.byteLength(password) > 72) throw new Error('Provide a username argument and NEW_PASSWORD of 4 or more characters (maximum72 bytes)')
const client = postgres(process.env.DATABASE_URL!, { max: 1 })
try {
  const hash = await bcrypt.hash(password, 10)
  const rows = await client`UPDATE users SET password_hash=${hash} WHERE username=${username} RETURNING id`
  if (!rows.length) throw new Error('User not found')
  console.log('Password updated')
} finally { await client.end() }

}
void main().catch(error => { console.error(error.message); process.exitCode = 1 })
