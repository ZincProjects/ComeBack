import { CalendarDays, Send, Users } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { PEER_GROUPS, QUICK_REPLIES, TELEGRAM_CIRCLE_URL } from '../data'
import { useApp } from '../state'
import { Card, cx, PageHeading, SectionTitle } from '../components/ui'

function Avatar({ size = 'h-12 w-12 text-base' }: { size?: string }) {
  return (
    <span
      className={cx('grid shrink-0 place-items-center rounded-full bg-teal font-display font-extrabold text-white', size)}
      aria-hidden="true"
    >
      WJ
    </span>
  )
}

const CIRCLE = 'ACL Comeback Circle'

export function CircleCard() {
  const { joinedGroups, toggleGroup } = useApp()
  const joined = joinedGroups.includes(CIRCLE)
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-soft text-teal" aria-hidden="true">
          <Users className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <SectionTitle>{CIRCLE}</SectionTitle>
          <p className="mt-1 text-sm text-muted">8 student athletes · weekly check-in Thu 8pm · park workout Sat 9am</p>
        </div>
      </div>
      {TELEGRAM_CIRCLE_URL ? (
        <>
          <a
            href={TELEGRAM_CIRCLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => !joined && toggleGroup(CIRCLE)}
            className={cx(
              'mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 font-bold',
              joined ? 'border border-teal bg-teal-soft text-teal' : 'bg-teal text-white',
            )}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {joined ? 'Open the group chat' : 'Join on Telegram'}
            <span className="sr-only">(opens Telegram in a new tab)</span>
          </a>
          <p className="mt-2 text-sm text-muted">
            Use a nickname if you like. Other members can't see your phone number.
          </p>
        </>
      ) : (
        <button
          type="button"
          aria-pressed={joined}
          aria-label={`Join ${CIRCLE}`}
          onClick={() => toggleGroup(CIRCLE)}
          className={cx(
            'mt-3 min-h-11 w-full rounded-xl px-4 font-bold',
            joined ? 'border border-teal bg-teal-soft text-teal' : 'bg-teal text-white',
          )}
        >
          {joined ? 'Joined ✓' : 'Join'}
        </button>
      )}
    </Card>
  )
}

export function BuddyMain() {
  const { chat, chipsLeft, typing, sendQuickReply, sendText } = useApp()
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [chat.length, typing])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    sendText(text)
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="Someone who's been there" />

      <Card className="flex items-center gap-3">
        <Avatar />
        <div>
          <p className="font-bold">Wei Jie · Recovery buddy</p>
          <p className="text-sm text-muted">ACL reconstruction 2 yrs ago · ex-footballer · back to futsal</p>
        </div>
      </Card>

      <section aria-label="Chat with Wei Jie" className="flex flex-col gap-2.5">
        <ol className="flex flex-col gap-2.5" aria-live="polite">
          {chat.map((m, i) => (
            <li key={i} className={cx('flex items-end gap-2', m.from === 'me' && 'justify-end')}>
              {m.from === 'wj' && <Avatar size="h-8 w-8 text-xs" />}
              <p
                className={cx(
                  'max-w-[80%] rounded-2xl px-3.5 py-2.5',
                  m.from === 'wj' ? 'rounded-bl-md border border-line bg-white' : 'rounded-br-md bg-teal text-white',
                )}
              >
                <span className="sr-only">{m.from === 'wj' ? 'Wei Jie: ' : 'You: '}</span>
                {m.text}
              </p>
            </li>
          ))}
        </ol>
        {typing && (
          <div className="flex items-end gap-2" role="status">
            <Avatar size="h-8 w-8 text-xs" />
            <p className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-3">
              <span className="sr-only">Wei Jie is typing…</span>
              <span className="typing-dot h-2 w-2 rounded-full bg-muted" aria-hidden="true" />
              <span className="typing-dot h-2 w-2 rounded-full bg-muted" aria-hidden="true" />
              <span className="typing-dot h-2 w-2 rounded-full bg-muted" aria-hidden="true" />
            </p>
          </div>
        )}
        <div ref={endRef} />
      </section>

      {chipsLeft.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Quick replies" role="group">
          {chipsLeft.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendQuickReply(i)}
              className="min-h-11 rounded-full border border-teal bg-white px-4 text-sm font-bold text-teal"
            >
              {QUICK_REPLIES[i].text}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Message Wei Jie"
          placeholder="Message Wei Jie…"
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-white px-4 placeholder:text-muted"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal text-white disabled:opacity-60"
          disabled={!draft.trim()}
        >
          <Send className="h-5 w-5" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}

export function BuddyMobileExtras() {
  return <CircleCard />
}

export function BuddySide() {
  const { joinedGroups, toggleGroup } = useApp()
  return (
    <div className="flex flex-col gap-4">
      <CircleCard />
      <Card>
        <SectionTitle>More peer groups</SectionTitle>
        <ul className="mt-3 flex flex-col divide-y divide-line">
          {PEER_GROUPS.map((g) => {
            const joined = joinedGroups.includes(g.name)
            return (
              <li key={g.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex-1">
                  <p className="font-bold">{g.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-muted">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    {g.members} members · {g.meets}
                  </p>
                </div>
                <button
                  type="button"
                  aria-pressed={joined}
                  aria-label={`Join ${g.name}`}
                  onClick={() => toggleGroup(g.name)}
                  className={cx(
                    'min-h-11 rounded-lg px-3.5 text-sm font-bold',
                    joined ? 'border border-teal bg-teal-soft text-teal' : 'border border-line bg-white text-ink',
                  )}
                >
                  {joined ? 'Joined ✓' : 'Join'}
                </button>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
