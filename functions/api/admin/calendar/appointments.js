import { requireAuth } from '../../../_shared/adminAuth.js'

// GET  /api/admin/calendar/appointments?month=YYYY-MM
// POST /api/admin/calendar/appointments
export async function onRequest(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'GET') {
    const url = new URL(request.url)
    const month = url.searchParams.get('month') // YYYY-MM
    let query = 'SELECT * FROM appointments'
    const binds = []
    if (month) {
      query += ' WHERE date LIKE ?'
      binds.push(`${month}%`)
    }
    query += ' ORDER BY date ASC, time ASC'
    const { results } = await env.DB.prepare(query).bind(...binds).all()
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'POST') {
    const { title, date, time, notes } = await request.json()
    if (!title || !date) {
      return new Response(JSON.stringify({ error: 'title and date required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    const result = await env.DB.prepare(
      `INSERT INTO appointments (title, date, time, notes) VALUES (?, ?, ?, ?)`
    ).bind(title, date, time || '', notes || '').run()
    return new Response(JSON.stringify({ id: result.meta.last_row_id }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
