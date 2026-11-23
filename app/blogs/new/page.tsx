import { createBlog } from '@/app/actions'

export default function NewBlog() {
  return (
    <div>
      <h1>Create a new blog</h1>
      <form action={createBlog}>
        <label>title <input name="title" required /></label>
        <label>author <input name="author" required /></label>
        <label>url <input name="url" type="url" required /></label>
        <button type="submit" data-testid="create-blog-button">create</button>
      </form>
    </div>
  )
}
