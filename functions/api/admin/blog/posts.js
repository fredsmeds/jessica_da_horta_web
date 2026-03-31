import { requireAuth } from '../../../_shared/adminAuth.js'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/admin/blog/posts — list all posts
// POST /api/admin/blog/posts — create post
export async function onRequest(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(`
      SELECT p.id, p.slug, p.title, p.excerpt, p.cover_image, p.status, p.published_at, p.created_at, p.updated_at,
             c.name AS category_name, c.slug AS category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.updated_at DESC
    `).all()
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } })
  }

  if (request.method === 'POST') {
    const data = await request.json()
    const { title, body, excerpt, cover_image, category_id, status,
            title_en = '', title_es = '', excerpt_en = '', excerpt_es = '', body_en = '', body_es = '' } = data

    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'title and body required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    let slug = slugify(title)
    const existing = await env.DB.prepare('SELECT id FROM posts WHERE slug = ?').bind(slug).first()
    if (existing) slug = `${slug}-${Date.now()}`

    const published_at = status === 'published' ? new Date().toISOString() : null

    const result = await env.DB.prepare(`
      INSERT INTO posts (slug, title, body, excerpt, cover_image, category_id, status, published_at,
                         title_en, title_es, excerpt_en, excerpt_es, body_en, body_es)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(slug, title, body, excerpt || '', cover_image || '', category_id || null, status || 'draft', published_at,
            title_en, title_es, excerpt_en, excerpt_es, body_en, body_es).run()

    return new Response(JSON.stringify({ id: result.meta.last_row_id, slug }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
