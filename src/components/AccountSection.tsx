import { CircleUser } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../auth'

export function AccountSection({ onDone }: { onDone: () => void }) {
  const { status, username, accountsEnabled, signOut, deleteAccount, openAuth } = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'guest') {
    return (
      <section aria-labelledby="account-title" className="rounded-xl border border-line bg-bg p-4">
        <h3 id="account-title" className="text-base">
          You're using ComeBack as a guest
        </h3>
        <p className="mt-1 text-sm text-muted">
          Progress is saved on this device only.
          {accountsEnabled && ' Create an account to keep it safe and use it on other devices. Your current progress comes with you.'}
        </p>
        {accountsEnabled && (
          <button
            type="button"
            onClick={() => {
              onDone()
              openAuth()
            }}
            className="mt-3 min-h-11 rounded-xl bg-teal px-4 font-bold text-white"
          >
            Create account or log in
          </button>
        )}
      </section>
    )
  }

  return (
    <section aria-labelledby="account-title" className="rounded-xl border border-line bg-bg p-4">
      <div className="flex items-center gap-2">
        <CircleUser className="h-5 w-5 text-teal" aria-hidden="true" />
        <h3 id="account-title" className="text-base">
          Signed in as {username}
        </h3>
      </div>
      <p className="mt-1 text-sm text-muted">Your progress is saved to your account and only you can see it.</p>

      {!confirming ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              onDone()
              await signOut()
            }}
            className="min-h-11 rounded-xl bg-ink px-4 font-bold text-white"
          >
            Log out
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="min-h-11 rounded-xl border border-line bg-white px-4 font-bold text-accent"
          >
            Delete account
          </button>
        </div>
      ) : (
        <div className="mt-3 rounded-lg border border-accent bg-white p-3" role="alert">
          <p className="font-bold">Delete your account for good?</p>
          <p className="mt-1 text-sm text-muted">
            This permanently removes your username and all saved progress. It can't be undone.
          </p>
          {error && <p className="mt-2 text-sm font-bold text-accent">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                const err = await deleteAccount()
                setBusy(false)
                if (err) setError(err)
                else onDone()
              }}
              className="min-h-11 rounded-xl bg-accent px-4 font-bold text-white"
            >
              {busy ? 'Deleting…' : 'Delete forever'}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false)
                setError(null)
              }}
              className="min-h-11 rounded-xl border border-line bg-white px-4 font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
