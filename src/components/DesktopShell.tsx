import { CircleUser, Info, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TABS } from '../data'
import { useApp } from '../state'
import { useAuth } from '../auth'
import { Logo, StreakPill } from './brand'
import { MobileShell } from './MobileShell'
import { DesktopPrimary, DesktopSide, TAB_ICONS } from './nav'
import { cx } from './ui'

const FRAME_W = 390
const FRAME_H = 844

/** 390×844 phone frame, scaled down to fit shorter laptop screens. */
function PhoneFrame() {
  const fit = () => Math.min(1, Math.max(0.5, (window.innerHeight - 64 - 64) / FRAME_H))
  const [scale, setScale] = useState(fit)
  useEffect(() => {
    const onResize = () => setScale(fit())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return (
    <div className="flex justify-center" style={{ height: FRAME_H * scale }}>
      <div
        className="shrink-0 origin-top overflow-hidden rounded-[48px] border-[12px] border-ink bg-bg shadow-[0_24px_60px_-20px_rgb(15_31_26/0.45)]"
        style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        aria-label="Phone preview"
        role="region"
      >
        <MobileShell framed />
      </div>
    </div>
  )
}

export function DesktopShell() {
  const { tab, setTab, phoneView, setPhoneView, setAboutOpen } = useApp()
  const { username } = useAuth()
  const current = TABS.find((t) => t.id === tab)!
  return (
    <div className="flex min-h-dvh">
      <aside className="on-dark sticky top-0 flex h-dvh w-64 shrink-0 flex-col bg-ink px-4 py-6 text-white">
        <div className="px-3">
          <Logo className="text-[28px]" />
          <p className="mt-1 text-sm text-white/75">Recovery companion for student athletes</p>
        </div>

        <nav aria-label="Main" className="mt-8">
          <ul className="flex flex-col gap-1">
            {TABS.map((t) => {
              const Icon = TAB_ICONS[t.id]
              const active = tab === t.id
              return (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setTab(t.id)
                    }}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 font-bold',
                      active ? 'bg-white/12 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {active && (
                      <span className="absolute top-2 bottom-2 left-0 w-1 rounded-full bg-bright" aria-hidden="true" />
                    )}
                    <Icon className={cx('h-5 w-5', active && 'text-bright')} aria-hidden="true" />
                    {t.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-6 px-3">
          <StreakPill />
        </div>

        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          className="mt-auto flex min-h-11 items-center gap-2.5 rounded-xl border border-white/15 px-3 py-2 text-left hover:bg-white/5"
        >
          <CircleUser className="h-5 w-5 shrink-0 text-bright" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{username ?? 'Guest'}</span>
            <span className="block text-xs text-white/75">{username ? 'Account settings' : 'Create an account'}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          className="mt-2 flex min-h-11 items-center gap-2 rounded-lg px-3 text-left text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
          About this prototype
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-bg px-8">
          <p className="font-display text-xl font-extrabold">{current.title}</p>
          <button
            type="button"
            role="switch"
            aria-checked={phoneView}
            onClick={() => setPhoneView(!phoneView)}
            className="flex min-h-11 items-center gap-3 rounded-full border border-line bg-white py-1.5 pr-1.5 pl-3.5 text-sm font-bold"
          >
            <Smartphone className="h-4 w-4 text-teal" aria-hidden="true" />
            View as phone
            <span
              className={cx('flex h-6 w-11 items-center rounded-full p-0.5 transition-colors', phoneView ? 'bg-teal' : 'bg-empty')}
              aria-hidden="true"
            >
              <span
                className={cx('h-5 w-5 rounded-full bg-white shadow transition-transform', phoneView && 'translate-x-5')}
              />
            </span>
          </button>
        </header>

        <main className="flex-1 px-8 py-8">
          {phoneView ? (
            <PhoneFrame />
          ) : (
            <div className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)_minmax(0,380px)] items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
              <div>
                <DesktopPrimary tab={tab} />
              </div>
              <aside aria-label="Details">
                <DesktopSide tab={tab} />
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
