const VALID_USER = 'ah_selkie'
const VALID_PASS = 'Dracaris'
const SESSION_TOKEN = 'jdh_admin_s3lk1e_2026'

export async function onRequestPost(context) {
  const { username, password } = await context.request.json()
  if (username === VALID_USER && password === VALID_PASS) {
    return new Response(JSON.stringify({ token: SESSION_TOKEN }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
