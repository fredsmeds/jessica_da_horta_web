/**
 * POST /api/contact
 * Sends a contact form email via Resend API
 */
export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()
    const { name, email, phone, zip, message, subject } = body

    const RESEND_API_KEY = env.RESEND_API_KEY
    const JESSICA_EMAIL = env.JESSICA_EMAIL || 'contact@jessicadahorta.com'

    const subjectLabels = {
      general: 'Consulta Geral',
      prices: 'Preços e Orçamentos',
    }

    const subjectLine = `[Website] ${subjectLabels[subject] || 'Contacto'} — ${name}`

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
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5da; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; width: 120px;">Nome</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5da; font-size: 15px;">${name || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5da; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #888;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5da; font-size: 15px;">${email || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5da; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #888;">Telefone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5da; font-size: 15px;">${phone || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5da; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #888;">Cód. Postal</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5da; font-size: 15px;">${zip || '—'}</td>
            </tr>
          </table>

          <div style="margin-top: 24px;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 10px;">Mensagem</p>
            <p style="font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message || '—'}</p>
          </div>
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
