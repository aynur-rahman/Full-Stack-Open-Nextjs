import Link from 'next/link'
type Blog = { id: number; title: string; author: string; likes: number }
export function BlogList({ blogs }: { blogs: Blog[] }) {
  return <ul data-testid="blogs-list" className="divide-y divide-stone-300 border-y border-stone-300">{blogs.length ? blogs.map(blog => <li key={blog.id} className="group grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-center"><div className="min-w-0"><Link href={`/blogs/${blog.id}`} className="[overflow-wrap:anywhere] font-serif text-2xl leading-snug hover:text-[#175c52] hover:underline">{blog.title}</Link><p className="mt-2 text-sm text-stone-600">By {blog.author}</p></div><span className="w-fit rounded-full bg-[#e7eee8] px-3 py-1 text-sm font-semibold text-[#175c52]">{blog.likes} {blog.likes === 1 ? 'like' : 'likes'}</span></li>) : <li className="py-10 text-stone-600">No blogs found. Try a different search or share an article.</li>}</ul>
}
