const VALID_USERS = ['jessica', 'freddy']

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function onRequestPost(context) {
  const { env } = context
  const { token, password, user } = await context.request.json()

  if (!env.LEADS_KV || !env.ADMIN_SESSION_SECRET) {
    return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500 })
  }

  if (!VALID_USERS.includes(user)) {
    return new Response(JSON.stringify({ error: 'invalid_user' }), { status: 400 })
  }

  if (!password || password.length < 8) {
    return new Response(JSON.stringify({ error: 'password_too_short' }), { status: 400 })
  }

  const storedToken = await env.LEADS_KV.get(`admin:setup_token:${user}`)
  if (!storedToken || storedToken !== token) {
    return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 400 })
  }

  const hash = await sha256(password)
  await env.LEADS_KV.put(`admin:password_hash:${user}`, hash)
  await env.LEADS_KV.delete(`admin:setup_token:${user}`)

  return new Response(JSON.stringify({ token: env.ADMIN_SESSION_SECRET, ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
