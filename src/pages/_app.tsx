import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/nunito-sans'
import '@truworth/twc-web-design/style.css'
import '@/styles/globals.css'
import { AuthProvider, type LoginResponse } from '@truworth/twc-auth'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { routerAdapter } from '@/lib/router-adapter'
import { clearToken, readToken, saveToken } from '@/lib/session'

const appConfig = { appName: 'TWC Wellness' }

// Google sign-in needs your Google OAuth web client ID; without it twc-auth's Google button can't work.
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const socialLoginConfig = { google: { enabled: Boolean(googleClientId), webClientId: googleClientId } }

export default function App({ Component, pageProps }: AppProps) {
  // null until the saved session has been read from the browser.
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => setToken(readToken()), [])

  function onLogin(result: LoginResponse) {
    saveToken(result.token)
    setToken(result.token)
    void Router.replace('/dashboard')
  }

  async function onLogout() {
    clearToken()
    setToken('')
    await Router.replace('/login')
  }

  return (
    <>
      <Head>
        <title>TWC Wellness</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#EDF4F3" />
      </Head>
      {token !== null && (
        <AuthProvider
          router={routerAdapter}
          session={{ token }}
          appConfig={appConfig}
          socialLoginConfig={socialLoginConfig}
          onLogin={onLogin}
          onLogout={onLogout}
        >
          <Component {...pageProps} />
        </AuthProvider>
      )}
    </>
  )
}
