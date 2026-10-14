import type { ReactNode } from 'react'

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx('rounded-[14px] border border-line bg-card p-4', className)}>{children}</section>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold tracking-[0.08em] text-teal uppercase">{children}</p>
}

export function PageHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <header className="flex flex-col gap-1.5">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-[26px]">{title}</h1>
      {sub && <p className="text-muted">{sub}</p>}
    </header>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg">{children}</h2>
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-bg px-2.5 py-0.5 text-xs font-bold text-muted">
      {children}
    </span>
  )
}
