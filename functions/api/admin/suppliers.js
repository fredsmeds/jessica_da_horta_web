import { requireAuth } from '../../_shared/adminAuth.js'

export async function onRequestGet(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!env.SUPPLIERS_KV) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const listed = await env.SUPPLIERS_KV.list({ prefix: 'supplier:' })
    const keys = listed.keys || []

    const suppliers = await Promise.all(
      keys.map(async (k) => {
        const raw = await env.SUPPLIERS_KV.get(k.name)
        if (!raw) return null
        try {
          return JSON.parse(raw)
        } catch {
          return null
        }
      })
    )

    const valid = suppliers.filter(Boolean)

    valid.sort((a, b) => {
      const na = (a.name || '').toLowerCase()
      const nb = (b.name || '').toLowerCase()
      return na.localeCompare(nb, 'pt')
    })

    return new Response(JSON.stringify(valid), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Suppliers GET error:', err)
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function onRequestPost(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!env.SUPPLIERS_KV) {
    return new Response(JSON.stringify({ error: 'KV not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    if (!body.name || !body.name.trim()) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const id = String(Date.now())
    const supplier = {
      id,
      name: body.name.trim(),
      category: body.category || 'Outro',
      contact: body.contact || '',
      phone: body.phone || '',
      email: body.email || '',
      website: body.website || '',
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
    }
    await env.SUPPLIERS_KV.put(`supplier:${id}`, JSON.stringify(supplier))
    return new Response(JSON.stringify({ ok: true, supplier }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Suppliers POST error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
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

  if (!env.SUPPLIERS_KV) {
    return new Response(JSON.stringify({ error: 'KV not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    if (!body.id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (!body.name || !body.name.trim()) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const existing = await env.SUPPLIERS_KV.get(`supplier:${body.id}`)
    const prev = existing ? JSON.parse(existing) : {}
    const supplier = {
      ...prev,
      id: body.id,
      name: body.name.trim(),
      category: body.category || 'Outro',
      contact: body.contact || '',
      phone: body.phone || '',
      email: body.email || '',
      website: body.website || '',
      notes: body.notes || '',
      updatedAt: new Date().toISOString(),
    }
    await env.SUPPLIERS_KV.put(`supplier:${body.id}`, JSON.stringify(supplier))
    return new Response(JSON.stringify({ ok: true, supplier }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Suppliers PUT error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context

  if (!requireAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!env.SUPPLIERS_KV) {
    return new Response(JSON.stringify({ error: 'KV not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    if (!body.id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    await env.SUPPLIERS_KV.delete(`supplier:${body.id}`)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Suppliers DELETE error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
