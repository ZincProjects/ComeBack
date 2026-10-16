import { useEffect } from 'react'
import { TABS } from './data'
import { AppProvider, useApp } from './state'
import { AuthProvider, useAuth } from './auth'
import { AboutDialog } from './components/AboutDialog'
import { AuthScreen } from './components/AuthScreen'
import { Logo } from './components/brand'
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

function Splash() {
  return (
    <div className="on-dark grid min-h-dvh place-items-center bg-ink" role="status">
      <Logo className="text-[32px]" />
      <span className="sr-only">Loading ComeBack…</span>
    </div>
  )
}

function Gate() {
  const { status, userId } = useAuth()
  useEffect(() => {
    if (status === 'auth') document.title = 'Welcome · ComeBack'
  }, [status])
  if (status === 'loading') return <Splash />
  if (status === 'auth') return <AuthScreen />
  return (
    <AppProvider key={userId ?? 'guest'}>
      <Shell />
    </AppProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
