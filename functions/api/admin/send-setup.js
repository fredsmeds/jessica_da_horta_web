export async function onRequestPost(context) {
  const { env, request } = context

  if (!env.LEADS_KV || !env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500 })
  }

  // Generate a cryptographically random token
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32))
  const token = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('')

  // Store with 24h expiry
  await env.LEADS_KV.put('admin:setup_token', token, { expirationTtl: 86400 })

  const origin = new URL(request.url).origin
  const setupLink = `${origin}/admin?setup=${token}`

  const html = (name) => `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a18;">
      <div style="background:#555b37;padding:20px 28px;margin-bottom:28px;">
        <h1 style="color:white;font-size:16px;font-weight:400;margin:0;letter-spacing:0.05em;">Jessica da Horta Garden Design</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:11px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase;">Configuração de Acesso ao Painel Administrativo</p>
      </div>
      <div style="padding:0 28px 28px;">
        <p style="font-size:15px;">Olá ${name},</p>
        <p style="font-size:14px;line-height:1.7;color:#5a5a52;">
          Foi solicitada a configuração de uma nova palavra-passe para o painel administrativo.<br>
          Clique no botão abaixo para definir a sua palavra-passe. O link expira em <strong>24 horas</strong>.
        </p>
        <div style="margin:28px 0;">
          <a href="${setupLink}" style="background:#555b37;color:#fff;text-decoration:none;padding:12px 24px;font-size:13px;letter-spacing:0.08em;display:inline-block;">
            Definir Palavra-passe
          </a>
        </div>
        <p style="font-size:12px;color:#aaa;">Se não solicitou este acesso, ignore este email.</p>
        <p style="font-size:12px;color:#ccc;margin-top:6px;word-break:break-all;">Link direto: ${setupLink}</p>
      </div>
    </div>`

  const recipients = [
    { email: 'jessicadhg.pais.agem@gmail.com', name: 'Jessica' },
    { email: 'fmroldanrivero@gmail.com', name: 'Frederic (Webmaster)' },
  ]

  for (const r of recipients) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Jessica da Horta Garden Design <noreply@jessicadahorta.com>',
        to: [r.email],
        subject: 'Configurar palavra-passe — Painel Administrativo',
        html: html(r.name),
      }),
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
