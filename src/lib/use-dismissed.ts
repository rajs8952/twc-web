import { useCallback, useEffect, useState } from 'react'

const KEY = 'twc-web:dismissed-alerts'
/** Keys are per entry, day or month, so old ones are useless; keep the newest few. */
const MAX_KEYS = 100

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((k) => typeof k === 'string') : []
  } catch {
    return []
  }
}

/** Alerts this browser has dismissed. `ready` is false until storage is read, so nothing flashes on load. */
export function useDismissed() {
  const [keys, setKeys] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setKeys(read())
    setReady(true)
  }, [])

  const dismiss = useCallback((key: string) => {
    const next = [key, ...read().filter((k) => k !== key)].slice(0, MAX_KEYS)
    setKeys(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // Storage full or blocked: dismissed for this visit only.
    }
  }, [])

  return { isDismissed: (key: string) => keys.includes(key), dismiss, ready }
}
