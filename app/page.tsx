import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Blog app</h1>
      <p>Interesting blogs collected in one place. See the <Link href="/blogs">list of blogs</Link>.</p>
    </div>
  )
}
