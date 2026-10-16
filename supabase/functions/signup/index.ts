// Username + password sign-up for ComeBack.
// Creates a pre-confirmed Supabase Auth user behind a synthetic, non-deliverable email,
// so no real email is collected or ever sent. Deployed with verify_jwt = false (public endpoint).
import { createClient } from 'npm:@supabase/supabase-js@2.45.4'

const EMAIL_DOMAIN = 'users.comeback.invalid'
const USERNAME_RE = /^[a-z0-9_]{3,20}$/
const MAX_ATTEMPTS_PER_HOUR = 10
const ALLOWED_ORIGINS = new Set([
  'https://comeback-prototype.vercel.app',
  'https://comeback-beta.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
])

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://comeback-prototype.vercel.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    Vary: 'Origin',
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const headers = { ...corsHeaders(origin), 'Content-Type': 'application/json' }
  const reply = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), { status, headers })

  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return reply(405, { error: 'Method not allowed' })
  if (origin && !ALLOWED_ORIGINS.has(origin)) return reply(403, { error: 'Origin not allowed' })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return reply(400, { error: 'Invalid request' })
  }
  const { username, password } = (body ?? {}) as { username?: unknown; password?: unknown }
  if (typeof username !== 'string' || typeof password !== 'string') return reply(400, { error: 'Invalid request' })

  const name = username.trim().toLowerCase()
  if (!USERNAME_RE.test(name)) {
    return reply(400, { error: 'Username must be 3–20 characters: letters, numbers or underscores.' })
  }
  if (password.length < 8 || password.length > 72) {
    return reply(400, { error: 'Password must be 8–72 characters.' })
  }

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Simple per-IP rate limit
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count, error: countError } = await admin
    .from('signup_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', since)
  if (countError) return reply(500, { error: 'Something went wrong. Please try again.' })
  if ((count ?? 0) >= MAX_ATTEMPTS_PER_HOUR) {
    return reply(429, { error: 'Too many sign-up attempts. Please try again later.' })
  }
  await admin.from('signup_attempts').insert({ ip })

  const { data: available } = await admin.rpc('username_available', { name })
  if (available === false) return reply(409, { error: 'That username is taken.' })

  const { error } = await admin.auth.admin.createUser({
    email: `${name}@${EMAIL_DOMAIN}`,
    password,
    email_confirm: true,
    user_metadata: { username: name },
  })
  if (error) {
    const taken = /already|exists|registered/i.test(error.message)
    return reply(taken ? 409 : 400, { error: taken ? 'That username is taken.' : 'Could not create account.' })
  }
  return reply(201, { ok: true })
})
