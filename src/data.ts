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

export type Exercise = {
  name: string
  reps: string
  prop: string
  how: string
  mistake: string
}

export const EXERCISES: Exercise[] = [
  {
    name: 'Quad sets',
    reps: '3 × 10 · 5 s hold',
    prop: 'Towel',
    how: 'Sit with your leg straight and a rolled towel under the knee. Tighten the thigh muscle to press the back of the knee down into the towel. Hold for 5 seconds, then relax.',
    mistake: 'Lifting the heel or holding your breath instead of pressing the knee down.',
  },
  {
    name: 'Straight-leg raises',
    reps: '3 × 12',
    prop: 'Floor',
    how: 'Lie on your back with the other knee bent. Lock the working knee straight by tightening the thigh, then lift the leg to the height of the bent knee. Lower slowly.',
    mistake: 'Letting the knee bend as you lift, which takes the work off the quads.',
  },
  {
    name: 'Heel slides',
    reps: '2 × 15',
    prop: 'Floor',
    how: 'Lie on your back with legs straight. Slide the heel towards your bottom to bend the knee as far as is comfortable, pause, then slide it back out.',
    mistake: 'Rushing, or forcing past sharp pain. Go to a stretch, not to pain.',
  },
  {
    name: 'Wall sit',
    reps: '3 × 30 s',
    prop: 'Wall',
    how: 'Lean your back against a wall with feet shoulder-width apart, about a foot in front. Slide down until your knees bend to roughly 45 to 60 degrees, and hold.',
    mistake: 'Knees drifting inwards. Keep them in line with your second toe.',
  },
  {
    name: 'Step-ups',
    reps: '3 × 10 each leg',
    prop: 'Stairs',
    how: 'Stand facing a stair. Step up with the working leg, push through the whole foot to straighten up, then step down slowly with control.',
    mistake: 'Pushing off the bottom foot. Let the top leg do the work.',
  },
  {
    name: 'Calf raises',
    reps: '3 × 15',
    prop: 'Bottles',
    how: 'Hold a 1.5 L water bottle in each hand. Stand tall and rise onto the balls of your feet, pause at the top, then lower slowly over 2 to 3 seconds.',
    mistake: 'Bouncing at the bottom. Slow lowering builds the most strength.',
  },
]

export const BASE_STREAK = 9

export type ChatMsg = { from: 'wj' | 'me'; text: string }

export const INITIAL_CHAT: ChatMsg[] = [
  { from: 'wj', text: 'Hey! Saw you just started phase 2. That was the toughest stretch for me too.' },
  { from: 'me', text: 'Ya, skipped physio twice this week. Hard to stay motivated.' },
  { from: 'wj', text: 'Same thing happened to me. Want to do the 12-min session together on call tonight?' },
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
export const WEEK_VALUES = [1, 1, 0, 1, 1, 0.6]

export const CONFIDENCE_NOTES = [
  'Fear is normal after a big injury. Tell your buddy or physio and keep today gentle.',
  'Still wary. Stick to familiar exercises and log how it feels after.',
  'Getting there. Your physio may add balance work soon.',
  'Feeling solid. Ask your physio about jogging drills.',
  'Strong day! Confidence is part of being ready to return to sport.',
]

export const CONFIDENCE_TREND = [
  { label: 'Wk 4', value: 2 },
  { label: 'Wk 5', value: 2.5 },
  { label: 'Wk 6', value: 3 },
]

export const MILESTONES = [
  { label: 'Diagnosed and plan agreed', when: 'Wk 0', done: true },
  { label: 'Walking without crutches', when: 'Wk 3', done: true },
  { label: 'Full range of motion', when: 'Wk 8', done: false },
  { label: 'Light jogging, physio cleared', when: 'Wk 14', done: false },
  { label: 'Back to training with the team', when: 'Mth 9+', done: false },
]

export const REMIND_SLOTS = [
  { label: 'After lecture', time: '16:00', display: '4pm' },
  { label: 'Before dinner', time: '19:00', display: '7pm' },
  { label: 'Late study break', time: '22:00', display: '10pm' },
]

/**
 * Telegram invite link for the ACL Comeback Circle, e.g. 'https://t.me/+AbCdEf123'.
 * Leave empty to keep the in-app demo Join toggle.
 */
export const TELEGRAM_CIRCLE_URL = ''
