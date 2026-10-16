import { BookOpen, ClipboardCheck, Dumbbell, Eye, EyeOff, Lock, MessageCircle } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useAuth } from '../auth'
import { USERNAME_RE } from '../lib/supabase'
import { Logo } from './brand'
import { cx } from './ui'

type Mode = 'signup' | 'login'

const FEATURES = [
  { icon: ClipboardCheck, text: 'Check if it might be more than a sprain' },
  { icon: BookOpen, text: 'Understand your ACL in plain language' },
  { icon: Dumbbell, text: '12-minute rehab sessions, no gym needed' },
  { icon: MessageCircle, text: "A buddy who's been through it" },
]

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  autoComplete: string
  hint?: string
}) {
  const [show, setShow] = useState(false)
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          minLength={8}
          maxLength={72}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="min-h-12 w-full rounded-xl border border-line bg-white px-4 pr-12"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute top-0.5 right-0.5 grid h-11 w-11 place-items-center rounded-lg text-muted"
        >
          {show ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  )
}

export function AuthScreen() {
  const { signUp, logIn, continueAsGuest, accountsEnabled, notice } = useAuth()
  const [mode, setMode] = useState<Mode>('signup')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const userId = useId()

  const switchMode = (m: Mode) => {
    setMode(m)
    setError(null)
    setPassword('')
    setConfirm('')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const name = username.trim().toLowerCase()
    if (!USERNAME_RE.test(name)) return setError('Username must be 3–20 characters: letters, numbers or underscores.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (mode === 'signup' && password !== confirm) return setError("Passwords don't match.")
    setBusy(true)
    setError(null)
    const err = mode === 'signup' ? await signUp(name, password) : await logIn(name, password)
    setBusy(false)
    if (err) setError(err)
  }

  return (
    <div className="min-h-dvh bg-bg lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
      <section className="on-dark bg-ink px-4 pt-[calc(env(safe-area-inset-top)+28px)] pb-10 text-white lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="mx-auto w-full max-w-[480px] lg:mx-0">
          <Logo className="text-[32px] lg:text-[44px]" />
          <h1 className="mt-4 text-[28px] lg:text-[40px]">Your comeback starts here.</h1>
          <p className="mt-2 text-white/80 lg:text-lg">
            A recovery companion for student athletes with knee injuries.
          </p>
          <ul className="mt-8 hidden flex-col gap-4 lg:flex">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10" aria-hidden="true">
                  <Icon className="h-5 w-5 text-bright" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <main className="px-4 py-6 lg:flex lg:items-center lg:px-12">
        <div className="mx-auto w-full max-w-[440px] rounded-[14px] border border-line bg-card p-5 shadow-sm sm:p-6">
          {accountsEnabled ? (
            <>
              <div className="grid grid-cols-2 rounded-xl bg-bg p-1" role="group" aria-label="Choose create account or log in">
                {(['signup', 'login'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={mode === m}
                    onClick={() => switchMode(m)}
                    className={cx(
                      'min-h-11 rounded-lg font-bold',
                      mode === m ? 'bg-white text-ink shadow-sm' : 'text-muted',
                    )}
                  >
                    {m === 'signup' ? 'Create account' : 'Log in'}
                  </button>
                ))}
              </div>

              {notice && <p className="mt-4 rounded-lg bg-warn-soft p-3 text-sm">{notice}</p>}

              <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={userId} className="font-bold">
                    Username
                  </label>
                  <input
                    id={userId}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    maxLength={20}
                    aria-describedby={mode === 'signup' ? `${userId}-hint` : undefined}
                    className="min-h-12 rounded-xl border border-line bg-white px-4"
                  />
                  {mode === 'signup' && (
                    <p id={`${userId}-hint`} className="text-sm text-muted">
                      3–20 letters, numbers or _. Pick a nickname, not your real name.
                    </p>
                  )}
                </div>

                <PasswordField
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  hint={mode === 'signup' ? 'At least 8 characters.' : undefined}
                />
                {mode === 'signup' && (
                  <PasswordField
                    label="Confirm password"
                    value={confirm}
                    onChange={setConfirm}
                    autoComplete="new-password"
                  />
                )}

                <div aria-live="assertive">
                  {error && <p className="rounded-lg bg-warn-soft p-3 text-sm font-bold">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="min-h-12 rounded-xl bg-teal px-4 font-bold text-white disabled:opacity-70"
                >
                  {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
                </button>

                {mode === 'signup' && (
                  <p className="flex gap-2 text-sm text-muted">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                    No email needed. There's no password reset yet, so keep your password somewhere safe.
                  </p>
                )}
              </form>

              <div className="my-5 flex items-center gap-3 text-sm text-muted" aria-hidden="true">
                <span className="h-px flex-1 bg-line" />
                or
                <span className="h-px flex-1 bg-line" />
              </div>
            </>
          ) : (
            <p className="mb-4 rounded-lg bg-bg p-3 text-sm text-muted">
              Accounts aren't available in this build. You can still use the full app as a guest.
            </p>
          )}

          <button
            type="button"
            onClick={continueAsGuest}
            className="min-h-12 w-full rounded-xl border border-teal bg-white px-4 font-bold text-teal"
          >
            Continue as guest
          </button>
          <p className="mt-2 text-center text-sm text-muted">Guest progress is saved on this device only.</p>
        </div>

        <p className="mx-auto mt-6 max-w-[440px] text-center text-sm text-muted lg:hidden">
          NTU CC0015 student prototype. Not medical advice.
        </p>
      </main>
    </div>
  )
}
