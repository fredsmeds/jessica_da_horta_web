export async function onRequestGet(context) {
  const { env } = context
  const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY name ASC').all()
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' }
  })
}
