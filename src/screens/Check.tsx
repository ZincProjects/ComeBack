import { AlertTriangle, ArrowRight, Check as CheckIcon, Info, ShieldCheck, Stethoscope } from 'lucide-react'
import { CHECK_ITEMS } from '../data'
import { useApp } from '../state'
import { Card, cx, PageHeading, SectionTitle } from '../components/ui'

function ResultCard({ count }: { count: number }) {
  if (count === 0)
    return (
      <div className="rounded-[14px] border border-[#B9D9C6] bg-ok-soft p-4" aria-live="polite">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal" aria-hidden="true" />
          <p className="font-bold">Low concern · Rest, ice and watch it</p>
        </div>
        <p className="mt-1.5 text-muted">
          Protect the knee for 2–3 days and re-check if it isn't improving.
        </p>
      </div>
    )
  if (count === 1)
    return (
      <div className="rounded-[14px] border border-[#EFC4A6] bg-warn-soft p-4" aria-live="polite">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-accent" aria-hidden="true" />
          <p className="font-bold">Get it looked at · Book a polyclinic visit this week</p>
        </div>
        <p className="mt-1.5 text-ink">
          One warning sign is enough to get it checked. Early answers mean a shorter recovery.
        </p>
      </div>
    )
  return (
    <div className="on-dark rounded-[14px] bg-ink p-4 text-white" aria-live="polite">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-bright" aria-hidden="true" />
        <p className="font-bold">Possible ligament injury · See a doctor and ask about a scan</p>
      </div>
      <p className="mt-1.5 text-white/90">
        {count} warning signs together can point to a ligament tear like an ACL. Don't wait it out.
      </p>
    </div>
  )
}

export function CheckMain() {
  const { checks, toggleCheck, setTab } = useApp()
  const count = checks.filter(Boolean).length
  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        eyebrow="Step 1 · Knee Check"
        title="Just a sprain, or something more?"
        sub="Tick anything that happened after your injury. Takes 30 seconds."
      />

      <fieldset className="flex flex-col gap-2.5">
        <legend className="sr-only">Symptoms after your injury</legend>
        {CHECK_ITEMS.map((item, i) => (
          <label
            key={item}
            className={cx(
              'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal',
              checks[i] ? 'border-teal bg-teal-soft' : 'border-line',
            )}
          >
            <input type="checkbox" className="peer sr-only" checked={checks[i]} onChange={() => toggleCheck(i)} />
            <span
              className={cx(
                'grid h-6 w-6 shrink-0 place-items-center rounded-md border-2',
                checks[i] ? 'border-teal bg-teal text-white' : 'border-muted bg-white',
              )}
              aria-hidden="true"
            >
              {checks[i] && <CheckIcon className="h-4 w-4" strokeWidth={3} />}
            </span>
            <span className="font-bold">{item}</span>
          </label>
        ))}
      </fieldset>

      <ResultCard count={count} />

      <Card className="flex gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
        <div>
          <SectionTitle>Did you know?</SectionTitle>
          <p className="mt-1 text-muted">
            TCM and massage can ease pain and swelling, but they cannot repair a torn ligament. Only a doctor's
            exam and a scan can confirm it.
          </p>
          <button
            type="button"
            onClick={() => setTab('learn')}
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-bold text-teal underline underline-offset-2"
          >
            Learn what an ACL tear is
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Card>

      <p className="text-sm text-muted">A guide, not a diagnosis. If in doubt, see a doctor.</p>
    </div>
  )
}

const QUESTIONS = [
  'Could this be a ligament injury like an ACL tear?',
  'Do I need an MRI scan, and how soon?',
  'What can I safely do while I wait for results?',
  'Should I see a sports medicine doctor or physio?',
]

const WHERE = [
  { name: 'Polyclinic', note: 'Affordable first stop. Can refer you on for a scan or specialist.' },
  { name: 'GP clinic', note: 'Quick same-day check and referral if needed.' },
  { name: 'Sports medicine clinic', note: 'Specialists in sports injuries and return-to-play.' },
]

export function CheckSide() {
  const { checks } = useApp()
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>What a doctor will check</SectionTitle>
        <p className="mt-2 text-muted">
          A clinician will examine the knee with hands-on tests, such as the <strong className="text-ink">Lachman test</strong>,
          which checks how far the shin moves forward against the thigh. If they suspect a tear, an{' '}
          <strong className="text-ink">MRI scan</strong> confirms it.
        </p>
        <p className="mt-3 rounded-lg bg-bg p-3 text-sm text-muted">
          These tests are done <strong className="text-ink">by a trained clinician</strong>. They are not self-tests,
          and trying them on yourself can give a false all-clear.
        </p>
      </Card>

      <Card>
        <SectionTitle>Questions to ask your doctor</SectionTitle>
        <ul className="mt-3 flex flex-col gap-2.5">
          {QUESTIONS.map((q) => (
            <li key={q} className="flex gap-2.5">
              <span className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-muted" aria-hidden="true" />
              <span>{q}</span>
            </li>
          ))}
        </ul>
        {checks.some(Boolean) && (
          <p className="mt-3 text-sm text-muted">
            Tip: tell them which signs you ticked ({checks.filter(Boolean).length}) and that the injury happened
            during sport.
          </p>
        )}
      </Card>

      <Card>
        <SectionTitle>Where to go in Singapore</SectionTitle>
        <ul className="mt-3 flex flex-col divide-y divide-line">
          {WHERE.map((w) => (
            <li key={w.name} className="py-2.5 first:pt-0 last:pb-0">
              <p className="font-bold">{w.name}</p>
              <p className="text-sm text-muted">{w.note}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
