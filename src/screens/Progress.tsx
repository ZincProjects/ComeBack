import { Check } from 'lucide-react'
import { useId } from 'react'
import { CONFIDENCE_NOTES, CONFIDENCE_TREND, MILESTONES, WEEK_DAYS, WEEK_FULL, WEEK_VALUES } from '../data'
import { useApp } from '../state'
import { Card, cx, PageHeading, SectionTitle } from '../components/ui'

function describe(v: number) {
  if (v >= 1) return 'full session'
  if (v <= 0) return 'no session'
  return `${Math.round(v * 100)}% of session`
}

function WeekChart() {
  const { todayFraction } = useApp()
  const values = [...WEEK_VALUES, todayFraction]
  const sessions = values.reduce((a, b) => a + b, 0)
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-2">
        <SectionTitle>Sessions this week</SectionTitle>
        <p className="text-sm text-muted">{sessions.toFixed(1).replace('.0', '')} of 7</p>
      </div>
      <div className="mt-4 flex h-36 items-end gap-2" aria-hidden="true">
        {values.map((v, i) => {
          const today = i === values.length - 1
          const empty = v <= 0
          return (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="flex w-full max-w-10 flex-1 items-end">
                <div
                  className={cx(
                    'w-full rounded-md transition-[height] duration-300',
                    today ? 'bg-accent' : empty ? 'bg-empty' : 'bg-teal',
                  )}
                  style={{ height: empty ? '6px' : `${Math.max(v * 100, 6)}%` }}
                />
              </div>
              <span className={cx('text-xs', today ? 'font-bold text-ink' : 'text-muted')}>{WEEK_DAYS[i]}</span>
            </div>
          )
        })}
      </div>
      <ul className="sr-only">
        {values.map((v, i) => (
          <li key={i}>
            {WEEK_FULL[i]}
            {i === values.length - 1 ? ' (today)' : ''}: {describe(v)}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-hidden="true">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-teal" />Done</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent" />Today (live)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-empty" />Missed</span>
      </div>
    </Card>
  )
}

function ConfidenceCheck() {
  const { confidence, setConfidence } = useApp()
  const name = useId()
  return (
    <Card>
      <fieldset>
        <legend className="font-display text-lg font-extrabold">How confident does your knee feel today?</legend>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="relative">
              <input
                type="radio"
                name={name}
                value={n}
                checked={confidence === n}
                onChange={() => setConfidence(n)}
                className="peer sr-only"
              />
              <span
                className={cx(
                  'grid min-h-12 cursor-pointer place-items-center rounded-xl border text-lg font-bold peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal',
                  confidence === n ? 'border-teal bg-teal text-white' : 'border-line bg-white text-ink',
                )}
              >
                {n}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted" aria-hidden="true">
          <span>Not at all</span>
          <span>Very</span>
        </div>
      </fieldset>
      <p className="mt-3 rounded-lg bg-bg p-3" aria-live="polite">
        {confidence ? CONFIDENCE_NOTES[confidence - 1] : 'Tap a number to log today. There are no wrong answers.'}
      </p>
    </Card>
  )
}

function Milestones() {
  const nextIdx = MILESTONES.findIndex((m) => !m.done)
  return (
    <Card>
      <SectionTitle>Milestones</SectionTitle>
      <ol className="mt-4 flex flex-col">
        {MILESTONES.map((m, i) => {
          const next = i === nextIdx
          return (
            <li key={m.label} className="relative flex gap-3 pb-5 last:pb-0">
              {i < MILESTONES.length - 1 && (
                <span
                  className={cx('absolute top-7 left-[13px] h-[calc(100%-28px)] w-0.5', m.done ? 'bg-teal' : 'bg-line')}
                  aria-hidden="true"
                />
              )}
              <span
                className={cx(
                  'z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2',
                  m.done ? 'border-teal bg-teal text-white' : next ? 'border-accent bg-white' : 'border-line bg-white',
                )}
                aria-hidden="true"
              >
                {m.done && <Check className="h-4 w-4" strokeWidth={3} />}
                {next && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
              </span>
              <div className="flex-1 pt-0.5">
                <p className={cx('font-bold', !m.done && !next && 'text-muted')}>{m.label}</p>
                <p className="text-sm text-muted">
                  {m.when}
                  {m.done ? ' · Done' : next ? ' · Up next' : ''}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

function TrendChart() {
  const { confidence } = useApp()
  const points = [...CONFIDENCE_TREND, ...(confidence ? [{ label: 'Today', value: confidence }] : [])]
  const W = 320
  const H = 170
  const padL = 28
  const padR = 16
  const padT = 14
  const padB = 30
  const slots = CONFIDENCE_TREND.length + 1
  const x = (i: number) => padL + (i * (W - padL - padR)) / (slots - 1)
  const y = (v: number) => padT + ((5 - v) * (H - padT - padB)) / 4
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.value)}`).join(' ')
  const summary = points.map((p) => `${p.label}: ${p.value}`).join(', ')
  return (
    <Card>
      <SectionTitle>Confidence trend</SectionTitle>
      <p className="text-sm text-muted">Average self-rating, 1 to 5</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={`Confidence trend. ${summary}`}>
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeWidth={1} />
            <text x={padL - 10} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">
              {v}
            </text>
          </g>
        ))}
        <path d={path} fill="none" stroke="var(--color-teal)" strokeWidth={2.5} strokeLinejoin="round" />
        {points.map((p, i) => {
          const today = p.label === 'Today'
          return (
            <circle
              key={p.label}
              cx={x(i)}
              cy={y(p.value)}
              r={today ? 6 : 4.5}
              fill={today ? 'var(--color-accent)' : 'var(--color-teal)'}
              stroke="white"
              strokeWidth={2}
            />
          )
        })}
        {!confidence && (
          <circle
            cx={x(slots - 1)}
            cy={y(3)}
            r={6}
            fill="none"
            stroke="var(--color-muted)"
            strokeDasharray="3 3"
            strokeWidth={1.5}
          />
        )}
        {[...CONFIDENCE_TREND.map((p) => p.label), 'Today'].map((l, i) => (
          <text
            key={l}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize={11}
            fontWeight={l === 'Today' ? 700 : 400}
            fill={l === 'Today' ? 'var(--color-ink)' : 'var(--color-muted)'}
          >
            {l}
          </text>
        ))}
      </svg>
      {!confidence && <p className="mt-1 text-sm text-muted">Log today's confidence to add it to the trend.</p>}
    </Card>
  )
}

export function ProgressMain({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="Week 7 of your comeback" sub="Small sessions add up. Here's how this week is going." />
      <WeekChart />
      <ConfidenceCheck />
      {!desktop && <Milestones />}
    </div>
  )
}

export function ProgressSide() {
  return (
    <div className="flex flex-col gap-4">
      <Milestones />
      <TrendChart />
    </div>
  )
}
