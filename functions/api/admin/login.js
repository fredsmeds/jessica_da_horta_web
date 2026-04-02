async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const EMAIL_TO_USER = {
  'jessicadhg.pais.agem@gmail.com': 'jessica',
  'fmroldanrivero@gmail.com': 'freddy',
  'internercia@gmail.com': 'internercia',
}

export async function onRequestPost(context) {
  const { env } = context

  if (!env.LEADS_KV || !env.ADMIN_SESSION_SECRET) {
    return new Response(JSON.stringify({ error: 'server_misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { email, password } = await context.request.json()
  const userId = EMAIL_TO_USER[email?.toLowerCase()?.trim()]

  if (!userId) {
    return new Response(JSON.stringify({ error: 'invalid_credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const storedHash = await env.LEADS_KV.get(`admin:password_hash:${userId}`)
  if (!storedHash) {
    return new Response(JSON.stringify({ error: 'password_not_set' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const inputHash = await sha256(password)
  if (inputHash !== storedHash) {
    return new Response(JSON.stringify({ error: 'invalid_credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ token: env.ADMIN_SESSION_SECRET }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
