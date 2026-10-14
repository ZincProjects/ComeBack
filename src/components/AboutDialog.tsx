import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { resetDemo } from '../lib/storage'
import { useApp } from '../state'

const ISSUES = [
  { title: 'Delayed diagnosis', body: 'Ryan treated a torn ACL as a sprain with TCM for 5 years. Knee Check flags warning signs early.' },
  { title: 'Consistency and access', body: 'The gym was far and rehab felt like a chore. A 12-minute home session fits between classes.' },
  { title: 'Social support', body: 'No one around him could relate. A recovery buddy and peer circle connect him with people who have been there.' },
]

const COMB = [
  { k: 'Capability', v: 'Knee Check and step-by-step exercise guidance.' },
  { k: 'Opportunity', v: 'No-gym home exercises and a recovery buddy.' },
  { k: 'Motivation', v: 'Streaks, confidence check-ins and a peer circle.' },
]

export function AboutDialog() {
  const { aboutOpen, setAboutOpen } = useApp()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (aboutOpen && !d.open) d.showModal()
    if (!aboutOpen && d.open) d.close()
  }, [aboutOpen])

  return (
    <dialog
      ref={ref}
      onClose={() => setAboutOpen(false)}
      onClick={(e) => e.target === ref.current && setAboutOpen(false)}
      aria-labelledby="about-title"
      className="m-auto max-h-[90dvh] w-[min(560px,calc(100vw-32px))] rounded-2xl bg-card p-0 text-ink"
    >
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-teal uppercase">CC0015 Health &amp; Wellbeing · NTU</p>
            <h2 id="about-title" className="mt-1 text-2xl">
              About this prototype
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAboutOpen(false)}
            aria-label="Close"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-bg"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-muted">
          ComeBack is designed around <strong className="text-ink">Ryan</strong>, a student athlete who tore his ACL in
          Sec 4 during wushu. He treated it as a sprain with TCM for 5 years, skipped rehab because motivation was low and
          the gym was far, and had no one who could relate to what he was going through.
        </p>

        <div>
          <h3 className="text-base">Three issues it addresses</h3>
          <ol className="mt-2 flex flex-col gap-2">
            {ISSUES.map((it, i) => (
              <li key={it.title} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p>
                  <strong>{it.title}.</strong> <span className="text-muted">{it.body}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-base">COM-B mapping</h3>
          <dl className="mt-2 grid gap-2 sm:grid-cols-3">
            {COMB.map((c) => (
              <div key={c.k} className="rounded-xl border border-line bg-bg p-3">
                <dt className="font-bold">{c.k}</dt>
                <dd className="text-sm text-muted">{c.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="rounded-xl bg-warn-soft p-3 text-sm">
          <strong>Student prototype, not medical advice.</strong> All data is mock and stays on this device. Always see a
          qualified doctor or physiotherapist about an injury.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              resetDemo()
              window.location.hash = ''
              window.location.reload()
            }}
            className="min-h-11 rounded-xl border border-accent px-4 font-bold text-accent"
          >
            Reset demo
          </button>
          <button
            type="button"
            onClick={() => setAboutOpen(false)}
            className="min-h-11 rounded-xl bg-teal px-4 font-bold text-white"
          >
            Back to the app
          </button>
        </div>
      </div>
    </dialog>
  )
}
