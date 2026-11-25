"use client"
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import type { FormState } from '@/lib/validation'
import { useNotification } from './providers'
export function ActionForm({ action, field, id, label, testId }: { action: (state: FormState, data: FormData) => Promise<FormState>; field: string; id: number; label: string; testId?: string }) {
  const [state, formAction, pending] = useActionState(action, {})
  const notify = useNotification()
  useEffect(() => { if (state.success && state.message) notify(state.message) }, [state, notify])
  return <form action={formAction}><input type="hidden" name={field} value={id} /><button className="secondary" data-testid={testId} disabled={pending}>{pending ? 'Saving…' : label}</button>{state.errors?.form && <p role="alert" className="error">{state.errors.form}</p>}</form>
}
export function SubmitButton({ children, testId }: { children: React.ReactNode; testId?: string }) { const { pending } = useFormStatus(); return <button className="button" data-testid={testId} disabled={pending}>{pending ? 'Saving…' : children}</button> }
