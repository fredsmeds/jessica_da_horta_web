// GET /api/blog/posts?category=slug&limit=20&offset=0
// Public endpoint — only published posts
export async function onRequestGet(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)
  const offset = parseInt(url.searchParams.get('offset') || '0')

  let query = `
    SELECT p.id, p.slug, p.title, p.excerpt, p.cover_image, p.published_at,
           c.name AS category_name, c.slug AS category_slug
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published'
  `
  const binds = []
  if (category) {
    query += ' AND c.slug = ?'
    binds.push(category)
  }
  query += ' ORDER BY p.published_at DESC LIMIT ? OFFSET ?'
  binds.push(limit, offset)

  const { results } = await env.DB.prepare(query).bind(...binds).all()
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
  })
}
