export type TabId = 'check' | 'learn' | 'rehab' | 'buddy' | 'progress'

export const TABS: { id: TabId; label: string; title: string }[] = [
  { id: 'check', label: 'Check', title: 'Knee Check' },
  { id: 'learn', label: 'Learn', title: 'ACL 101' },
  { id: 'rehab', label: 'Rehab', title: "Today's Rehab" },
  { id: 'buddy', label: 'Buddy', title: 'Recovery Buddy' },
  { id: 'progress', label: 'Progress', title: 'Your Progress' },
]

export const CHECK_ITEMS = [
  'Felt or heard a "pop" when it happened',
  'Knee swelled up within a few hours',
  'Knee feels loose or gives way',
  'Same knee keeps "spraining" again',
  'Still trouble walking after 3 days',
]

export type ChatMsg = { from: 'wj' | 'me'; text: string }

/** Wei Jie's opening messages, matched to the user's current rehab phase. */
export const initialChat = (phaseName: string): ChatMsg[] => [
  { from: 'wj', text: `Hey! I'm Wei Jie, your recovery buddy. Saw you're in the ${phaseName.toLowerCase()} phase. I remember that stretch well.` },
  { from: 'wj', text: "Want to do today's session together on call tonight? It's easier when someone's expecting you." },
]

export const QUICK_REPLIES = [
  { text: 'Deal, 9pm?', reply: "Deal. 9pm. I'll send the link." },
  {
    text: 'How did you stay motivated?',
    reply: 'Honestly, I stopped doing it alone. Having someone expect me made the difference.',
  },
  {
    text: 'Was the fear normal?',
    reply: 'Super normal. I avoided puddles for months. It fades as the knee gets stronger.',
  },
]

export const CANNED_REPLIES = [
  "Totally get that. You're already doing better than you think.",
  'Small steps count. Even 12 minutes today is a win.',
  "I'm here if you want to talk it through. Ping me anytime.",
  "That's real. Keep showing up and the knee will thank you.",
]

export const PEER_GROUPS = [
  { name: 'Ankle & Foot Recovery', members: 14, meets: 'Check-in Tue 9pm' },
  { name: 'Back to Football', members: 22, meets: 'Kickabout Sun 5pm' },
  { name: 'Parents of Injured Athletes', members: 11, meets: 'Online chat Wed 8pm' },
]

export const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
export const WEEK_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const CONFIDENCE_NOTES = [
  'Fear is normal after a big injury. Tell your buddy or physio and keep today gentle.',
  'Still wary. Stick to familiar exercises and log how it feels after.',
  'Getting there. Your physio may add balance work soon.',
  'Feeling solid. Ask your physio about jogging drills.',
  'Strong day! Confidence is part of being ready to return to sport.',
]

/** Milestones unlock by programme week. */
export const MILESTONES = [
  { label: 'Diagnosed and plan agreed', week: 0, when: 'Wk 0' },
  { label: 'Walking without crutches', week: 3, when: 'Wk 3' },
  { label: 'Full range of motion', week: 8, when: 'Wk 8' },
  { label: 'Light jogging, physio cleared', week: 14, when: 'Wk 14' },
  { label: 'Back to training with the team', week: 39, when: 'Mth 9+' },
]

export const REMIND_SLOTS = [
  { label: 'After lecture', time: '16:00', display: '4pm' },
  { label: 'Before dinner', time: '19:00', display: '7pm' },
  { label: 'Late study break', time: '22:00', display: '10pm' },
]
