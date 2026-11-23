export type Blog = { id: string; title: string; author: string; url: string; likes: number }

const blogs: Blog[] = [
  { id: crypto.randomUUID(), title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7 },
  { id: crypto.randomUUID(), title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf', likes: 5 },
  { id: crypto.randomUUID(), title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12 },
]

export function getBlogs(filter = '') {
  const term = filter.trim().toLowerCase()
  return blogs
    .filter(blog => blog.title.toLowerCase().includes(term))
    .toSorted((a, b) => b.likes - a.likes)
}

export function getBlog(id: string) {
  return blogs.find(blog => blog.id === id)
}

export function addBlog(blog: Omit<Blog, 'id' | 'likes'>) {
  const created = { ...blog, id: crypto.randomUUID(), likes: 0 }
  blogs.push(created)
  return created
}

export function likeBlog(id: string) {
  const blog = getBlog(id)
  if (blog) blog.likes += 1
  return blog
}
