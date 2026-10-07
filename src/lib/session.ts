/*
 * The signed-in member's API token, kept in this browser so a reload stays
 * signed in. twc-auth's /auth/logout ends it on the server too.
 */
const KEY = 'twc-web:session'

export function readToken(): string {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveToken(token: string) {
  try {
    localStorage.setItem(KEY, token)
  } catch {
    // Private mode or full storage: the member stays signed in until they close the tab.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing saved to clear.
  }
}
