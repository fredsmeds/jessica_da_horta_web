import { requireAuth } from '../../_shared/adminAuth.js'

export async function onRequestGet(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!env.PRICES_KV) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const raw = await env.PRICES_KV.get('prices:all')
    if (!raw) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(raw, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Prices GET error:', err)
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function onRequestPut(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!env.PRICES_KV) {
    return new Response(JSON.stringify({ error: 'KV not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const prices = await request.json()
    if (!Array.isArray(prices)) {
      return new Response(JSON.stringify({ error: 'Invalid data: expected array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    await env.PRICES_KV.put('prices:all', JSON.stringify(prices))
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Prices PUT error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
