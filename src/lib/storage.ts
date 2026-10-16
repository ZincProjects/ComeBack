import { useEffect, useState } from 'react'

const PREFIX = 'comeback:'
/** Per-device preferences: always kept in this browser, never synced to an account. */
const DEVICE_KEYS = new Set(['phoneView', 'guest'])

type Snapshot = Record<string, unknown>

let mode: 'guest' | 'user' = 'guest'
let snapshot: Snapshot = {}
let saveRemote: ((data: Snapshot) => Promise<void>) | null = null
let saveTimer: number | undefined

function lsGet(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key)
  } catch {
    return null
  }
}
function lsSet(key: string, value: unknown) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage blocked: keep working in memory */
  }
}
function lsKeys(): string[] {
  try {
    const keys: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith(PREFIX)) keys.push(k.slice(PREFIX.length))
    }
    return keys
  } catch {
    return []
  }
}

export function readDevice<T>(key: string, fallback: T): T {
  const raw = lsGet(key)
  if (raw === null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
export function writeDevice(key: string, value: unknown) {
  lsSet(key, value)
}

/** App progress saved in this browser (guest mode). */
export function loadGuestSnapshot(): Snapshot {
  const out: Snapshot = {}
  for (const k of lsKeys()) {
    if (DEVICE_KEYS.has(k)) continue
    const raw = lsGet(k)
    if (raw === null) continue
    try {
      out[k] = JSON.parse(raw)
    } catch {
      /* skip corrupt entry */
    }
  }
  return out
}

export function clearGuestProgress() {
  try {
    for (const k of lsKeys()) if (!DEVICE_KEYS.has(k)) window.localStorage.removeItem(PREFIX + k)
  } catch {
    /* ignore */
  }
}

export function startGuestSession() {
  mode = 'guest'
  snapshot = loadGuestSnapshot()
  saveRemote = null
}

export function startUserSession(data: Snapshot, save: (data: Snapshot) => Promise<void>) {
  mode = 'user'
  snapshot = { ...data }
  saveRemote = save
}

export function endSession() {
  window.clearTimeout(saveTimer)
  mode = 'guest'
  snapshot = {}
  saveRemote = null
}

/** Push any pending account changes immediately. */
export async function flushRemote() {
  window.clearTimeout(saveTimer)
  saveTimer = undefined
  if (mode === 'user' && saveRemote) await saveRemote({ ...snapshot })
}

export function readStored<T>(key: string, fallback: T): T {
  if (DEVICE_KEYS.has(key)) return readDevice(key, fallback)
  return key in snapshot ? (snapshot[key] as T) : fallback
}

export function writeStored<T>(key: string, value: T) {
  if (DEVICE_KEYS.has(key)) return writeDevice(key, value)
  if (snapshot[key] === value) return
  snapshot[key] = value
  if (mode === 'guest') return lsSet(key, value)
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => void flushRemote(), 600)
}

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStored(key, initial))
  useEffect(() => writeStored(key, value), [key, value])
  return [value, setValue] as const
}

/** Wipe progress: this browser's data for guests, the account's saved state for signed-in users. */
export async function resetDemo() {
  if (mode === 'user') {
    snapshot = {}
    await flushRemote()
    return
  }
  clearGuestProgress()
  try {
    window.localStorage.removeItem(PREFIX + 'guest')
  } catch {
    /* ignore */
  }
}
