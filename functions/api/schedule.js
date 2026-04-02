/**
 * POST /api/schedule
 * Handles the Schedule a Visit form submission via Resend API
 * Sends full form data + internal PDF (with pricing) to Jessica
 * Sends a confirmation + client PDF (no pricing) to the customer
 */
import { honeypotCheck, isRateLimited, getIP, BOT_RESPONSE } from '../_shared/botProtection.js'

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const data = await request.json()

    if (honeypotCheck(data)) return BOT_RESPONSE
    if (await isRateLimited(env.LEADS_KV, getIP(request), 'schedule', 4)) {
      return new Response(JSON.stringify({ error: 'too_many_requests' }), { status: 429 })
    }

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
      serviceType, hiredArchitect,
      installation, priorities, additionalDesc,
      maintenanceTeam, maintenanceDetails,
      preferredDate, preferredTime,
      observations,
      distanceKm, travelFee, roundTripKm,
      clientPdfBase64, jessicaPdfBase64,
      attachments = [],
    } = data

    const stripPrefix = b64 => (b64 && b64.includes(',') ? b64.split(',')[1] : b64)
    const safeName = (fullName || 'cliente').replace(/\s+/g, '_')

    // Build Resend attachment objects
    const jessicaPdfAttachment = jessicaPdfBase64
      ? [{ filename: `JESSICA_Visita_${safeName}.pdf`, content: stripPrefix(jessicaPdfBase64) }]
      : []

    const clientPdfAttachment = clientPdfBase64
      ? [{ filename: `Visita_JessicaDaHorta_${safeName}.pdf`, content: stripPrefix(clientPdfBase64) }]
      : []

    const imageAttachments = attachments.map(f => ({
      filename: f.name || 'anexo',
      content: stripPrefix(f.data),
    }))

    const jessicaAttachments = [...jessicaPdfAttachment, ...imageAttachments]

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
      ? row('Taxa de deslocação', `90€ base + ${travelFee}€ deslocação (${distanceKm} km × 2 ida/volta × 0,40€/km)`)
      : ''

    const attachmentNote = jessicaAttachments.length > 0
      ? `<p style="font-size:13px;color:#555b37;margin:16px 0 0;">📎 ${jessicaAttachments.length} anexo(s) incluído(s) neste email.</p>`
      : ''

    // ── Pricing estimate (Jessica only) ─────────────────────────────────────
    const breakdown = []
    const visitFee = 90 + (roundTripKm || 0) * 0.40
    breakdown.push({ label: 'Visita técnica inicial (base €90 + deslocação)', amount: visitFee })
    if (soilAnalysis === 'no') breakdown.push({ label: 'Análise de solo', amount: 250 })
    if (waterAnalysis === 'no') breakdown.push({ label: 'Análise de água', amount: 150 })
    const srcCosts = { well: 200, borehole: 150, rainwater: 300, tank: 250, public: 0 }
    for (const s of (Array.isArray(waterSources) ? waterSources : [])) {
      if (srcCosts[s]) breakdown.push({ label: `Fonte de água: ${s}`, amount: srcCosts[s] })
    }
    const svcCosts = { '1A': 200, '1B': 450, '2A': 1200, '2B': 1200, '2C': 600, '3': 800, '4': 200 }
    if (serviceType && svcCosts[serviceType] !== undefined)
      breakdown.push({ label: serviceLabels[serviceType] || serviceType, amount: svcCosts[serviceType] })
    const subtotal = breakdown.reduce((acc, i) => acc + i.amount, 0)
    const notes = []
    if (maintenanceTeam === 'yes') notes.push('Manutenção: +€80/mês (visita básica de jardim)')
    const plantAdj = { mediterranean: 10, ornamental: 15, edible: 20, medicinal: 10 }
    for (const pt of (Array.isArray(plantTypes) ? plantTypes : [])) {
      if (plantAdj[pt]) notes.push(`Plantas (${pt}): +${plantAdj[pt]}% sobre custo de materiais`)
    }

    const estimateRows = breakdown.map(item =>
      `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #f0f0ea;font-size:13px;color:#444;">${item.label}</td>
        <td style="padding:6px 0;border-bottom:1px solid #f0f0ea;font-size:13px;text-align:right;color:#1a1a18;">€${item.amount.toFixed(2)}</td>
      </tr>`
    ).join('')

    const notesHtml = notes.length
      ? `<p style="font-size:12px;color:#888;margin:8px 0 0;">${notes.map(n => `• ${n}`).join('<br>')}</p>`
      : ''

    const estimateSection = `
      ${section('Estimativa de Custos (Uso Interno)')}
      <tr><td colspan="2" style="padding:8px 0 0;">
        <table style="width:100%;border-collapse:collapse;">
          ${estimateRows}
          <tr>
            <td style="padding:10px 0 4px;font-size:13px;font-weight:bold;color:#555b37;border-top:2px solid #555b37;">TOTAL ESTIMADO (excl. IVA)</td>
            <td style="padding:10px 0 4px;font-size:15px;font-weight:bold;color:#555b37;text-align:right;border-top:2px solid #555b37;">€${subtotal.toFixed(2)}</td>
          </tr>
        </table>
        ${notesHtml}
      </td></tr>`

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
            ${row('Arquiteto paisagista anterior', yn(hiredArchitect))}

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

            ${estimateSection}
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
        to: ['jessicadhg.pais.agem@gmail.com', 'jessicadhg@gmail.com', 'contact@jessicadahorta.com'],
        subject: `[Visita] Pedido de agendamento — ${fullName}`,
        html: htmlBody,
        reply_to: email,
        attachments: jessicaAttachments,
      }),
    })

    if (!toJessicaRes.ok) {
      const err = await toJessicaRes.text()
      console.error(`Resend error (Jessica) — status ${toJessicaRes.status}:`, err)
      return new Response(JSON.stringify({ error: 'Email send failed', detail: err }), { status: 500 })
    }

    // ── Write lead to KV ──────────────────────────────────────────────────────
    if (context.env.LEADS_KV) {
      const ts = Date.now()
      const leadKey = `lead:${ts}:schedule`

      // Store each attachment file in its own KV key (keeps lead payload small)
      const attachmentMeta = []
      for (let i = 0; i < attachments.length; i++) {
        const att = attachments[i]
        const attKey = `attachment:${ts}:${i}`
        await context.env.LEADS_KV.put(attKey, JSON.stringify({
          name: att.name,
          type: att.type,
          data: att.data,
        }))
        attachmentMeta.push({ key: attKey, name: att.name, type: att.type })
      }

      const leadData = {
        type: 'schedule',
        date: new Date().toISOString(),
        name: fullName, email, phone, address, postalCode,
        totalArea, interventionArea, limits, topo, topoFormat, constructions, constructionsDesc,
        soilAnalysis, waterAnalysis, waterSources, waterStorage,
        hasPets, petsDesc, petsAccess,
        plantingStyle, pathStyle, plantTypes, colors, desiredElements,
        serviceType, hiredArchitect,
        installation, priorities, additionalDesc, preferredDate, preferredTime,
        maintenanceTeam, maintenanceDetails,
        observations,
        distanceKm, travelFee, roundTripKm,
        breakdown, subtotal, notes,
        jessicaPdfBase64,
        attachments: attachmentMeta,
      }
      await context.env.LEADS_KV.put(leadKey, JSON.stringify(leadData))
    }

    // ── Send confirmation to client ───────────────────────────────────────────
    if (email) {
      const toClientRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Jessica da Horta Garden Design <noreply@jessicadahorta.com>',
          to: [email],
          subject: 'O seu pedido de visita foi enviado — Jessica da Horta Garden Design',
          html: confirmHtml,
          attachments: clientPdfAttachment,
        }),
      })
      if (!toClientRes.ok) {
        const err = await toClientRes.text()
        console.error(`Resend error (client) — status ${toClientRes.status}:`, err)
      }
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
