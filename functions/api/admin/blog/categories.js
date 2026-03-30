import { requireAuth } from '../../../_shared/adminAuth.js'

export async function onRequest(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY name ASC').all()
  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } })
}
