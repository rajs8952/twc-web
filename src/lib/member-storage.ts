import { createLocalStorage, type MemoryStorage } from '@rajs8952/storage'

const byMember = new Map<string, MemoryStorage>()

/** Moves data saved by the water-only version of twc-web to the member's key. */
function adoptWaterOnlyData(memberId: string, key: string) {
  try {
    const old = `twc-web:water:${memberId}`
    const saved = localStorage.getItem(old)
    if (saved && !localStorage.getItem(key)) localStorage.setItem(key, saved)
    if (saved) localStorage.removeItem(old)
  } catch {
    // Storage unavailable: nothing to move.
  }
}

/**
 * Everything a member tracks (drinks, mood, sleep, weight, exercise,
 * meditation and the goal details), saved in this browser under their own key.
 */
export function memberStorage(memberId: string): MemoryStorage {
  let storage = byMember.get(memberId)
  if (!storage) {
    const key = `twc-web:member:${memberId}`
    adoptWaterOnlyData(memberId, key)
    storage = createLocalStorage({ key })
    byMember.set(memberId, storage)
  }
  return storage
}
