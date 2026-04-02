/**
 * Bot protection for public forms (Contact, Schedule Visit):
 * 1. Honeypot  — hidden _hp field must be empty
 * 2. Timestamp — form must be open ≥ 3 seconds before submit
 * 3. Rate limit — max 8 submissions per IP per hour via KV
 */

export function honeypotCheck(body) {
  if (body._hp) return true                          // bot filled the hidden field
  if (!body._ts) return true                         // missing timestamp
  const elapsed = Date.now() - parseInt(body._ts, 10)
  if (isNaN(elapsed) || elapsed < 3000) return true  // submitted too fast
  return false
}

export async function isRateLimited(kv, ip, endpoint, maxPerHour = 8) {
  if (!kv || !ip) return false
  const window = Math.floor(Date.now() / 3600000)
  const key = `ratelimit:${endpoint}:${ip}:${window}`
  const count = parseInt((await kv.get(key)) || '0', 10)
  if (count >= maxPerHour) return true
  await kv.put(key, String(count + 1), { expirationTtl: 7200 })
  return false
}

export function getIP(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

// Silent 200 — don't reveal detection to bots
export const BOT_RESPONSE = new Response(JSON.stringify({ ok: true }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
})
