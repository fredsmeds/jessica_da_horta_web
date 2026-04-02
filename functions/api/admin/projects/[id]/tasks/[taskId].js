import { requireAuth } from '../../../../../_shared/adminAuth.js'

// PUT    /api/admin/projects/:id/tasks/:taskId
// DELETE /api/admin/projects/:id/tasks/:taskId
export async function onRequest(context) {
  const { request, env, params } = context

  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  const taskId = Number(params.taskId)

  if (request.method === 'PUT') {
    const { title, notes = '', status = 'todo', priority = 'medium' } = await request.json()
    if (!title?.trim()) return Response.json({ error: 'Title required' }, { status: 400 })
    await env.DB.prepare(
      `UPDATE tasks SET title = ?, notes = ?, status = ?, priority = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(title.trim(), notes, status, priority, taskId).run()
    return Response.json({ ok: true })
  }

  if (request.method === 'DELETE') {
    await env.DB.prepare(`DELETE FROM tasks WHERE id = ?`).bind(taskId).run()
    return Response.json({ ok: true })
  }

  return new Response('Method not allowed', { status: 405 })
}
