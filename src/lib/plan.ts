// Rehab programme: phases by week since the plan started, a weekly session template
// (with rest days), and reps that progress week by week within a phase.

export type ExerciseDef = {
  id: string
  name: string
  prop: string
  how: string
  mistake: string
  sets: number
  /** Starting reps (or seconds when unit is ' s'). */
  base: number
  /** Added per week within the phase, capped at max. */
  step: number
  max: number
  /** Suffix after the reps, e.g. ' s', ' each leg'. */
  unit?: string
  note?: string
}

export type PlannedExercise = ExerciseDef & { reps: string }

const LIBRARY: ExerciseDef[] = [
  // Phase 1: early recovery
  { id: 'quad_sets', name: 'Quad sets', prop: 'Towel', sets: 3, base: 10, step: 2, max: 15, note: ' · 5 s hold',
    how: 'Sit with your leg straight and a rolled towel under the knee. Tighten the thigh muscle to press the back of the knee down into the towel. Hold for 5 seconds, then relax.',
    mistake: 'Lifting the heel or holding your breath instead of pressing the knee down.' },
  { id: 'slr', name: 'Straight-leg raises', prop: 'Floor', sets: 3, base: 10, step: 1, max: 15,
    how: 'Lie on your back with the other knee bent. Lock the working knee straight by tightening the thigh, then lift the leg to the height of the bent knee. Lower slowly.',
    mistake: 'Letting the knee bend as you lift, which takes the work off the quads.' },
  { id: 'heel_slides', name: 'Heel slides', prop: 'Floor', sets: 2, base: 12, step: 2, max: 20,
    how: 'Lie on your back with legs straight. Slide the heel towards your bottom to bend the knee as far as is comfortable, pause, then slide it back out.',
    mistake: 'Rushing, or forcing past sharp pain. Go to a stretch, not to pain.' },
  { id: 'ankle_pumps', name: 'Ankle pumps', prop: 'Floor', sets: 2, base: 20, step: 0, max: 20,
    how: 'Lie or sit with your leg straight. Point your toes away, then pull them back towards you, at a steady rhythm. Helps circulation and swelling.',
    mistake: 'Moving only the toes. The whole foot should move at the ankle.' },
  { id: 'prone_hang', name: 'Prone knee hangs', prop: 'Bed edge', sets: 3, base: 30, step: 15, max: 90, unit: ' s',
    how: 'Lie face down on a bed with your lower leg hanging off the edge from just above the knee. Let gravity gently straighten the knee and relax.',
    mistake: 'Tensing the thigh. Let the leg hang loose so the knee can straighten.' },
  { id: 'glute_bridge', name: 'Glute bridges', prop: 'Floor', sets: 3, base: 10, step: 2, max: 15,
    how: 'Lie on your back with knees bent and feet flat. Squeeze your glutes and lift your hips until your body is in a straight line, then lower slowly.',
    mistake: 'Arching the lower back. Lift from the hips, not the spine.' },
  { id: 'side_abd', name: 'Side-lying leg lifts', prop: 'Floor', sets: 3, base: 10, step: 1, max: 15,
    how: 'Lie on your side with the bottom knee bent. Keep the top leg straight and lift it towards the ceiling, slightly behind you, then lower slowly.',
    mistake: 'Rolling backwards. Keep your hips stacked and toes pointing forward.' },
  { id: 'calf_stretch', name: 'Towel calf stretch', prop: 'Towel', sets: 3, base: 30, step: 0, max: 30, unit: ' s',
    how: 'Sit with your leg straight. Loop a towel around the ball of your foot and gently pull your toes towards you until you feel a stretch in the calf.',
    mistake: 'Bending the knee. Keep it straight to stretch the right muscle.' },
  // Phase 2: strength
  { id: 'wall_sit', name: 'Wall sit', prop: 'Wall', sets: 3, base: 30, step: 5, max: 60, unit: ' s',
    how: 'Lean your back against a wall with feet shoulder-width apart, about a foot in front. Slide down until your knees bend to roughly 45 to 60 degrees, and hold.',
    mistake: 'Knees drifting inwards. Keep them in line with your second toe.' },
  { id: 'step_ups', name: 'Step-ups', prop: 'Stairs', sets: 3, base: 8, step: 1, max: 12, unit: ' each leg',
    how: 'Stand facing a stair. Step up with the working leg, push through the whole foot to straighten up, then step down slowly with control.',
    mistake: 'Pushing off the bottom foot. Let the top leg do the work.' },
  { id: 'calf_raises', name: 'Calf raises', prop: 'Bottles', sets: 3, base: 12, step: 1, max: 20,
    how: 'Hold a 1.5 L water bottle in each hand. Stand tall and rise onto the balls of your feet, pause at the top, then lower slowly over 2 to 3 seconds.',
    mistake: 'Bouncing at the bottom. Slow lowering builds the most strength.' },
  { id: 'mini_squat', name: 'Mini squats', prop: 'Chair', sets: 3, base: 10, step: 1, max: 15,
    how: 'Stand in front of a chair with feet hip-width apart. Sit back as if to sit down, bending the knees to about 45 degrees, then stand back up.',
    mistake: 'Knees shooting forward past the toes. Push your hips back first.' },
  { id: 'sl_balance', name: 'Single-leg balance', prop: 'Counter', sets: 3, base: 20, step: 10, max: 60, unit: ' s',
    how: 'Stand on your injured leg next to a counter for support. Keep a soft bend in the knee and hold your balance. Touch the counter only if needed.',
    mistake: 'Locking the knee straight. A slight bend trains the muscles that protect it.' },
  { id: 'sl_bridge', name: 'Single-leg bridges', prop: 'Floor', sets: 3, base: 6, step: 1, max: 10, unit: ' each leg',
    how: 'Lie on your back with one knee bent and the other leg straight. Push through the bent leg to lift your hips, keeping them level, then lower.',
    mistake: 'Hips dropping to one side. Keep the pelvis level throughout.' },
  { id: 'step_down', name: 'Slow step-downs', prop: 'Stairs', sets: 3, base: 6, step: 1, max: 10, unit: ' each leg',
    how: 'Stand on a low step on your injured leg. Slowly lower the other heel to tap the floor, taking 3 seconds, then straighten back up.',
    mistake: 'Knee caving inwards on the way down. Go slower and keep it over your toes.' },
  { id: 'ham_curl', name: 'Standing hamstring curls', prop: 'Chair', sets: 3, base: 10, step: 1, max: 15,
    how: 'Hold the back of a chair. Bend your knee to bring your heel towards your bottom, pause, then lower slowly.',
    mistake: 'Swinging the thigh forward. Keep both knees side by side.' },
  { id: 'split_squat', name: 'Split squats', prop: 'Floor', sets: 3, base: 6, step: 1, max: 10, unit: ' each leg',
    how: 'Stand in a long stride. Lower your back knee towards the floor, keeping your front knee over the ankle, then push back up.',
    mistake: 'Leaning forward. Keep your chest tall and weight between both feet.' },
  // Phase 3: return to running (physio clearance required)
  { id: 'squat', name: 'Backpack squats', prop: 'Backpack', sets: 3, base: 10, step: 1, max: 15,
    how: 'Wear a backpack of textbooks. Squat down until your thighs are about parallel to the floor, then drive back up.',
    mistake: 'Heels lifting. Keep your weight through the whole foot.' },
  { id: 'reverse_lunge', name: 'Reverse lunges', prop: 'Floor', sets: 3, base: 8, step: 1, max: 12, unit: ' each leg',
    how: 'Step one foot back and lower until both knees are bent about 90 degrees. Push through the front foot to return.',
    mistake: 'Front knee wobbling. Slow down until it stays steady.' },
  { id: 'sl_rdl', name: 'Single-leg deadlifts', prop: 'Bottles', sets: 3, base: 6, step: 1, max: 10, unit: ' each leg',
    how: 'Stand on one leg holding a bottle. Hinge at the hips, reaching the bottle towards the floor as the other leg extends behind you, then stand tall.',
    mistake: 'Rounding the back. Hinge from the hips with a flat back.' },
  { id: 'lateral_step', name: 'Lateral step-ups', prop: 'Stairs', sets: 3, base: 8, step: 1, max: 12, unit: ' each leg',
    how: 'Stand side-on to a step. Step up sideways with the near leg, straighten fully, then lower slowly.',
    mistake: 'Hip hitching up. Keep your hips level as you rise.' },
  { id: 'jog_intervals', name: 'Jog-walk intervals', prop: 'Outdoors', sets: 6, base: 1, step: 0, max: 1, unit: ' min jog + 1 min walk',
    how: 'On flat ground, jog gently for one minute then walk for one minute. Only once your physio has cleared you to run.',
    mistake: 'Speeding up. Keep it easy enough to hold a conversation.' },
  { id: 'mini_hops', name: 'Mini hops', prop: 'Floor', sets: 3, base: 10, step: 2, max: 20,
    how: 'With feet together, do small, quiet hops on the spot, landing softly with knees slightly bent. Only once your physio has cleared you.',
    mistake: 'Landing stiff-legged. Land softly like a spring.' },
  // Phase 4: back to sport
  { id: 'lateral_shuffle', name: 'Lateral shuffles', prop: 'Outdoors', sets: 4, base: 15, step: 5, max: 30, unit: ' s',
    how: 'Stay low in an athletic stance and shuffle sideways for the set time, then back. Keep feet apart and knees soft.',
    mistake: 'Crossing your feet. Push off and keep them apart.' },
  { id: 'sl_hop', name: 'Single-leg hops', prop: 'Floor', sets: 3, base: 6, step: 1, max: 10, unit: ' each leg',
    how: 'Hop forward on one leg and stick the landing for 2 seconds before the next hop.',
    mistake: 'Knee collapsing inwards on landing. Shorter hops until it stays straight.' },
  { id: 'skater', name: 'Skater bounds', prop: 'Outdoors', sets: 3, base: 6, step: 1, max: 10, unit: ' each side',
    how: 'Leap sideways from one leg to the other like a speed skater, landing softly and holding for a moment.',
    mistake: 'Rushing the landings. Control first, then speed.' },
  { id: 'stop_go', name: 'Stop-and-go drills', prop: 'Outdoors', sets: 4, base: 20, step: 0, max: 20, unit: ' m',
    how: 'Jog forward, then stop under control on a signal, sinking your hips. Builds the braking that protects your ACL in sport.',
    mistake: 'Stopping with straight knees. Bend the knees and hips to brake.' },
]

