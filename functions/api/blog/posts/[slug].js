// GET /api/blog/posts/:slug — full post with body
export async function onRequestGet(context) {
  const { env, params } = context
  const post = await env.DB.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.status = 'published'
  `).bind(params.slug).first()

  if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  return new Response(JSON.stringify(post), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
  })
}
