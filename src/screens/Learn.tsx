import { ArrowRight, Check, ChevronDown, ExternalLink, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useApp } from '../state'
import { Card, cx, PageHeading, SectionTitle } from '../components/ui'

const SOURCE_URL = 'https://www.healthhub.sg/health-conditions/anterior-cruciate-ligament-tear-acl'

/** Simplified front view of a right knee with the ACL highlighted. */
function KneeDiagram() {
  return (
    <figure className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 240 220"
        className="h-auto w-full max-w-[280px]"
        role="img"
        aria-label="Simplified knee diagram: the ACL runs diagonally inside the knee, joining the thigh bone above to the shin bone below."
      >
        {/* thigh bone */}
        <path
          d="M95 8h50v60c0 8 22 14 22 30 0 14-12 18-24 18h-46c-12 0-24-4-24-18 0-16 22-22 22-30z"
          fill="var(--color-teal-soft)"
          stroke="var(--color-teal)"
          strokeWidth="2"
        />
        {/* shin bone */}
        <path
          d="M74 134c0-8 10-12 22-12h48c12 0 22 4 22 12 0 12-14 16-20 22v56h-52v-56c-6-6-20-10-20-22z"
          fill="var(--color-teal-soft)"
          stroke="var(--color-teal)"
          strokeWidth="2"
        />
        {/* PCL (behind, muted) */}
        <path d="M128 104 108 128" stroke="var(--color-empty)" strokeWidth="7" strokeLinecap="round" />
        {/* ACL */}
        <path d="M110 102 134 130" stroke="var(--color-accent)" strokeWidth="9" strokeLinecap="round" />
        {/* labels */}
        <g fontSize="12" fill="var(--color-ink)" fontFamily="var(--font-sans)">
          <text x="152" y="34" fontWeight="700">Thigh bone</text>
          <text x="152" y="48" fill="var(--color-muted)">(femur)</text>
          <text x="152" y="186" fontWeight="700">Shin bone</text>
          <text x="152" y="200" fill="var(--color-muted)">(tibia)</text>
          <text x="10" y="118" fontWeight="700" fill="var(--color-accent)">ACL</text>
        </g>
        <path d="M36 114h66" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      <figcaption className="text-center text-sm text-muted">
        The ACL criss-crosses the middle of the knee and stops the shin bone sliding forward.
      </figcaption>
    </figure>
  )
}

