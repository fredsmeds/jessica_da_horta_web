import { requireAuth } from '../../../_shared/adminAuth.js'

// GET    /api/admin/projects/:id
// PUT    /api/admin/projects/:id
// DELETE /api/admin/projects/:id
export async function onRequest(context) {
  const { request, env, params } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  const id = Number(params.id)

  if (request.method === 'GET') {
    const project = await env.DB.prepare(`SELECT * FROM projects WHERE id = ?`).bind(id).first()
    if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(project)
  }

  if (request.method === 'PUT') {
    const { title, description = '' } = await request.json()
    if (!title?.trim()) return Response.json({ error: 'Title required' }, { status: 400 })
    await env.DB.prepare(
      `UPDATE projects SET title = ?, description = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(title.trim(), description, id).run()
    return Response.json({ ok: true })
  }

  if (request.method === 'DELETE') {
    await env.DB.prepare(`DELETE FROM projects WHERE id = ?`).bind(id).run()
    return Response.json({ ok: true })
  }

  return new Response('Method not allowed', { status: 405 })
}
