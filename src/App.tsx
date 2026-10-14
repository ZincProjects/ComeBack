import { useEffect } from 'react'
import { TABS } from './data'
import { AppProvider, useApp } from './state'
import { AboutDialog } from './components/AboutDialog'
import { DesktopShell } from './components/DesktopShell'
import { MobileShell } from './components/MobileShell'

function Toast() {
  const { toast } = useApp()
  return (
    <div role="status" aria-live="polite" className="pointer-events-none">
      {toast && (
        <p className="toast on-dark fixed bottom-[calc(88px+env(safe-area-inset-bottom))] left-1/2 z-50 w-max max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-full bg-ink px-5 py-3 font-bold text-white shadow-lg lg:bottom-8">
          <span className="text-bright">Nice work!</span> {toast}
        </p>
      )}
    </div>
  )
}

function Shell() {
  const { tab } = useApp()
  useEffect(() => {
    const t = TABS.find((x) => x.id === tab)
    document.title = `${t?.title ?? 'Home'} · ComeBack`
  }, [tab])
  return (
    <>
      {/* Phone + tablet (< 1024px) */}
      <div className="lg:hidden">
        <MobileShell />
      </div>
      {/* PC dashboard (>= 1024px) */}
      <div className="hidden lg:block">
        <DesktopShell />
      </div>
      <Toast />
      <AboutDialog />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
