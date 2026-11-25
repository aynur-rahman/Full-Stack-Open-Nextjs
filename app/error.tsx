"use client"
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return <section className="panel" role="alert"><h1 className="page-title">Something went wrong</h1><p className="mb-6">We could not load this page. Please try again.</p><button className="button" onClick={reset}>Try again</button></section> }
