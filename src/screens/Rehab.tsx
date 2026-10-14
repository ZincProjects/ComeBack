import { Bell, Check, ChevronRight, Lightbulb, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { EXERCISES, REMIND_SLOTS } from '../data'
import { useApp } from '../state'
import { Card, cx, PageHeading, SectionTitle, Tag } from '../components/ui'

function DoneBox({ done }: { done: boolean }) {
  return (
    <span
      className={cx(
        'grid h-7 w-7 shrink-0 place-items-center rounded-full border-2',
        done ? 'border-teal bg-teal text-white' : 'border-muted bg-white',
      )}
      aria-hidden="true"
    >
      {done && <Check className="h-4 w-4" strokeWidth={3} />}
    </span>
  )
}

export function RehabMain({ desktop = false }: { desktop?: boolean }) {
  const { done, toggleDone, doneCount, selectedExercise, setSelectedExercise } = useApp()
  const pct = Math.round((doneCount / EXERCISES.length) * 100)
  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="Today's 12-minute session" sub="No gym needed. Fits between study blocks." />

      <section className="on-dark rounded-[14px] bg-ink p-4 text-white" aria-label="Session progress">
        <div className="flex items-end justify-between">
          <p className="font-display text-2xl font-extrabold">
            {doneCount} of {EXERCISES.length} done
          </p>
          <p className="text-lg font-bold text-bright">{pct}%</p>
        </div>
        <div
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15"
          role="progressbar"
          aria-label="Exercises completed"
          aria-valuemin={0}
          aria-valuemax={EXERCISES.length}
          aria-valuenow={doneCount}
        >
          <div className="h-full rounded-full bg-bright transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-3 text-sm text-white/85">Plan set with your physio · Phase 2 (weeks 6–12)</p>
      </section>

      <ul className="flex flex-col gap-2.5" aria-label="Exercises">
        {EXERCISES.map((ex, i) => {
          const info = (
            <span className="flex min-w-0 flex-1 flex-col">
              <span className={cx('font-bold', done[i] && 'text-muted line-through')}>{ex.name}</span>
              <span className="text-sm text-muted">{ex.reps}</span>
            </span>
          )
          if (!desktop)
            return (
              <li key={ex.name}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={done[i]}
                  onClick={() => toggleDone(i)}
                  className={cx(
                    'flex min-h-16 w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left',
                    done[i] ? 'border-teal' : 'border-line',
                  )}
                >
                  <DoneBox done={done[i]} />
                  {info}
                  <Tag>{ex.prop}</Tag>
                </button>
              </li>
            )
          const selected = selectedExercise === i
          return (
            <li
              key={ex.name}
              className={cx(
                'flex items-center gap-1 rounded-xl border bg-card pl-2',
                selected ? 'border-teal ring-2 ring-teal' : done[i] ? 'border-teal' : 'border-line',
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={done[i]}
                aria-label={`Mark ${ex.name} done`}
                onClick={() => toggleDone(i)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg"
              >
                <DoneBox done={done[i]} />
              </button>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedExercise(i)}
                className="flex min-h-16 flex-1 items-center gap-3 rounded-r-xl py-3 pr-3 text-left"
              >
                {info}
                <Tag>{ex.prop}</Tag>
                <ChevronRight className="h-5 w-5 text-muted" aria-hidden="true" />
                <span className="sr-only">Show details</span>
              </button>
            </li>
          )
        })}
      </ul>

      <Card className="flex gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-muted">
          <strong className="text-ink">No dumbbells?</strong> Two 1.5 L water bottles or a backpack of textbooks work.
          Book a gym session for leg press once a week.
        </p>
      </Card>
    </div>
  )
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${String(m).padStart(2, '0')} ${suffix}`
}

export function RehabSide() {
  const { selectedExercise, done, toggleDone, reminder, setReminder } = useApp()
  const ex = EXERCISES[selectedExercise] ?? EXERCISES[0]
  const [time, setTime] = useState(reminder ?? '16:00')
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">
              Exercise {selectedExercise + 1} of {EXERCISES.length}
            </p>
            <SectionTitle>{ex.name}</SectionTitle>
          </div>
          <Tag>{ex.prop}</Tag>
        </div>
        <div
          className="mt-3 grid aspect-video place-items-center rounded-xl border border-dashed border-muted/50 bg-bg text-muted"
          role="img"
          aria-label={`Placeholder for ${ex.name} exercise video`}
        >
          <span className="flex flex-col items-center gap-1">
            <PlayCircle className="h-8 w-8" aria-hidden="true" />
            [Exercise video]
          </span>
        </div>
        <p className="mt-3 font-bold">{ex.reps}</p>
        <p className="mt-1 text-muted">{ex.how}</p>
        <p className="mt-3 rounded-lg bg-warn-soft p-3 text-sm">
          <strong>Common mistake:</strong> {ex.mistake}
        </p>
        <button
          type="button"
          onClick={() => toggleDone(selectedExercise)}
          className={cx(
            'mt-4 min-h-11 w-full rounded-xl px-4 font-bold',
            done[selectedExercise] ? 'border border-teal bg-white text-teal' : 'bg-teal text-white',
          )}
        >
          {done[selectedExercise] ? 'Done ✓ (tap to undo)' : 'Mark as done'}
        </button>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-teal" aria-hidden="true" />
          <SectionTitle>Remind me</SectionTitle>
        </div>
        <p className="mt-1 text-sm text-muted">Pick a slot that fits your timetable.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {REMIND_SLOTS.map((s) => (
            <button
              key={s.time}
              type="button"
              aria-pressed={time === s.time}
              onClick={() => setTime(s.time)}
              className={cx(
                'min-h-11 rounded-full border px-3.5 text-sm font-bold',
                time === s.time ? 'border-teal bg-teal text-white' : 'border-line bg-white text-ink',
              )}
            >
              {s.label} {s.display}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-end gap-2">
          <label className="flex flex-1 flex-col gap-1 text-sm font-bold">
            Custom time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="min-h-11 rounded-lg border border-line bg-white px-3 font-normal"
            />
          </label>
          <button
            type="button"
            onClick={() => setReminder(time)}
            className="min-h-11 rounded-lg bg-ink px-4 font-bold text-white"
          >
            Set reminder
          </button>
        </div>
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {reminder ? `Daily reminder set for ${formatTime(reminder)} (demo only).` : 'No reminder set yet.'}
        </p>
      </Card>
    </div>
  )
}
