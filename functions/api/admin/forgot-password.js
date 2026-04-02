const EMAIL_TO_USER = {
  'jessicadhg.pais.agem@gmail.com': { id: 'jessica',     name: 'Jessica' },
  'fmroldanrivero@gmail.com':       { id: 'freddy',      name: 'Freddy' },
  'internercia@gmail.com':          { id: 'internercia', name: 'Internercia' },
}

export async function onRequestPost(context) {
  const { env } = context

  if (!env.LEADS_KV || !env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500 })
  }

  const { email } = await context.request.json()
  const user = EMAIL_TO_USER[email?.toLowerCase()?.trim()]

  // Always return ok to avoid email enumeration
  if (!user) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  const tokenBytes = crypto.getRandomValues(new Uint8Array(32))
  const token = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('')

  await env.LEADS_KV.put(`admin:setup_token:${user.id}`, token, { expirationTtl: 3600 })

  const setupLink = `https://jessicadahorta.com/admin?setup=${token}&user=${user.id}`

  const htmlBody = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a18;">
      <div style="background:#555b37;padding:20px 28px;margin-bottom:28px;">
        <h1 style="color:white;font-size:16px;font-weight:400;margin:0;letter-spacing:0.05em;">Jessica da Horta Garden Design</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:11px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase;">Recuperação de Palavra-passe</p>
      </div>
      <div style="padding:0 28px 28px;">
        <p style="font-size:15px;">Olá ${user.name},</p>
        <p style="font-size:14px;line-height:1.7;color:#5a5a52;">
          Foi solicitada a recuperação da palavra-passe do painel administrativo.<br>
          Clique no botão abaixo para definir uma nova palavra-passe. O link expira em <strong>1 hora</strong>.
        </p>
        <div style="margin:28px 0;">
          <a href="${setupLink}" style="background:#555b37;color:#fff;text-decoration:none;padding:12px 24px;font-size:13px;letter-spacing:0.08em;display:inline-block;">
            Redefinir Palavra-passe
          </a>
        </div>
        <p style="font-size:12px;color:#aaa;">Se não solicitou este pedido, ignore este email.</p>
        <p style="font-size:12px;color:#ccc;margin-top:6px;word-break:break-all;">Link direto: ${setupLink}</p>
      </div>
    </div>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Jessica da Horta Garden Design <noreply@jessicadahorta.com>',
      to: [email],
      subject: 'Recuperar palavra-passe — Painel Administrativo',
      html: htmlBody,
    }),
  })

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
