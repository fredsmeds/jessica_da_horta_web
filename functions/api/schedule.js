/**
 * POST /api/schedule
 * Handles the Schedule a Visit form submission via Resend API
 * Sends full form data + PDF to Jessica and a confirmation + PDF to the customer
 */
export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const data = await request.json()
    const RESEND_API_KEY = env.RESEND_API_KEY
    const JESSICA_EMAIL = env.JESSICA_EMAIL || 'jessicadhg.pais.agem@gmail.com'

    if (!RESEND_API_KEY) {
      console.error('Schedule function: RESEND_API_KEY is not set in environment')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 })
    }

    const {
      fullName, phone, email, address, postalCode,
      totalArea, interventionArea, limits, topo, topoFormat, constructions, constructionsDesc,
      soilAnalysis, waterAnalysis, waterSources, waterStorage,
      hasPets, petsDesc, petsAccess,
      plantingStyle, pathStyle, plantTypes, colors, desiredElements,
      serviceType,
      installation, priorities, additionalDesc,
      maintenanceTeam, maintenanceDetails,
      preferredDate, preferredTime,
      observations,
      distanceKm, travelFee,
      pdfBase64,
      attachments = [],
    } = data

    const stripPrefix = b64 => (b64 && b64.includes(',') ? b64.split(',')[1] : b64)

    // Build Resend attachment objects
    const pdfAttachment = pdfBase64
      ? [{ filename: `Visita_JessicaDaHorta_${(fullName || 'cliente').replace(/\s+/g, '_')}.pdf`, content: stripPrefix(pdfBase64) }]
      : []

    const imageAttachments = attachments.map(f => ({
      filename: f.name || 'anexo',
      content: stripPrefix(f.data),
    }))

    const allAttachments = [...pdfAttachment, ...imageAttachments]

    // ── HTML helpers ────────────────────────────────────────────────────────
    const row = (label, value) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e5da;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#888;width:200px;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e5da;font-size:14px;vertical-align:top;">${value || '—'}</td>
      </tr>`

    const section = title => `
      <tr>
        <td colspan="2" style="padding:20px 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;color:#555b37;">${title}</td>
      </tr>`

    const arr = v => Array.isArray(v) ? v.join(', ') : (v || '—')
    const yn = v => v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : '—'

    const serviceLabels = {
      '1A': '1A — Consultoria Simples', '1B': '1B — Consultoria Avançada',
      '2A': '2A — Design Simples de Jardim', '2B': '2B — Projeto Completo com Partes Técnicas',
      '2C': '2C — Licenciamento Municipal', '3': '3 — Instalação e Monitorização',
      '4': '4 — Gestão e Manutenção',
    }

    const travelRow = distanceKm
      ? row('Taxa de deslocação', travelFee > 0
          ? `45€ base + ${travelFee}€ extra (${distanceKm} km, +${distanceKm - 50} km × 0,40€)`
          : `45€ base — dentro do raio de 50 km (${distanceKm} km)`)
      : ''

    const attachmentNote = allAttachments.length > 0
      ? `<p style="font-size:13px;color:#555b37;margin:16px 0 0;">📎 ${allAttachments.length} anexo(s) incluído(s) neste email.</p>`
      : ''

    // ── Jessica's email body ─────────────────────────────────────────────────
    const htmlBody = `
      <div style="font-family:Georgia,serif;max-width:680px;margin:0 auto;color:#1a1a18;">
        <div style="background:#555b37;padding:24px 32px;margin-bottom:32px;">
          <h1 style="color:white;font-size:18px;font-weight:400;margin:0;letter-spacing:0.05em;">Jessica da Horta Garden Design</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase;">Novo Pedido de Visita Técnica</p>
        </div>
        <div style="padding:0 32px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            ${section('1. Informação do Cliente')}
            ${row('Nome completo', fullName)}
            ${row('Telefone', phone)}
            ${row('Email', email)}
            ${row('Morada', address)}
            ${row('Código Postal', postalCode)}
            ${distanceKm ? row('Distância estimada', `${distanceKm} km`) : ''}
            ${travelRow}

            ${section('2. Detalhes da Localização')}
            ${row('Área total (m²)', totalArea)}
            ${row('Área de intervenção (m²)', interventionArea)}
            ${row('Limites de intervenção', limits)}
            ${row('Levantamento topográfico', yn(topo))}
            ${topo === 'yes' ? row('Formato do levantamento', topoFormat) : ''}
            ${row('Construções no local', yn(constructions))}
            ${constructions === 'yes' ? row('Descrição das construções', constructionsDesc) : ''}

            ${section('3. Solo e Água')}
            ${row('Análise de solo', yn(soilAnalysis))}
            ${row('Análise de água', yn(waterAnalysis))}
            ${row('Fontes de água', arr(waterSources))}
            ${waterStorage ? row('Capacidade de armazenamento', waterStorage) : ''}

            ${section('4. Fauna Doméstica')}
            ${row('Animais domésticos', yn(hasPets))}
            ${hasPets === 'yes' ? row('Espécies/quantidade', petsDesc) : ''}
            ${hasPets === 'yes' ? row('Acesso à área de plantação', yn(petsAccess)) : ''}

            ${section('5. Preferências de Jardim')}
            ${row('Estilo de plantação', plantingStyle)}
            ${row('Estilo de caminhos/formas', pathStyle)}
            ${row('Tipos de plantas', arr(plantTypes))}
            ${row('Cores preferidas', colors)}
            ${row('Elementos desejados', arr(desiredElements))}

            ${section('6. Serviços Pretendidos')}
            ${row('Tipo de serviço', serviceLabels[serviceType] || serviceType)}

            ${section('7. Calendário e Visita')}
            ${row('Época de instalação', installation)}
            ${row('Prioridades de orçamento', priorities)}
            ${additionalDesc ? row('Descrição adicional', additionalDesc) : ''}
            ${preferredDate ? row('Data preferida para visita', preferredDate) : ''}
            ${preferredTime ? row('Preferência de horário', preferredTime) : ''}

            ${section('8. Manutenção Atual')}
            ${row('Equipa de manutenção existente', yn(maintenanceTeam))}
            ${maintenanceTeam === 'yes' ? row('Detalhes da manutenção', maintenanceDetails) : ''}

            ${section('9. Observações Adicionais')}
            ${row('Observações', observations)}
          </table>
          ${attachmentNote}
        </div>
      </div>`

    // ── Client confirmation body ──────────────────────────────────────────────
    const confirmHtml = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a18;">
        <div style="background:#555b37;padding:24px 32px;margin-bottom:32px;">
          <h1 style="color:white;font-size:18px;font-weight:400;margin:0;">Jessica da Horta Garden Design</h1>
        </div>
        <div style="padding:0 32px 32px;">
          <p style="font-size:16px;margin-bottom:16px;">Olá ${fullName},</p>
          <p style="font-size:15px;line-height:1.7;color:#5a5a52;">
            O seu pedido de visita técnica foi enviado com sucesso.<br>
            Será contactado brevemente para confirmar a data e hora da visita.
          </p>
          ${preferredDate ? `
          <div style="background:#f8f7f4;border-left:3px solid #555b37;padding:16px 20px;margin:24px 0;">
            <p style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Data preferida</p>
            <p style="font-size:14px;color:#1a1a18;margin:0;">${preferredDate}${preferredTime ? ` — ${preferredTime}` : ''}</p>
          </div>` : ''}
          <div style="background:#f8f7f4;border-left:3px solid #555b37;padding:16px 20px;margin:24px 0;">
            <p style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Serviço solicitado</p>
            <p style="font-size:14px;color:#1a1a18;margin:0;">${serviceLabels[serviceType] || serviceType || '—'}</p>
          </div>
          <p style="font-size:13px;color:#aaa;margin-top:8px;">Em anexo encontra o resumo do seu pedido em formato PDF.</p>
          <p style="font-size:14px;color:#888;margin-top:32px;">— Jessica da Horta Garden Design</p>
        </div>
      </div>`

    // ── Send to Jessica ───────────────────────────────────────────────────────
    const toJessicaRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Jessica da Horta Garden Design <noreply@jessicadahorta.com>',
        to: [JESSICA_EMAIL],
        subject: `[Visita] Pedido de agendamento — ${fullName}`,
        html: htmlBody,
        reply_to: email,
        attachments: allAttachments,
      }),
    })

    if (!toJessicaRes.ok) {
      const err = await toJessicaRes.text()
      console.error(`Resend error (Jessica) — status ${toJessicaRes.status}:`, err)
      return new Response(JSON.stringify({ error: 'Email send failed', detail: err }), { status: 500 })
    }

    // ── Send confirmation to client ───────────────────────────────────────────
    if (email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Jessica da Horta Garden Design <noreply@jessicadahorta.com>',
          to: [email],
          subject: 'O seu pedido de visita foi enviado — Jessica da Horta Garden Design',
          html: confirmHtml,
          attachments: pdfAttachment,
        }),
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Schedule function error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 })
  }
}
