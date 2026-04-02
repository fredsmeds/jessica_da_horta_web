import { requireAuth } from '../../../../_shared/adminAuth.js'

// PUT    /api/admin/calendar/appointments/:id
// DELETE /api/admin/calendar/appointments/:id
export async function onRequest(context) {
  const { request, env, params } = context
  const id = params.id

  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'PUT') {
    const { title, date, time, notes } = await request.json()
    await env.DB.prepare(
      `UPDATE appointments SET title=?, date=?, time=?, notes=?, updated_at=datetime('now') WHERE id=?`
    ).bind(title, date, time || '', notes || '', id).run()
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'DELETE') {
    await env.DB.prepare('DELETE FROM appointments WHERE id=?').bind(id).run()
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
