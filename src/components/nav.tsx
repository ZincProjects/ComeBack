import { BarChart3, BookOpen, ClipboardCheck, Dumbbell, MessageCircle, type LucideIcon } from 'lucide-react'
import type { TabId } from '../data'
import { CheckMain, CheckSide } from '../screens/Check'
import { LearnMain, LearnSide } from '../screens/Learn'
import { RehabMain, RehabSide } from '../screens/Rehab'
import { BuddyMain, BuddyMobileExtras, BuddySide } from '../screens/Buddy'
import { ProgressMain, ProgressSide } from '../screens/Progress'

export const TAB_ICONS: Record<TabId, LucideIcon> = {
  check: ClipboardCheck,
  learn: BookOpen,
  rehab: Dumbbell,
  buddy: MessageCircle,
  progress: BarChart3,
}

export function MobileScreen({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'check':
      return <CheckMain />
    case 'learn':
      return <LearnMain />
    case 'rehab':
      return <RehabMain />
    case 'buddy':
      return (
        <div className="flex flex-col gap-5">
          <BuddyMain />
          <BuddyMobileExtras />
        </div>
      )
    case 'progress':
      return <ProgressMain />
  }
}

export function DesktopPrimary({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'check':
      return <CheckMain />
    case 'learn':
      return <LearnMain desktop />
    case 'rehab':
      return <RehabMain desktop />
    case 'buddy':
      return <BuddyMain />
    case 'progress':
      return <ProgressMain desktop />
  }
}

export function DesktopSide({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'check':
      return <CheckSide />
    case 'learn':
      return <LearnSide />
    case 'rehab':
      return <RehabSide />
    case 'buddy':
      return <BuddySide />
    case 'progress':
      return <ProgressSide />
  }
}
