import { requireAuth } from '../../_shared/adminAuth.js'

export async function onRequestGet(context) {
  const { request, env } = context

  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!env.LEADS_KV) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const listed = await env.LEADS_KV.list({ prefix: 'lead:' })
    const keys = listed.keys || []

    const leads = await Promise.all(
      keys.map(async (k) => {
        const raw = await env.LEADS_KV.get(k.name)
        if (!raw) return null
        try {
          const data = JSON.parse(raw)
          return { _key: k.name, ...data }
        } catch {
          return { _key: k.name, raw }
        }
      })
    )

    const validLeads = leads.filter(Boolean)

    validLeads.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0
      const db = b.date ? new Date(b.date).getTime() : 0
      return db - da
    })

    return new Response(JSON.stringify(validLeads), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Leads GET error:', err)
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
