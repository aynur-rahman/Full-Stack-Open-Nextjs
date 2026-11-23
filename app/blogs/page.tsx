import Link from 'next/link'
import { getBlogs } from '@/lib/blogs'

export const dynamic = 'force-dynamic'

export default async function Blogs({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter = '' } = await searchParams
  const blogs = getBlogs(filter)
  return (
    <div>
      <h1>Blogs</h1>
      <form action="/blogs" className="inline">
        <input name="filter" defaultValue={filter} placeholder="search by title" data-testid="filter-input" />
        <button type="submit" data-testid="search-button">search</button>
      </form>
      <ul data-testid="blogs-list">
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}, {blog.likes} likes
          </li>
        ))}
      </ul>
    </div>
  )
}