const BY_ID = Object.fromEntries(LIBRARY.map((e) => [e.id, e]))

type Session = { title: string; exercises: string[] }
export type Phase = {
  number: number
  name: string
  from: number
  to: number | null
  /** Monday-first session keys; null = rest day. */
  template: (string | null)[]
  sessions: Record<string, Session>
}

export const PHASES: Phase[] = [
  {
    number: 1, name: 'Early recovery', from: 1, to: 5,
    template: ['A', 'B', 'A', 'B', 'A', 'B', null],
    sessions: {
      A: { title: 'Wake up the quads', exercises: ['quad_sets', 'slr', 'heel_slides', 'ankle_pumps', 'glute_bridge', 'prone_hang'] },
      B: { title: 'Bend and straighten', exercises: ['heel_slides', 'prone_hang', 'calf_stretch', 'side_abd', 'quad_sets', 'glute_bridge'] },
    },
  },
  {
    number: 2, name: 'Strength', from: 6, to: 12,
    template: ['A', 'B', 'C', null, 'A', 'B', null],
    sessions: {
      A: { title: 'Strength A', exercises: ['quad_sets', 'slr', 'heel_slides', 'wall_sit', 'step_ups', 'calf_raises'] },
      B: { title: 'Balance and control', exercises: ['sl_balance', 'mini_squat', 'sl_bridge', 'side_abd', 'step_down', 'calf_raises'] },
      C: { title: 'Strength B', exercises: ['wall_sit', 'split_squat', 'ham_curl', 'glute_bridge', 'step_ups', 'slr'] },
    },
  },
  {
    number: 3, name: 'Return to running', from: 13, to: 24,
    template: ['A', 'B', null, 'A', 'C', 'B', null],
    sessions: {
      A: { title: 'Leg strength', exercises: ['squat', 'reverse_lunge', 'sl_rdl', 'step_down', 'calf_raises', 'sl_bridge'] },
      B: { title: 'Run prep', exercises: ['jog_intervals', 'mini_hops', 'sl_balance', 'lateral_step', 'ham_curl'] },
      C: { title: 'Single-leg control', exercises: ['sl_rdl', 'split_squat', 'lateral_step', 'sl_balance', 'side_abd', 'wall_sit'] },
    },
  },
  {
    number: 4, name: 'Back to sport', from: 25, to: null,
    template: ['A', 'B', null, 'A', 'B', 'C', null],
    sessions: {
      A: { title: 'Power and strength', exercises: ['squat', 'reverse_lunge', 'sl_rdl', 'sl_hop', 'calf_raises'] },
      B: { title: 'Agility', exercises: ['lateral_shuffle', 'skater', 'stop_go', 'mini_hops', 'sl_balance'] },
      C: { title: 'Sport conditioning', exercises: ['jog_intervals', 'stop_go', 'lateral_shuffle', 'sl_hop', 'split_squat'] },
    },
  },
]

