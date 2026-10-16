import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { CANNED_REPLIES, QUICK_REPLIES, TABS, initialChat, type ChatMsg, type TabId } from './data'
import { addDays, computeStreak, planFor, todayISO, type DayPlan, type Log } from './lib/plan'
import { usePersisted } from './lib/storage'

const LOG_DAYS_KEPT = 180

type AppState = {
  tab: TabId
  setTab: (t: TabId) => void

  checks: boolean[]
  toggleCheck: (i: number) => void

  today: string
  programStart: string
  todayPlan: DayPlan
  log: Log
  doneIds: string[]
  toggleExercise: (id: string) => void
  doneCount: number
  selectedExercise: number
  setSelectedExercise: (i: number) => void
  streak: number

  reminder: string | null
  setReminder: (t: string | null) => void

  chat: ChatMsg[]
  chipsLeft: number[]
  typing: boolean
  sendQuickReply: (i: number) => void
  sendText: (text: string) => void

  joinedGroups: string[]
  toggleGroup: (name: string) => void

  confidenceLog: Record<string, number>
  confidence: number | null
  setConfidence: (n: number) => void

  phoneView: boolean
  setPhoneView: (b: boolean) => void

  aboutOpen: boolean
  setAboutOpen: (b: boolean) => void

  toast: string | null
}

const Ctx = createContext<AppState | null>(null)

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside provider')
  return v
}

function tabFromHash(): TabId {
  const h = window.location.hash.replace('#', '')
  return (TABS.find((t) => t.id === h)?.id ?? 'check') as TabId
}

/** Keep the log small: drop days older than LOG_DAYS_KEPT. */
function prune(log: Log, today: string): Log {
  const cutoff = addDays(today, -LOG_DAYS_KEPT)
  return Object.fromEntries(Object.entries(log).filter(([d]) => d >= cutoff))
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [tab, setTabState] = useState<TabId>(tabFromHash)
  useEffect(() => {
    const onHash = () => setTabState(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const setTab = useCallback((t: TabId) => {
    if (window.location.hash !== '#' + t) window.location.hash = t
    setTabState(t)
    window.scrollTo({ top: 0 })
  }, [])

  // Re-render when the app is reopened on a new day.
  const [today, setToday] = useState(todayISO)
  useEffect(() => {
    const check = () => setToday(todayISO())
    const id = window.setInterval(check, 60_000)
    document.addEventListener('visibilitychange', check)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  const [checks, setChecks] = usePersisted<boolean[]>('checks', Array(5).fill(false))
  const toggleCheck = (i: number) => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))

  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number>(undefined)
  const showToast = (msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  // The plan starts the first day someone uses the app.
  const [programStart] = usePersisted('programStart', today)
  const [log, setLog] = usePersisted<Log>('log', {})
  const todayPlan = planFor(programStart, today)
  const doneIds = (log[today] ?? []).filter((id) => todayPlan.exercises.some((e) => e.id === id))
  const streak = computeStreak(programStart, log, today)

  const toggleExercise = (id: string) => {
    const current = new Set(log[today] ?? [])
    if (current.has(id)) current.delete(id)
    else current.add(id)
    const next = prune({ ...log, [today]: [...current] }, today)
    setLog(next)
    const finished = todayPlan.exercises.every((e) => current.has(e.id))
    const wasFinished = todayPlan.exercises.every((e) => (log[today] ?? []).includes(e.id))
    if (finished && !wasFinished) {
      const s = computeStreak(programStart, next, today)
      showToast(`Session complete! ${s}-day streak.`)
    }
  }
  const [selectedExercise, setSelectedExercise] = usePersisted('selectedExercise', 0)
  const [reminder, setReminder] = usePersisted<string | null>('reminder', null)

  const [chat, setChat] = usePersisted<ChatMsg[]>('chat', initialChat(todayPlan.phase.name))
  const [chipsLeft, setChipsLeft] = usePersisted<number[]>('chips', QUICK_REPLIES.map((_, i) => i))
  const [typing, setTyping] = useState(false)
  const pending = useRef(0)
  const cannedIdx = useRef(0)
  const sendWithReply = (text: string, reply: string) => {
    setChat((c) => [...c, { from: 'me', text }])
    pending.current += 1
    setTyping(true)
    window.setTimeout(() => {
      setChat((c) => [...c, { from: 'wj', text: reply }])
      pending.current -= 1
      if (pending.current === 0) setTyping(false)
    }, 700)
  }
  const sendQuickReply = (i: number) => {
    setChipsLeft((c) => c.filter((x) => x !== i))
    sendWithReply(QUICK_REPLIES[i].text, QUICK_REPLIES[i].reply)
  }
  const sendText = (text: string) => {
    const reply = CANNED_REPLIES[cannedIdx.current % CANNED_REPLIES.length]
    cannedIdx.current += 1
    sendWithReply(text, reply)
  }

  const [joinedGroups, setJoined] = usePersisted<string[]>('joinedGroups', [])
  const toggleGroup = (name: string) =>
    setJoined((g) => (g.includes(name) ? g.filter((x) => x !== name) : [...g, name]))

  const [confidenceLog, setConfidenceLog] = usePersisted<Record<string, number>>('confidenceLog', {})
  const setConfidence = (n: number) => setConfidenceLog((c) => ({ ...c, [today]: n }))
  const [phoneView, setPhoneView] = usePersisted('phoneView', false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const value: AppState = {
    tab,
    setTab,
    checks,
    toggleCheck,
    today,
    programStart,
    todayPlan,
    log,
    doneIds,
    toggleExercise,
    doneCount: doneIds.length,
    selectedExercise: Math.min(selectedExercise, Math.max(todayPlan.exercises.length - 1, 0)),
    setSelectedExercise,
    streak,
    reminder,
    setReminder,
    chat,
    chipsLeft,
    typing,
    sendQuickReply,
    sendText,
    joinedGroups,
    toggleGroup,
    confidenceLog,
    confidence: confidenceLog[today] ?? null,
    setConfidence,
    phoneView,
    setPhoneView,
    aboutOpen,
    setAboutOpen,
    toast,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