function Section({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-xl border border-line bg-card">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-bold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="px-4 pb-4 text-muted">{children}</div>
    </details>
  )
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

const MYTHS = [
  {
    claim: "If I can still walk, it's probably just a sprain.",
    fact: false,
    why: 'Many people walk soon after an ACL tear once the swelling settles. The knee may still give way when you twist or land.',
  },
  {
    claim: 'TCM or massage can heal a torn ACL.',
    fact: false,
    why: 'They may ease pain and swelling, but a torn ligament does not reconnect on its own. A doctor needs to check it.',
  },
  {
    claim: 'Doing my home exercises affects how soon I return to sport.',
    fact: true,
    why: 'Sticking to the home programme your physio sets is one of the biggest factors in an earlier, safer return.',
  },
  {
    claim: 'After ACL surgery, you can play competitively again in about a month.',
    fact: false,
    why: 'A common guide is jogging around 3 months, light training around 6 and competitive sport around 9, depending on progress.',
  },
]

export function MythQuiz() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(MYTHS.map(() => null))
  const score = answers.filter((a, i) => a !== null && a === MYTHS[i].fact).length
  const answered = answers.filter((a) => a !== null).length
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-2">
        <SectionTitle>Myth or fact?</SectionTitle>
        <p className="text-sm text-muted" aria-live="polite">
          {answered === MYTHS.length ? `${score} of ${MYTHS.length} correct` : `${answered} of ${MYTHS.length} answered`}
        </p>
      </div>
      <ol className="mt-3 flex flex-col gap-3">
        {MYTHS.map((m, i) => {
          const a = answers[i]
          const correct = a !== null && a === m.fact
          return (
            <li key={m.claim} className="rounded-xl border border-line p-3">
              <p className="font-bold">{m.claim}</p>
              <div className="mt-2 flex gap-2" role="group" aria-label={`Answer: ${m.claim}`}>
                {[
                  { label: 'Myth', value: false },
                  { label: 'Fact', value: true },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    aria-pressed={a === opt.value}
                    onClick={() => setAnswers((s) => s.map((x, j) => (j === i ? opt.value : x)))}
                    className={cx(
                      'min-h-11 flex-1 rounded-lg border px-3 font-bold',
                      a === opt.value ? 'border-teal bg-teal text-white' : 'border-line bg-white text-ink',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {a !== null && (
                <p className={cx('mt-2 flex gap-2 rounded-lg p-2.5 text-sm', correct ? 'bg-ok-soft' : 'bg-warn-soft')}>
                  {correct ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  )}
                  <span>
                    <strong>{correct ? 'Correct.' : 'Not quite.'}</strong> It's a {m.fact ? 'fact' : 'myth'}. {m.why}
                  </span>
                </p>
              )}
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

function SourceNote() {
  return (
    <p className="text-sm text-muted">
      Summarised from{' '}
      <a
        href={SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-bold text-teal underline underline-offset-2"
      >
        HealthHub: Anterior Cruciate Ligament Tear
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>{' '}
      (Khoo Teck Puat Hospital, reviewed Jan 2026). General information, not a diagnosis.
    </p>
  )
}

export function LearnMain({ desktop = false }: { desktop?: boolean }) {
  const { setTab } = useApp()
  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        eyebrow="Learn · ACL 101"
        title="What is an ACL tear?"
        sub="Five-minute read. Knowing what's going on inside your knee makes the rehab make sense."
      />

      <Card>
        <KneeDiagram />
      </Card>

      <div className="flex flex-col gap-2.5">
        <Section title="What is the ACL?" defaultOpen>
          <p>
            The anterior cruciate ligament (ACL) is one of four main ligaments in the knee. It's a tough band that joins
            your thigh bone to your shin bone and stops the shin from sliding too far forward. It's what keeps the knee
            steady when you twist, cut or land.
          </p>
        </Section>

        <Section title="How does it get torn?">
          <Bullets
            items={[
              <><strong className="text-ink">Twisting or pivoting:</strong> a sudden change of direction while the foot stays planted.</>,
              <><strong className="text-ink">Bad landing:</strong> the knee over-straightens when you come down from a jump.</>,
              <><strong className="text-ink">A direct hit:</strong> a blow to the side or back of the knee, like a tackle.</>,
            ]}
          />
          <p className="mt-2">Common in football, basketball, rugby and martial arts like wushu.</p>
        </Section>

        <Section title="Signs it might be torn">
          <Bullets
            items={['A "pop" at the moment of injury', 'Sharp pain', 'Swelling that comes up quickly', "Can't put weight on the leg", 'The knee feels unstable or gives way']}
          />
          <p className="mt-2">
            Later on you may notice ongoing swelling, a knee that won't fully bend or straighten, and wobbliness.
          </p>
          <button
            type="button"
            onClick={() => setTab('check')}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal px-4 font-bold text-white"
          >
            Take the 30-second Knee Check
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </Section>

        <Section title="Who is more at risk?">
          <Bullets
            items={[
              'Athletes in sports with lots of cutting, pivoting and jumping.',
              'Female athletes, partly due to muscle balance and knee alignment.',
              "Anyone whose strength and conditioning hasn't caught up with their sport.",
              'Playing on wet, slippery or uneven ground.',
            ]}
          />
        </Section>

        <Section title="How is it treated?">
          <p>
            <strong className="text-ink">Physiotherapy comes first.</strong> Over about 3 to 6 months it aims to bring
            down pain and swelling, get the knee moving fully, and rebuild strength and stability. Doing your home
            exercises consistently makes a real difference.
          </p>
          <p className="mt-2">
            <strong className="text-ink">Surgery if needed.</strong> If the knee keeps giving way, especially in contact
            sports, doctors may suggest ACL reconstruction. The torn ligament is replaced with a graft, usually taken from
            a tendon around the knee such as the hamstring or patellar tendon.
          </p>
        </Section>

        <Section title="Dos and don'ts while recovering">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="font-bold text-ink">Do</p>
              <Bullets
                items={[
                  'Wear your knee brace if the knee still buckles',
                  'Ice after exercises',
                  'Use compression and elevate to bring swelling down',
                  'Follow your physio\'s strengthening plan',
                  'Tell your physio about pain or swelling after exercise',
                ]}
              />
            </div>
            <div>
              <p className="font-bold text-ink">Don't</p>
              <Bullets
                items={[
                  'Go back to sport while the muscles are still weak',
                  'Cut or pivot before you are cleared',
                  'Add or change exercises without checking with your physio',
                ]}
              />
            </div>
          </div>
        </Section>

        <Section title="What does recovery look like?">
          <p>A common guide after reconstruction surgery:</p>
          <ol className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[
              ['~3 months', 'Start jogging'],
              ['~6 months', 'Light sports training'],
              ['~9 months', 'Competitive sport'],
            ].map(([when, what]) => (
              <li key={when} className="rounded-lg bg-bg p-2.5">
                <p className="font-display text-base font-extrabold text-ink">{when}</p>
                <p className="text-sm">{what}</p>
              </li>
            ))}
          </ol>
          <p className="mt-2">
            Everyone is different, so don't be discouraged if you take longer. Return to sport is decided with tests of
            graft health, strength and knee function.
          </p>
          <button
            type="button"
            onClick={() => setTab('progress')}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal px-4 font-bold text-teal"
          >
            See your milestones
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </Section>
      </div>

      {!desktop && <MythQuiz />}
      <SourceNote />
    </div>
  )
}

const FACTS = [
  { big: '4', label: 'main ligaments in the knee. The ACL is one of them.' },
  { big: '3–6', label: 'months of physio is the usual first-line treatment.' },
  { big: '~9', label: 'months after surgery before competitive sport, typically.' },
]

export function LearnSide() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Quick facts</SectionTitle>
        <ul className="mt-3 flex flex-col divide-y divide-line">
          {FACTS.map((f) => (
            <li key={f.big} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <span className="w-14 shrink-0 font-display text-3xl font-extrabold text-teal">{f.big}</span>
              <span className="text-muted">{f.label}</span>
            </li>
          ))}
        </ul>
      </Card>
      <MythQuiz />
    </div>
  )
}
