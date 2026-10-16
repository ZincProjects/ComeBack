import { Check } from 'lucide-react'
import { useId } from 'react'
import { CONFIDENCE_NOTES, MILESTONES, WEEK_DAYS, WEEK_FULL } from '../data'
import { addDays, dayFraction, phaseRange, planFor, startOfWeek, weekOf } from '../lib/plan'
import { useApp } from '../state'
import { Card, cx, PageHeading, SectionTitle } from '../components/ui'

type DayBar = {
  label: string
  full: string
  kind: 'done' | 'today' | 'missed' | 'rest' | 'future' | 'none'
  value: number
}

function describe(d: DayBar) {
  if (d.kind === 'rest') return 'rest day'
  if (d.kind === 'none') return 'before your plan started'
  if (d.kind === 'future') return 'coming up'
  if (d.value >= 1) return 'full session'
  if (d.value <= 0) return d.kind === 'today' ? 'not started yet' : 'missed'
  return `${Math.round(d.value * 100)}% of session`
}

function WeekChart() {
  const { programStart, today, log } = useApp()
  const monday = startOfWeek(today)
  const days: DayBar[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i)
    const plan = planFor(programStart, date)
    const f = dayFraction(plan, log)
    const kind: DayBar['kind'] =
      plan.week === 0
        ? 'none'
        : f === null
          ? 'rest'
          : date === today
            ? 'today'
            : date > today
              ? 'future'
              : f > 0
                ? 'done'
                : 'missed'
    return { label: WEEK_DAYS[i], full: WEEK_FULL[i] + (date === today ? ' (today)' : ''), kind, value: f ?? 0 }
  })
  const scheduled = days.filter((d) => d.kind !== 'rest' && d.kind !== 'none')
  const sessions = scheduled.reduce((a, d) => a + d.value, 0)
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-2">
        <SectionTitle>Sessions this week</SectionTitle>
        <p className="text-sm text-muted">
          {sessions.toFixed(1).replace('.0', '')} of {scheduled.length}
        </p>
      </div>
      <div className="mt-4 flex h-36 items-end gap-2" aria-hidden="true">
        {days.map((d, i) => {
          const isToday = d.kind === 'today'
          return (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="flex w-full max-w-10 flex-1 items-end">
                {d.kind === 'rest' || d.kind === 'none' ? (
                  <span className="w-full text-center text-[11px] text-muted">{d.kind === 'rest' ? 'Rest' : ''}</span>
                ) : d.kind === 'future' ? (
                  <div className="h-full w-full rounded-md border-2 border-dashed border-line" />
                ) : (
                  <div
                    className={cx(
                      'w-full rounded-md transition-[height] duration-300',
                      isToday ? 'bg-accent' : d.value > 0 ? 'bg-teal' : 'bg-empty',
                    )}
                    style={{ height: d.value > 0 ? `${Math.max(d.value * 100, 6)}%` : '6px' }}
                  />
                )}
              </div>
              <span className={cx('text-xs', isToday ? 'font-bold text-ink' : 'text-muted')}>{d.label}</span>
            </div>
          )
        })}
      </div>
      <ul className="sr-only">
        {days.map((d, i) => (
          <li key={i}>
            {d.full}: {describe(d)}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-teal" />
          Done
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
          Today (live)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-empty" />
          Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-muted" />
          Coming up
        </span>
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
  const { todayPlan } = useApp()
  const milestones = MILESTONES.map((m) => ({ ...m, done: m.week === 0 || todayPlan.week > m.week }))
  const nextIdx = milestones.findIndex((m) => !m.done)
  return (
    <Card>
      <SectionTitle>Milestones</SectionTitle>
      <ol className="mt-4 flex flex-col">
        {milestones.map((m, i) => {
          const next = i === nextIdx
          return (
            <li key={m.label} className="relative flex gap-3 pb-5 last:pb-0">
              {i < milestones.length - 1 && (
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
  const { confidenceLog, programStart, today } = useApp()
  const thisMonday = startOfWeek(today)
  // Weekly average of logged confidence over the last 4 calendar weeks.
  const weeks = [3, 2, 1, 0].map((ago) => {
    const monday = addDays(thisMonday, -7 * ago)
    const vals = Array.from({ length: 7 }, (_, i) => confidenceLog[addDays(monday, i)]).filter(
      (v): v is number => typeof v === 'number',
    )
    const wk = weekOf(programStart, monday < programStart ? programStart : monday)
    return {
      label: ago === 0 ? 'This wk' : addDays(monday, 6) < programStart ? '—' : `Wk ${wk}`,
      value: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null,
      current: ago === 0,
    }
  })
  const points = weeks
    .map((w, i) => ({ ...w, i }))
    .filter((w): w is typeof w & { value: number } => w.value !== null)
  const W = 320
  const H = 170
  const padL = 28
  const padR = 16
  const padT = 14
  const padB = 30
  const x = (i: number) => padL + (i * (W - padL - padR)) / (weeks.length - 1)
  const y = (v: number) => padT + ((5 - v) * (H - padT - padB)) / 4
  const path = points.map((p, k) => `${k === 0 ? 'M' : 'L'}${x(p.i)},${y(p.value)}`).join(' ')
  const summary = points.length ? points.map((p) => `${p.label}: ${p.value}`).join(', ') : 'no check-ins yet'
  return (
    <Card>
      <SectionTitle>Confidence trend</SectionTitle>
      <p className="text-sm text-muted">Weekly average of your check-ins, 1 to 5</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={`Confidence trend. ${summary}`}>
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeWidth={1} />
            <text x={padL - 10} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">
              {v}
            </text>
          </g>
        ))}
        {points.length > 1 && (
          <path d={path} fill="none" stroke="var(--color-teal)" strokeWidth={2.5} strokeLinejoin="round" />
        )}
        {points.map((p) => (
          <circle
            key={p.i}
            cx={x(p.i)}
            cy={y(p.value)}
            r={p.current ? 6 : 4.5}
            fill={p.current ? 'var(--color-accent)' : 'var(--color-teal)'}
            stroke="white"
            strokeWidth={2}
          />
        ))}
        {weeks.map((w, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize={11}
            fontWeight={w.current ? 700 : 400}
            fill={w.current ? 'var(--color-ink)' : 'var(--color-muted)'}
          >
            {w.label}
          </text>
        ))}
      </svg>
      {!confidenceLog[today] && (
        <p className="mt-1 text-sm text-muted">Log today's confidence to add it to the trend.</p>
      )}
    </Card>
  )
}

export function ProgressMain({ desktop = false }: { desktop?: boolean }) {
  const { todayPlan, streak } = useApp()
  const { phase } = todayPlan
  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        eyebrow={`Phase ${phase.number}: ${phase.name} · ${phaseRange(phase)}`}
        title={`Week ${todayPlan.week} of your comeback`}
        sub={streak > 0 ? `${streak}-day streak. Small sessions add up.` : "Finish today's session to start your streak."}
      />
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
