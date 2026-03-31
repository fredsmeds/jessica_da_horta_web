import { requireAuth } from '../../../../_shared/adminAuth.js'

// GET /api/admin/blog/posts/:id
// PUT /api/admin/blog/posts/:id
// DELETE /api/admin/blog/posts/:id
export async function onRequest(context) {
  const { request, env, params } = context
  const id = params.id

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'GET') {
    const post = await env.DB.prepare(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).bind(id).first()

    if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
    return new Response(JSON.stringify(post), { headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'PUT') {
    const data = await request.json()
    const { title, body, excerpt, cover_image, category_id, status,
            title_en = '', title_es = '', excerpt_en = '', excerpt_es = '', body_en = '', body_es = '' } = data

    const current = await env.DB.prepare('SELECT status, published_at FROM posts WHERE id = ?').bind(id).first()
    if (!current) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })

    const published_at = status === 'published' && current.status !== 'published'
      ? new Date().toISOString()
      : current.published_at

    await env.DB.prepare(`
      UPDATE posts SET title=?, body=?, excerpt=?, cover_image=?, category_id=?, status=?, published_at=?, updated_at=datetime('now'),
                       title_en=?, title_es=?, excerpt_en=?, excerpt_es=?, body_en=?, body_es=?
      WHERE id=?
    `).bind(title, body, excerpt || '', cover_image || '', category_id || null, status || 'draft', published_at,
            title_en, title_es, excerpt_en, excerpt_es, body_en, body_es, id).run()

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'DELETE') {
    await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
