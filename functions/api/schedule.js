/**
 * POST /api/schedule
 * Handles the Schedule a Visit form submission via Resend API
 * Sends full form data to Jessica and a confirmation to the customer
 */
export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const data = await request.json()
    const RESEND_API_KEY = env.RESEND_API_KEY
    const JESSICA_EMAIL = env.JESSICA_EMAIL || 'contact@jessicadahorta.com'

    const {
      fullName, phone, email, address,
      totalArea, interventionArea, limits, topo, topoFormat, constructions, constructionsDesc,
      soilAnalysis, waterAnalysis, waterSources, waterStorage,
      hasPets, petsDesc, petsAccess,
      plantingStyle, pathStyle, plantTypes, colors, desiredElements,
      serviceType,
      installation, priorities, additionalDesc,
      maintenanceTeam, maintenanceDetails,
      observations,
    } = data

    const row = (label, value) => `
      <tr>
        <td style="padding: 9px 0; border-bottom: 1px solid #e5e5da; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; width: 200px; vertical-align: top;">${label}</td>
        <td style="padding: 9px 0; border-bottom: 1px solid #e5e5da; font-size: 14px; vertical-align: top;">${value || '—'}</td>
      </tr>
    `

    const section = (title) => `
      <tr>
        <td colspan="2" style="padding: 20px 0 8px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em; color: #555b37;">${title}</td>
      </tr>
    `

    const arr = (val) => Array.isArray(val) ? val.join(', ') : (val || '—')

    const serviceLabels = {
      '1A': '1A — Consultoria Simples',
      '1B': '1B — Consultoria Avançada',
      '2A': '2A — Design Simples de Jardim',
      '2B': '2B — Projeto Completo com Partes Técnicas',
      '2C': '2C — Licenciamento Municipal',
      '3': '3 — Instalação e Monitorização',
      '4': '4 — Gestão e Manutenção',
    }

    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 680px; margin: 0 auto; color: #1a1a18;">
        <div style="background: #555b37; padding: 24px 32px; margin-bottom: 32px;">
          <h1 style="color: white; font-size: 18px; font-weight: 400; margin: 0; letter-spacing: 0.05em;">Jessica da Horta Garden Design</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 4px 0 0; letter-spacing: 0.1em; text-transform: uppercase;">Novo Pedido de Visita Técnica</p>
        </div>

        <div style="padding: 0 32px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            ${section('1. Informação do Cliente')}
            ${row('Nome completo', fullName)}
            ${row('Telefone', phone)}
            ${row('Email', email)}
            ${row('Morada', address)}

            ${section('2. Detalhes da Localização')}
            ${row('Área total (m²)', totalArea)}
            ${row('Área de intervenção (m²)', interventionArea)}
            ${row('Limites de intervenção', limits)}
            ${row('Levantamento topográfico', topo)}
            ${topo === 'yes' ? row('Formato do levantamento', topoFormat) : ''}
            ${row('Construções no local', constructions)}
            ${constructions === 'yes' ? row('Descrição das construções', constructionsDesc) : ''}

            ${section('3. Solo e Água')}
            ${row('Análise de solo', soilAnalysis)}
            ${row('Análise de água', waterAnalysis)}
            ${row('Fontes de água', arr(waterSources))}
            ${waterStorage ? row('Capacidade de armazenamento', waterStorage) : ''}

            ${section('4. Fauna Doméstica')}
            ${row('Tem animais domésticos', hasPets)}
            ${hasPets === 'yes' ? row('Espécies e quantidade', petsDesc) : ''}
            ${hasPets === 'yes' ? row('Acesso à área de plantação', petsAccess) : ''}

            ${section('5. Preferências de Jardim')}
            ${row('Estilo de plantação', plantingStyle)}
            ${row('Estilo de caminhos/formas', pathStyle)}
            ${row('Tipos de plantas', arr(plantTypes))}
            ${row('Cores preferidas', colors)}
            ${row('Elementos desejados', arr(desiredElements))}

            ${section('6. Serviços Pretendidos')}
            ${row('Tipo de serviço', serviceLabels[serviceType] || serviceType)}

            ${section('7. Calendário')}
            ${row('Época de instalação', installation)}
            ${row('Prioridades de orçamento', priorities)}
            ${additionalDesc ? row('Descrição adicional', additionalDesc) : ''}

            ${section('8. Manutenção Atual')}
            ${row('Equipa de manutenção existente', maintenanceTeam)}
            ${maintenanceTeam === 'yes' ? row('Detalhes da manutenção', maintenanceDetails) : ''}

            ${section('9. Observações Adicionais')}
            ${row('Observações', observations)}
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
        subject: `[Visita] Pedido de agendamento — ${fullName}`,
        html: htmlBody,
        reply_to: email,
      }),
    })

    if (!toJessicaRes.ok) {
      const err = await toJessicaRes.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 500 })
    }

    // Confirmation to customer
    if (email) {
      const confirmHtml = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a18;">
          <div style="background: #555b37; padding: 24px 32px; margin-bottom: 32px;">
            <h1 style="color: white; font-size: 18px; font-weight: 400; margin: 0;">Jessica da Horta Garden Design</h1>
          </div>
          <div style="padding: 0 32px 32px;">
            <p style="font-size: 16px; margin-bottom: 16px;">Olá ${fullName},</p>
            <p style="font-size: 15px; line-height: 1.7; color: #5a5a52;">
              O seu pedido de visita técnica foi recebido com sucesso.
              Iremos entrar em contacto em breve para confirmar a data e hora da visita.
            </p>
            <div style="background: #f8f7f4; border-left: 3px solid #555b37; padding: 16px 20px; margin: 24px 0;">
              <p style="font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Serviço solicitado</p>
              <p style="font-size: 14px; color: #1a1a18;">${serviceLabels[serviceType] || serviceType || '—'}</p>
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 32px;">— Jessica da Horta Garden Design</p>
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
          subject: 'Pedido de visita recebido — Jessica da Horta Garden Design',
          html: confirmHtml,
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
