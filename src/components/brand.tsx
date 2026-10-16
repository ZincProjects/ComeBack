import { useApp } from '../state'

export function Logo({ className = 'text-xl' }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-tight text-white ${className}`}>
      Come<span className="text-bright">Back</span>
    </span>
  )
}

export function FlameIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c.5 3-2 4.5-3.5 6.5S7 13.5 7 15a5 5 0 0 0 10 0c0-2.5-1.5-4-2.5-5.5-.3 1.3-1 2-2 2.3C13 9 13 6 12 3Z" />
    </svg>
  )
}

export function StreakPill() {
  const { streak } = useApp()
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-bold text-white">
      <FlameIcon className="h-4 w-4 text-bright" />
      {streak > 0 ? `${streak}-day streak` : 'Start your streak'}
    </span>
  )
}
