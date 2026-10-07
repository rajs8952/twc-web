import { TRACKERS, BMI_TOOL } from '@rajs8952/trackers/registry'
import { TrackerStorageProvider } from '@rajs8952/ui'
import { useAuthContext } from '@truworth/twc-auth'
import { LayoutGrid, LogOut } from 'lucide-react'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FullPageMessage } from '@/components/FullPageMessage'
import { memberStorage } from '@/lib/member-storage'
import { clearToken } from '@/lib/session'

const NAV = [
  { href: '/dashboard', name: 'Home', icon: LayoutGrid },
  ...TRACKERS.map((t) => ({ href: `/${t.id}`, name: t.name, icon: t.icon })),
  { href: '/bmi', name: 'BMI', icon: BMI_TOOL.icon },
]

const MemberContext = createContext<{ firstName: string }>({ firstName: '' })

/** The signed-in member's first name, for greetings. */
export const useMember = () => useContext(MemberContext)

/**
 * Every members-only page: sends signed-out visitors to /login, waits for
 * the profile, then gives each tracker this member's own storage.
 */
export function MemberShell({ children }: { children: React.ReactNode }) {
  const { token, profile, isLoadingProfile, logout } = useAuthContext()
  const [signingOut, setSigningOut] = useState(false)
  const { pathname } = useRouter()
  // Only report a failure once a profile load has actually run and come back empty.
  const loadStarted = useRef(false)
  if (isLoadingProfile) loadStarted.current = true
  const profileFailed = loadStarted.current && !isLoadingProfile && !profile

  useEffect(() => {
    if (!token) void Router.replace('/login')
  }, [token])

  async function signOut() {
    setSigningOut(true)
    try {
      await logout()
    } catch {
      // The server couldn't end the session; still sign out on this device.
      clearToken()
      window.location.assign('/login')
    }
  }

  if (!token) return <FullPageMessage>Taking you to sign in…</FullPageMessage>
  const memberId = profile?.id ?? profile?.email
  if (!memberId) {
    return <FullPageMessage>{profileFailed ? 'Couldn’t load your profile. Try reloading the page.' : 'Loading your profile…'}</FullPageMessage>
  }

  return (
    // Keyed by member, so switching accounts never shows the previous member's data.
    <TrackerStorageProvider key={String(memberId)} storage={memberStorage(String(memberId))}>
      <MemberContext.Provider value={{ firstName: profile?.firstName || profile?.name?.split(' ')[0] || '' }}>
        <header className="sticky top-0 z-10 border-b border-line bg-mist/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2 sm:px-8">
            <Link href="/dashboard" className="shrink-0 font-display text-lg font-extrabold">
              TWC Wellness
            </Link>
            <nav aria-label="Trackers" className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1 py-1">
              {NAV.map(({ href, name, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition ${
                      active ? 'bg-ink text-white' : 'text-muted hover:bg-white hover:text-ink'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {name}
                  </Link>
                )
              })}
            </nav>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              aria-label={signingOut ? 'Signing out' : 'Sign out'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-ink disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">{children}</main>
      </MemberContext.Provider>
    </TrackerStorageProvider>
  )
}
