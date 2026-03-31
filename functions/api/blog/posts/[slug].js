// GET /api/blog/posts/:slug?lang=pt|en|es — full post with body
export async function onRequestGet(context) {
  const { request, env, params } = context
  const lang = new URL(request.url).searchParams.get('lang') || 'pt'

  const post = await env.DB.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.status = 'published'
  `).bind(params.slug).first()

  if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })

  // Localize fields with PT fallback
  const localized = lang !== 'pt' ? {
    ...post,
    title:   (post[`title_${lang}`]   || '').trim() || post.title,
    excerpt: (post[`excerpt_${lang}`] || '').trim() || post.excerpt,
    body:    (post[`body_${lang}`]    || '').trim() || post.body,
  } : post

  return new Response(JSON.stringify(localized), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
  })
}
