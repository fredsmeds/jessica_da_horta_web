/**
 * POST /api/contact
 * Sends a contact form email via Resend API
 */
export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()
    const { name, email, phone, zip, message, experience, subject } = body

    const RESEND_API_KEY = env.RESEND_API_KEY
    const JESSICA_EMAIL = env.JESSICA_EMAIL || 'contact@jessicadahorta.com'

    const subjectLabels = {
      general: 'Consulta Geral',
      prices: 'Preços e Orçamentos',
      jobs: 'Candidatura Freelance',
    }

    const subjectLine = `[Website] ${subjectLabels[subject] || 'Contacto'} — ${name}`

    const row = (label, value) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e5da;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#888;width:120px;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e5da;font-size:15px;">${value || '—'}</td>
      </tr>`

    const jobsRows = subject === 'jobs' && experience
      ? `<tr><td colspan="2" style="padding:20px 0 8px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;color:#555b37;">Percurso / Experiência</td></tr>
         <tr><td colspan="2" style="padding:0 0 16px;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#5a5a52;">${experience}</td></tr>`
      : ''

    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a18;">
        <div style="background: #555b37; padding: 24px 32px; margin-bottom: 32px;">
          <h1 style="color: white; font-size: 18px; font-weight: 400; margin: 0; letter-spacing: 0.05em;">
            Jessica da Horta Garden Design
          </h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 4px 0 0; letter-spacing: 0.1em; text-transform: uppercase;">
            ${subjectLabels[subject] || 'Contacto'}
          </p>
        </div>

        <div style="padding: 0 32px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            ${row('Nome', name)}
            ${row('Email', email)}
            ${row('Telefone', phone)}
            ${subject !== 'jobs' ? row('Cód. Postal', zip) : ''}
            ${jobsRows}
            ${subject !== 'jobs' ? `<tr><td colspan="2" style="padding:20px 0 8px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;color:#555b37;">Mensagem</td></tr>
            <tr><td colspan="2" style="padding:0 0 16px;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#5a5a52;">${message || '—'}</td></tr>` : ''}
          </table>
        </div>
      </div>
    `

    // Send to Jessica
    const toJessicaRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jessica da Horta Garden Design <noreply@jessicadahorta.com>',
        to: [JESSICA_EMAIL],
        subject: subjectLine,
        html: htmlBody,
        reply_to: email,
      }),
    })

    if (!toJessicaRes.ok) {
      const err = await toJessicaRes.text()
      console.error('Resend error (to jessica):', err)
      return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 500 })
    }

    // ── Write lead to KV ─────────────────────────────────────────────────────
    if (context.env.LEADS_KV) {
      const leadKey = `lead:${Date.now()}:${subject}`
      const leadData = {
        type: subject,
        date: new Date().toISOString(),
        name, email, phone,
        message: subject === 'jobs' ? experience : message,
      }
      await context.env.LEADS_KV.put(leadKey, JSON.stringify(leadData))
    }

    // Send confirmation to customer
    if (email) {
      const confirmHtml = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a18;">
          <div style="background: #555b37; padding: 24px 32px; margin-bottom: 32px;">
            <h1 style="color: white; font-size: 18px; font-weight: 400; margin: 0;">Jessica da Horta Garden Design</h1>
          </div>
          <div style="padding: 0 32px 32px;">
            <p style="font-size: 16px; margin-bottom: 16px;">Olá ${name},</p>
            <p style="font-size: 15px; line-height: 1.7; color: #5a5a52;">Recebemos a sua mensagem e iremos responder em breve.</p>
            <p style="font-size: 15px; line-height: 1.7; color: #5a5a52; margin-top: 12px;">Obrigada pelo contacto.</p>
            <p style="font-size: 14px; margin-top: 32px; color: #888;">— Jessica da Horta Garden Design</p>
          </div>
        </div>
      `
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Jessica da Horta Garden Design <noreply@jessicadahorta.com>',
          to: [email],
          subject: 'Mensagem recebida — Jessica da Horta Garden Design',
          html: confirmHtml,
        }),
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Contact function error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 })
  }
}