// ---------- dates (local calendar days as YYYY-MM-DD) ----------
const pad = (n: number) => String(n).padStart(2, '0')
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => toISO(new Date())
const fromISO = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const addDays = (iso: string, n: number) => {
  const d = fromISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}
export const daysBetween = (a: string, b: string) => {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000)
}
/** Monday = 0 … Sunday = 6 */
export const weekdayIndex = (iso: string) => (fromISO(iso).getDay() + 6) % 7
export const startOfWeek = (iso: string) => addDays(iso, -weekdayIndex(iso))

// ---------- plan ----------
export type DayPlan = {
  date: string
  /** 1-based programme week, or 0 before the plan started. */
  week: number
  phase: Phase
  sessionTitle: string | null
  exercises: PlannedExercise[]
}

export const weekOf = (start: string, date: string) => {
  const d = daysBetween(start, date)
  return d < 0 ? 0 : Math.floor(d / 7) + 1
}

export const phaseFor = (week: number) =>
  PHASES.find((p) => week >= p.from && (p.to === null || week <= p.to)) ?? PHASES[0]

function prescribe(e: ExerciseDef, weekInPhase: number): PlannedExercise {
  const reps = Math.min(e.max, e.base + e.step * weekInPhase)
  return { ...e, reps: `${e.sets} × ${reps}${e.unit ?? ''}${e.note ?? ''}` }
}

