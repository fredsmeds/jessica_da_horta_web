import { requireAuth } from '../../../../_shared/adminAuth.js'

// GET  /api/admin/projects/:id/tasks
// POST /api/admin/projects/:id/tasks
export async function onRequest(context) {
  const { request, env, params } = context

  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  const projectId = Number(params.id)

  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      `SELECT * FROM tasks WHERE project_id = ? ORDER BY position ASC, created_at ASC`
    ).bind(projectId).all()
    return Response.json(results)
  }

  if (request.method === 'POST') {
    const { title, notes = '', status = 'todo', priority = 'medium' } = await request.json()
    if (!title?.trim()) return Response.json({ error: 'Title required' }, { status: 400 })
    const { meta } = await env.DB.prepare(
      `INSERT INTO tasks (project_id, title, notes, status, priority) VALUES (?, ?, ?, ?, ?)`
    ).bind(projectId, title.trim(), notes, status, priority).run()
    return Response.json({ id: meta.last_row_id })
  }

  return new Response('Method not allowed', { status: 405 })
}
