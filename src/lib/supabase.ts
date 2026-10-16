import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

/** Accounts are synthetic emails on a reserved, non-deliverable domain. No real email is ever collected. */
export const EMAIL_DOMAIN = 'users.comeback.invalid'
export const USERNAME_RE = /^[a-z0-9_]{3,20}$/
export const usernameToEmail = (username: string) => `${username.trim().toLowerCase()}@${EMAIL_DOMAIN}`

// Session storage that survives blocked localStorage by falling back to memory.
const memory = new Map<string, string>()
const safeStorage = {
  getItem: (k: string) => {
    try {
      return window.localStorage.getItem(k)
    } catch {
      return memory.get(k) ?? null
    }
  },
  setItem: (k: string, v: string) => {
    try {
      window.localStorage.setItem(k, v)
    } catch {
      memory.set(k, v)
    }
  },
  removeItem: (k: string) => {
    try {
      window.localStorage.removeItem(k)
    } catch {
      memory.delete(k)
    }
  },
}

export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: { storage: safeStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      })
    : null
