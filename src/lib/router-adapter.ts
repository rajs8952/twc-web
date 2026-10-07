import type { RouterAdapter } from '@truworth/twc-auth'
import Router from 'next/router'

/** Lets twc-auth's screens navigate with the Next.js router. */
export const routerAdapter: RouterAdapter = {
  push: (path, options) => void Router.push({ pathname: path, query: options?.query }),
  replace: (path, options) => void Router.replace({ pathname: path, query: options?.query }),
  back: () => Router.back(),
  getQuery: () => Router.query,
  getPathname: () => Router.pathname,
}
