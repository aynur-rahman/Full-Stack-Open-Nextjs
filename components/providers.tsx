"use client"
import { SessionProvider } from 'next-auth/react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
const Context = createContext<(message: string) => void>(() => {})
export const useNotification = () => useContext(Context)
export function Providers({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notify = useCallback((text: string) => { if (timer.current) clearTimeout(timer.current); setMessage(text); timer.current = setTimeout(() => setMessage(''), 6000) }, [])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  return <SessionProvider><Context value={notify}>{message && <div data-testid="notification" role="status" className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-lg border border-emerald-800 bg-emerald-50 px-5 py-4 text-emerald-950 shadow-lg">{message}</div>}{children}</Context></SessionProvider>
}
