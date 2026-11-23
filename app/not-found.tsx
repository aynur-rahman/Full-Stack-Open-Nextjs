import Link from 'next/link'

export default function NotFound() {
  return <div><h1>Not found</h1><p><Link href="/blogs">Back to blogs</Link></p></div>
}