export function planFor(start: string, date: string): DayPlan {
  const week = weekOf(start, date)
  const phase = phaseFor(Math.max(week, 1))
  if (week === 0) return { date, week, phase, sessionTitle: null, exercises: [] }
  const key = phase.template[weekdayIndex(date)]
  if (!key) return { date, week, phase, sessionTitle: null, exercises: [] }
  const session = phase.sessions[key]
  const weekInPhase = week - phase.from
  return {
    date,
    week,
    phase,
    sessionTitle: session.title,
    exercises: session.exercises.map((id) => prescribe(BY_ID[id], weekInPhase)),
  }
}

export type Log = Record<string, string[]>

/** Share of a day's planned exercises completed, or null for rest days / before the plan. */
export function dayFraction(plan: DayPlan, log: Log): number | null {
  if (plan.exercises.length === 0) return null
  const done = new Set(log[plan.date] ?? [])
  return plan.exercises.filter((e) => done.has(e.id)).length / plan.exercises.length
}

/** Consecutive completed sessions ending today (today counts once finished). Rest days don't break it. */
export function computeStreak(start: string, log: Log, today: string): number {
  let streak = 0
  for (let d = today, i = 0; i < 500 && d >= start; d = addDays(d, -1), i++) {
    const f = dayFraction(planFor(start, d), log)
    if (f === null) continue
    if (f >= 1) streak++
    else if (d !== today) break
  }
  return streak
}

export const phaseRange = (p: Phase) => (p.to ? `weeks ${p.from}–${p.to}` : `week ${p.from}+`)
