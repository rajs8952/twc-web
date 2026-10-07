import { useAuthContext } from '@truworth/twc-auth'
import Router from 'next/router'
import { useEffect } from 'react'
import { FullPageMessage } from '@/components/FullPageMessage'

/** Sends members to their water tracker and everyone else to sign in. */
export default function Home() {
  const { token } = useAuthContext()
  useEffect(() => {
    void Router.replace(token ? '/dashboard' : '/login')
  }, [token])
  return <FullPageMessage>Loading…</FullPageMessage>
}
