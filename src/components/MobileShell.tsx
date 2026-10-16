import { CircleUser } from 'lucide-react'
import { TABS } from '../data'
import { useApp } from '../state'
import { Logo, StreakPill } from './brand'
import { TAB_ICONS, MobileScreen } from './nav'
import { cx } from './ui'

/** Native-app style layout. `framed` renders it inside the desktop "View as phone" frame. */
export function MobileShell({ framed = false }: { framed?: boolean }) {
  const { tab, setTab, setAboutOpen } = useApp()
  const Content = framed ? 'div' : 'main'
  return (
    <div className={cx('bg-bg', framed ? 'flex h-full flex-col' : 'min-h-dvh')}>
      <header
        className={cx('on-dark z-20 bg-ink', !framed && 'sticky top-0')}
        style={framed ? undefined : { paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex h-14 max-w-[640px] items-center justify-between gap-2 px-4">
          <Logo className="text-[22px]" />
          <div className="flex items-center gap-1">
            <StreakPill />
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              aria-label="Account and about this prototype"
              className="grid h-11 w-11 place-items-center rounded-full text-white/85 hover:text-white"
            >
              <CircleUser className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <Content className={cx(framed && 'min-h-0 flex-1 overflow-y-auto')}>
        <div
          className={cx(
            'mx-auto max-w-[640px] px-4 pt-5',
            framed ? 'pb-8' : 'pb-[calc(104px+env(safe-area-inset-bottom))]',
          )}
        >
          <MobileScreen tab={tab} />
        </div>
      </Content>

      <nav
        aria-label="Main"
        className={cx('z-20 border-t border-line bg-white', !framed && 'fixed inset-x-0 bottom-0')}
        style={{ paddingBottom: framed ? 8 : 'env(safe-area-inset-bottom)' }}
      >
        <ul className="mx-auto grid max-w-[640px] grid-cols-5">
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
                    'flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs',
                    active ? 'font-bold text-teal' : 'text-muted',
                  )}
                >
                  <span
                    className={cx('grid h-8 w-12 place-items-center rounded-full', active && 'bg-teal-soft')}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                  </span>
                  {t.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
