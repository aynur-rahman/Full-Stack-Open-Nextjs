"use client"
import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createBlog, registerUser, loginUser } from '@/app/actions'
import { useNotification } from './providers'
import type { FormState } from '@/lib/validation'
const initial: FormState = {}
function Field({ name, label, type = 'text', state, autoComplete }: { name: string; label: string; type?: string; state: FormState; autoComplete?: string }) {
  return <div><label className="field" htmlFor={name}>{label}<input className="input" id={name} name={name} type={type} defaultValue={state.values?.[name] || ''} aria-invalid={!!state.errors?.[name]} aria-describedby={state.errors?.[name] ? `${name}-error` : undefined} autoComplete={autoComplete} /></label>{state.errors?.[name] && <p className="error" id={`${name}-error`} data-testid={`${name}-error`}>{state.errors[name]}</p>}</div>
}
function Summary({ state }: { state: FormState }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if (state.errors && Object.keys(state.errors).length) ref.current?.focus() }, [state])
  if (!state.errors || !Object.keys(state.errors).length) return null
  return <div ref={ref} tabIndex={-1} role="alert" className="rounded-md border border-red-300 bg-red-50 p-4 text-red-900"><p className="font-semibold">Please check the form.</p><ul className="mt-2 list-disc pl-5">{Object.entries(state.errors).map(([key, value]) => <li key={key}>{key === 'form' ? value : <a href={`#${key}`} className="underline">{value}</a>}</li>)}</ul></div>
}
export function BlogForm() {
  const [state, action, pending] = useActionState(createBlog, initial)
  const notify = useNotification(), router = useRouter()
  useEffect(() => { if (state.success) { notify(state.message || 'Blog created.'); router.push('/blogs'); router.refresh() } }, [state, notify, router])
  return <form action={action} noValidate className="space-y-5"><Summary state={state} /><Field name="title" label="Title" state={state} /><Field name="author" label="Author" state={state} /><Field name="url" label="URL" type="url" state={state} /><p className="text-sm text-stone-600">Use at least five characters in each field.</p><button className="button w-full" data-testid="create-blog-button" disabled={pending || state.success}>{pending ? 'Creating…' : 'Create'}</button></form>
}
export function RegisterForm() {
  const [state, action, pending] = useActionState(registerUser, initial)
  return <form action={action} noValidate className="space-y-5"><Summary state={state} /><Field name="username" label="Username" state={state} autoComplete="username" /><Field name="name" label="Name" state={state} autoComplete="name" /><Field name="password" label="Password" type="password" state={state} autoComplete="new-password" /><Field name="passwordConfirm" label="Confirm Password" type="password" state={state} autoComplete="new-password" /><button className="button w-full" data-testid="register-button" disabled={pending}>{pending ? 'Registering…' : 'Register'}</button></form>
}
export function LoginForm() {
  const [state, action, pending] = useActionState(loginUser, initial)
  const router = useRouter(), notify = useNotification()
  const { update, status } = useSession()
  const handled = useRef(false)
  useEffect(() => {
    if (!state.success || status === 'loading' || handled.current) return
    handled.current = true
    void update().then(() => {
      notify('Welcome back.')
      router.push('/')
      router.refresh()
    }).catch(() => { router.push('/'); router.refresh() })
  }, [state, status, update, notify, router])
  return <form action={action} className="space-y-5">{state.errors?.form && <p data-testid="error-message" role="alert" className="error">{state.errors.form}</p>}<Field name="username" label="Username" state={state} autoComplete="username" /><Field name="password" label="Password" type="password" state={state} autoComplete="current-password" /><button className="button w-full" data-testid="login-button" disabled={pending || state.success}>{pending ? 'Logging in…' : 'Login'}</button></form>
}
