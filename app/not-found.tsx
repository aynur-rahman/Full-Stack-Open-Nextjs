import Link from 'next/link'
export default function NotFound() { return <section className="panel"><h1 className="page-title">Page not found</h1><p className="mb-6">This page may have moved or no longer exists.</p><Link className="button" href="/blogs">Browse blogs</Link></section> }
