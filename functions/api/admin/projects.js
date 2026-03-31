import { requireAuth } from '../../_shared/adminAuth.js'

// GET  /api/admin/projects
// POST /api/admin/projects
export async function onRequest(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      `SELECT p.*, COUNT(t.id) as task_count
       FROM projects p LEFT JOIN tasks t ON t.project_id = p.id
       GROUP BY p.id ORDER BY p.created_at DESC`
    ).all()
    return Response.json(results)
  }

  if (request.method === 'POST') {
    const { title, description = '' } = await request.json()
    if (!title?.trim()) return Response.json({ error: 'Title required' }, { status: 400 })
    const { meta } = await env.DB.prepare(
      `INSERT INTO projects (title, description) VALUES (?, ?)`
    ).bind(title.trim(), description).run()
    return Response.json({ id: meta.last_row_id })
  }

  return new Response('Method not allowed', { status: 405 })
}
