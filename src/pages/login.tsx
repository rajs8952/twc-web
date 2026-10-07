import { LoginWebComponent, useAuthContext } from '@truworth/twc-auth'
import Router from 'next/router'
import { useEffect } from 'react'
import { FullPageMessage } from '@/components/FullPageMessage'

export default function LoginPage() {
  const { token } = useAuthContext()
  useEffect(() => {
    if (token) void Router.replace('/dashboard')
  }, [token])
  if (token) return <FullPageMessage>Signing you in…</FullPageMessage>
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <LoginWebComponent />
    </main>
  )
}
