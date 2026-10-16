import type { Session } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  clearGuestProgress,
  endSession,
  flushRemote,
  loadGuestSnapshot,
  readDevice,
  startGuestSession,
  startUserSession,
  writeDevice,
} from './lib/storage'
import { supabase, usernameToEmail } from './lib/supabase'

type Status = 'loading' | 'auth' | 'guest' | 'user'

type AuthState = {
  status: Status
  username: string | null
  userId: string | null
  accountsEnabled: boolean
  /** Shown on the auth screen, e.g. when a session could not be loaded. */
  notice: string | null
  signUp: (username: string, password: string) => Promise<string | null>
  logIn: (username: string, password: string) => Promise<string | null>
  continueAsGuest: () => void
  openAuth: () => void
  signOut: () => Promise<void>
  deleteAccount: () => Promise<string | null>
}

const Ctx = createContext<AuthState | null>(null)

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth outside AuthProvider')
  return v
}

type StateRow = { data: Record<string, unknown> | null }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading')
  const [username, setUsername] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const loadedFor = useRef<string | null>(null)

  const goGuest = useCallback(() => {
    startGuestSession()
    setUsername(null)
    setUserId(null)
    setStatus('guest')
  }, [])

  const goSignedOut = useCallback(() => {
    endSession()
    loadedFor.current = null
    setUsername(null)
    setUserId(null)
    setStatus(readDevice('guest', false) ? 'guest' : 'auth')
    if (readDevice('guest', false)) startGuestSession()
  }, [])

  /** Load the signed-in user's profile and saved progress, migrating guest progress on first sign-in. */
  const loadUser = useCallback(
    async (session: Session) => {
      if (!supabase || loadedFor.current === session.user.id) return
      loadedFor.current = session.user.id
      const uid = session.user.id
      const [profile, state] = await Promise.all([
        supabase.from('profiles').select('username').eq('id', uid).single(),
        supabase.from('user_state').select('data').eq('user_id', uid).maybeSingle<StateRow>(),
      ])
      if (profile.error || state.error) {
        loadedFor.current = null
        await supabase.auth.signOut({ scope: 'local' })
        setNotice("Couldn't load your account. Check your connection and log in again.")
        setStatus('auth')
        return
      }
      let data = state.data?.data ?? {}
      const save = async (next: Record<string, unknown>) => {
        const { error } = await supabase!.from('user_state').upsert({ user_id: uid, data: next })
        if (error) console.warn('ComeBack: could not sync progress', error.message)
      }
      // First sign-in on an account that has no progress yet: carry over this device's guest progress.
      if (Object.keys(data).length === 0) {
        const guest = loadGuestSnapshot()
        if (Object.keys(guest).length > 0) {
          data = guest
          await save(guest)
        }
      }
      clearGuestProgress()
      writeDevice('guest', false)
      startUserSession(data, save)
      setUsername(profile.data.username as string)
      setUserId(uid)
      setNotice(null)
      setStatus('user')
    },
    [],
  )

  useEffect(() => {
    if (!supabase) {
      if (readDevice('guest', false)) goGuest()
      else setStatus('auth')
      return
    }
    let cancelled = false
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      if (data.session) void loadUser(data.session)
      else if (readDevice('guest', false)) goGuest()
      else setStatus('auth')
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') goSignedOut()
      else if (event === 'SIGNED_IN' && session) setTimeout(() => void loadUser(session), 0)
    })
    // Push pending changes when the tab is hidden or closed.
    const onHide = () => document.visibilityState === 'hidden' && void flushRemote()
    document.addEventListener('visibilitychange', onHide)
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [goGuest, goSignedOut, loadUser])

  const logIn = async (name: string, password: string) => {
    if (!supabase) return 'Accounts are not available right now.'
    const { data, error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(name), password })
    if (error) {
      if (/invalid login credentials/i.test(error.message)) return 'Wrong username or password.'
      if (error.status === 429) return 'Too many attempts. Please wait a minute and try again.'
      return "Couldn't log in. Please try again."
    }
    if (data.session) await loadUser(data.session)
    return null
  }

  const signUp = async (name: string, password: string) => {
    if (!supabase) return 'Accounts are not available right now.'
    const { error } = await supabase.functions.invoke('signup', { body: { username: name, password } })
    if (error) {
      try {
        const body = await (error as { context?: Response }).context?.json()
        if (body?.error) return body.error as string
      } catch {
        /* fall through */
      }
      return "Couldn't create your account. Please try again."
    }
    return logIn(name, password)
  }

  const continueAsGuest = () => {
    writeDevice('guest', true)
    goGuest()
  }

  const openAuth = () => {
    setNotice(null)
    setStatus('auth')
  }

  const signOut = async () => {
    await flushRemote()
    writeDevice('guest', false)
    if (supabase) await supabase.auth.signOut()
    goSignedOut()
  }

  const deleteAccount = async () => {
    if (!supabase) return 'Accounts are not available right now.'
    const { error } = await supabase.rpc('delete_my_account')
    if (error) return "Couldn't delete your account. Please try again."
    endSession()
    writeDevice('guest', false)
    await supabase.auth.signOut({ scope: 'local' })
    goSignedOut()
    return null
  }

  return (
    <Ctx.Provider
      value={{
        status,
        username,
        userId,
        accountsEnabled: supabase !== null,
        notice,
        signUp,
        logIn,
        continueAsGuest,
        openAuth,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
