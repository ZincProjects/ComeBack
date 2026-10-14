import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BASE_STREAK,
  CANNED_REPLIES,
  EXERCISES,
  INITIAL_CHAT,
  QUICK_REPLIES,
  TABS,
  type ChatMsg,
  type TabId,
} from './data'
import { usePersisted } from './lib/storage'

type AppState = {
  tab: TabId
  setTab: (t: TabId) => void

  checks: boolean[]
  toggleCheck: (i: number) => void

  done: boolean[]
  toggleDone: (i: number) => void
  doneCount: number
  todayFraction: number
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

  const [checks, setChecks] = usePersisted<boolean[]>('checks', Array(5).fill(false))
  const toggleCheck = (i: number) => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))

  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number>(undefined)
  const showToast = (msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  const [done, setDone] = usePersisted<boolean[]>('done', Array(EXERCISES.length).fill(false))
  const doneCount = done.filter(Boolean).length
  const allDone = doneCount === EXERCISES.length
  const toggleDone = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v))
    setDone(next)
    if (next.every(Boolean)) showToast('Session complete! Streak up to 10 days.')
  }
  const [selectedExercise, setSelectedExercise] = usePersisted('selectedExercise', 0)
  const [reminder, setReminder] = usePersisted<string | null>('reminder', null)

  const [chat, setChat] = usePersisted<ChatMsg[]>('chat', INITIAL_CHAT)
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

  const [confidence, setConfidence] = usePersisted<number | null>('confidence', null)
  const [phoneView, setPhoneView] = usePersisted('phoneView', false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const value: AppState = {
    tab,
    setTab,
    checks,
    toggleCheck,
    done,
    toggleDone,
    doneCount,
    todayFraction: doneCount / EXERCISES.length,
    selectedExercise,
    setSelectedExercise,
    streak: BASE_STREAK + (allDone ? 1 : 0),
    reminder,
    setReminder,
    chat,
    chipsLeft,
    typing,
    sendQuickReply,
    sendText,
    joinedGroups,
    toggleGroup,
    confidence,
    setConfidence,
    phoneView,
    setPhoneView,
    aboutOpen,
    setAboutOpen,
    toast,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
