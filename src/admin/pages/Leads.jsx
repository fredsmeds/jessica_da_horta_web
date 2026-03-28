import { useState, useEffect } from 'react'

const SERVICE_LABELS = {
  '1A': '1A — Consultoria Simples',
  '1B': '1B — Consultoria Avançada',
  '2A': '2A — Design Simples de Jardim',
  '2B': '2B — Projeto Completo com Partes Técnicas',
  '2C': '2C — Licenciamento Municipal',
  '3': '3 — Instalação e Monitorização',
  '4': '4 — Gestão e Manutenção',
}

const TABS = [
  { id: 'schedule', label: 'Clientes' },
  { id: 'jobs', label: 'Jardineiros' },
  { id: 'suppliers', label: 'Fornecedores' },
  { id: 'general', label: 'Questões Gerais' },
]

function calculateEstimate(lead) {
  const breakdown = []
  const visitFee = 90 + (lead.roundTripKm || 0) * 0.40
  breakdown.push({ label: 'Visita técnica inicial (base €90 + deslocação)', amount: visitFee })
  if (lead.soilAnalysis === 'no') breakdown.push({ label: 'Análise de solo', amount: 250 })
  if (lead.waterAnalysis === 'no') breakdown.push({ label: 'Análise de água', amount: 150 })
  const srcCosts = { well: 200, borehole: 150, rainwater: 300, tank: 250, public: 0 }
  for (const s of (Array.isArray(lead.waterSources) ? lead.waterSources : [])) {
    if (srcCosts[s]) breakdown.push({ label: `Fonte de água: ${s}`, amount: srcCosts[s] })
  }
  const svcCosts = { '1A': 200, '1B': 450, '2A': 1200, '2B': 1200, '2C': 600, '3': 800, '4': 200 }
  if (lead.serviceType && svcCosts[lead.serviceType] !== undefined)
    breakdown.push({ label: SERVICE_LABELS[lead.serviceType] || lead.serviceType, amount: svcCosts[lead.serviceType] })
  const subtotal = breakdown.reduce((acc, i) => acc + i.amount, 0)
  const notes = []
  if (lead.maintenanceTeam === 'yes') notes.push('Manutenção: +€80/mês (visita básica de jardim)')
  const plantAdj = { mediterranean: 10, ornamental: 15, edible: 20, medicinal: 10 }
  for (const pt of (Array.isArray(lead.plantTypes) ? lead.plantTypes : [])) {
    if (plantAdj[pt]) notes.push(`Plantas (${pt}): +${plantAdj[pt]}% sobre custo de materiais`)
  }
  return { breakdown, subtotal, notes }
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}

const yn = v => v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : (v || '—')
const arr = v => Array.isArray(v) ? (v.length ? v.join(', ') : '—') : (v || '—')

function DownloadPdfBtn({ base64, filename }) {
  if (!base64) return null
  function handleDownload() {
    const raw = base64.includes(',') ? base64.split(',')[1] : base64
    try {
      const bytes = atob(raw)
      const u8 = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i++) u8[i] = bytes.charCodeAt(i)
      const blob = new Blob([u8], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'documento.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('PDF download error:', e)
    }
  }
  return (
    <button className="pdf-btn" onClick={e => { e.stopPropagation(); handleDownload() }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      PDF
    </button>
  )
}

function LeadSection({ title }) {
  return (
    <tr><td colSpan="2" className="detail-section-title">{title}</td></tr>
  )
}

function LeadRow({ label, value }) {
  const display = Array.isArray(value) ? (value.length ? value.join(', ') : null) : (value != null ? String(value) : null)
  if (!display || display === '—' || display === 'undefined' || display === 'null') return null
  return (
    <tr>
      <td className="detail-label">{label}</td>
      <td className="detail-value">{display}</td>
    </tr>
  )
}

function EstimateSection({ breakdown, subtotal, notes }) {
  if (!breakdown || !breakdown.length) return null
  return (
    <>
      <tr><td colSpan="2" className="detail-section-title detail-section-title--estimate">Estimativa de Custos</td></tr>
      {breakdown.map((item, i) => (
        <tr key={i}>
          <td className="detail-label">{item.label}</td>
          <td className="detail-value detail-value--right">€{typeof item.amount === 'number' ? item.amount.toFixed(2) : item.amount}</td>
        </tr>
      ))}
      <tr>
        <td className="detail-label detail-label--total">Total Estimado (excl. IVA)</td>
        <td className="detail-value detail-value--right detail-value--total">€{typeof subtotal === 'number' ? subtotal.toFixed(2) : subtotal}</td>
      </tr>
      {notes && notes.length > 0 && (
        <tr>
          <td colSpan="2" className="detail-notes">
            {notes.map((n, i) => <div key={i}>• {n}</div>)}
          </td>
        </tr>
      )}
    </>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
    </svg>
  )
}

function ScheduleLeadCard({ lead }) {
  const [open, setOpen] = useState(false)
  const safeName = (lead.name || 'cliente').replace(/\s+/g, '_')
  const estimate = (lead.breakdown && lead.breakdown.length)
    ? { breakdown: lead.breakdown, subtotal: lead.subtotal, notes: lead.notes }
    : calculateEstimate(lead)

  return (
    <div className={`lead-card${open ? ' lead-card--open' : ''}`}>
      <div className="lead-card-header" onClick={() => setOpen(o => !o)}>
        <div className="lead-card-info">
          <span className="lead-date">{formatDate(lead.date)}</span>
          <span className="lead-name">{lead.name || '—'}</span>
          <span className="lead-meta">{SERVICE_LABELS[lead.serviceType] || lead.serviceType || '—'}</span>
          {lead.postalCode && <span className="lead-meta">{lead.postalCode}</span>}
        </div>
        <div className="lead-card-actions">
          {estimate.subtotal > 0 && (
            <span className="lead-estimate">€{estimate.subtotal.toFixed(0)}</span>
          )}
          <DownloadPdfBtn base64={lead.jessicaPdfBase64} filename={`JESSICA_Visita_${safeName}.pdf`} />
          <button className="toggle-btn"><ChevronIcon open={open} /></button>
        </div>
      </div>

      {open && (
        <div className="lead-card-body">
          <table className="detail-table">
            <tbody>
              <LeadSection title="1. Informação do Cliente" />
              <LeadRow label="Nome completo" value={lead.name} />
              <LeadRow label="Telefone" value={lead.phone} />
              <LeadRow label="Email" value={lead.email} />
              <LeadRow label="Morada" value={lead.address} />
              <LeadRow label="Código Postal" value={lead.postalCode} />
              <LeadRow label="Distância estimada" value={lead.distanceKm ? `${lead.distanceKm} km` : null} />
              <LeadRow label="Taxa de deslocação" value={lead.travelFee ? `90€ base + ${lead.travelFee}€ deslocação (${lead.distanceKm} km × 2 × 0,40€/km)` : null} />

              <LeadSection title="2. Detalhes da Localização" />
              <LeadRow label="Área total (m²)" value={lead.totalArea} />
              <LeadRow label="Área de intervenção (m²)" value={lead.interventionArea} />
              <LeadRow label="Limites de intervenção" value={lead.limits} />
              <LeadRow label="Levantamento topográfico" value={yn(lead.topo)} />
              <LeadRow label="Formato do levantamento" value={lead.topo === 'yes' ? lead.topoFormat : null} />
              <LeadRow label="Construções no local" value={yn(lead.constructions)} />
              <LeadRow label="Descrição das construções" value={lead.constructions === 'yes' ? lead.constructionsDesc : null} />

              <LeadSection title="3. Condições de Solo e Água" />
              <LeadRow label="Análise de solo" value={yn(lead.soilAnalysis)} />
              <LeadRow label="Análise de água" value={yn(lead.waterAnalysis)} />
              <LeadRow label="Fontes de água" value={arr(lead.waterSources)} />
              <LeadRow label="Capacidade de armazenamento" value={lead.waterStorage} />

              <LeadSection title="4. Fauna Doméstica" />
              <LeadRow label="Animais domésticos" value={yn(lead.hasPets)} />
              <LeadRow label="Espécies/quantidade" value={lead.hasPets === 'yes' ? lead.petsDesc : null} />
              <LeadRow label="Acesso à área de plantação" value={lead.hasPets === 'yes' ? yn(lead.petsAccess) : null} />

              <LeadSection title="5. Preferências de Jardim" />
              <LeadRow label="Estilo de plantação" value={lead.plantingStyle} />
              <LeadRow label="Estilo de caminhos/formas" value={lead.pathStyle} />
              <LeadRow label="Tipos de plantas" value={arr(lead.plantTypes)} />
              <LeadRow label="Cores preferidas" value={lead.colors} />
              <LeadRow label="Elementos desejados" value={arr(lead.desiredElements)} />

              <LeadSection title="6. Serviços Pretendidos" />
              <LeadRow label="Tipo de serviço" value={SERVICE_LABELS[lead.serviceType] || lead.serviceType} />
              <LeadRow label="Arquiteto paisagista anterior" value={yn(lead.hiredArchitect)} />

              <LeadSection title="7. Calendário e Visita" />
              <LeadRow label="Época de instalação" value={lead.installation} />
              <LeadRow label="Prioridades de orçamento" value={lead.priorities} />
              <LeadRow label="Descrição adicional" value={lead.additionalDesc} />
              <LeadRow label="Data preferida para visita" value={lead.preferredDate} />
              <LeadRow label="Preferência de horário" value={lead.preferredTime} />

              <LeadSection title="8. Manutenção Atual" />
              <LeadRow label="Equipa de manutenção existente" value={yn(lead.maintenanceTeam)} />
              <LeadRow label="Detalhes da manutenção" value={lead.maintenanceTeam === 'yes' ? lead.maintenanceDetails : null} />

              <LeadSection title="9. Observações Adicionais" />
              <LeadRow label="Observações" value={lead.observations} />

              <EstimateSection breakdown={estimate.breakdown} subtotal={estimate.subtotal} notes={estimate.notes} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function JobsLeadCard({ lead }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`lead-card${open ? ' lead-card--open' : ''}`}>
      <div className="lead-card-header" onClick={() => setOpen(o => !o)}>
        <div className="lead-card-info">
          <span className="lead-date">{formatDate(lead.date)}</span>
          <span className="lead-name">{lead.name || '—'}</span>
          <span className="lead-meta">Candidatura Freelance</span>
        </div>
        <div className="lead-card-actions">
          <button className="toggle-btn"><ChevronIcon open={open} /></button>
        </div>
      </div>
      {open && (
        <div className="lead-card-body">
          <table className="detail-table">
            <tbody>
              <LeadRow label="Nome" value={lead.name} />
              <LeadRow label="Telefone" value={lead.phone} />
              <LeadRow label="Email" value={lead.email} />
              {lead.message && (
                <>
                  <LeadSection title="Percurso / Experiência" />
                  <tr>
                    <td colSpan="2" className="detail-value detail-value--block">{lead.message}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function GeneralLeadCard({ lead }) {
  const [open, setOpen] = useState(false)
  const typeLabel = lead.type === 'prices' ? 'Preços e Orçamentos' : 'Consulta Geral'
  return (
    <div className={`lead-card${open ? ' lead-card--open' : ''}`}>
      <div className="lead-card-header" onClick={() => setOpen(o => !o)}>
        <div className="lead-card-info">
          <span className="lead-date">{formatDate(lead.date)}</span>
          <span className="lead-name">{lead.name || '—'}</span>
          <span className="lead-meta">{typeLabel}</span>
        </div>
        <div className="lead-card-actions">
          <button className="toggle-btn"><ChevronIcon open={open} /></button>
        </div>
      </div>
      {open && (
        <div className="lead-card-body">
          <table className="detail-table">
            <tbody>
              <LeadRow label="Nome" value={lead.name} />
              <LeadRow label="Email" value={lead.email} />
              <LeadRow label="Telefone" value={lead.phone} />
              <LeadRow label="Código Postal" value={lead.zip} />
              {lead.message && (
                <>
                  <LeadSection title="Mensagem" />
                  <tr>
                    <td colSpan="2" className="detail-value detail-value--block">{lead.message}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SupplierCard({ supplier }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`lead-card${open ? ' lead-card--open' : ''}`}>
      <div className="lead-card-header" onClick={() => setOpen(o => !o)}>
        <div className="lead-card-info">
          <span className="lead-name">{supplier.name || '—'}</span>
          <span className="lead-meta">{supplier.category || '—'}</span>
        </div>
        <div className="lead-card-actions">
          <button className="toggle-btn"><ChevronIcon open={open} /></button>
        </div>
      </div>
      {open && (
        <div className="lead-card-body">
          <table className="detail-table">
            <tbody>
              <LeadRow label="Nome" value={supplier.name} />
              <LeadRow label="Categoria" value={supplier.category} />
              <LeadRow label="Contacto" value={supplier.contact} />
              <LeadRow label="Email" value={supplier.email} />
              <LeadRow label="Telefone" value={supplier.phone} />
              <LeadRow label="Website" value={supplier.website} />
              <LeadRow label="Notas" value={supplier.notes} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.25, marginBottom: 12 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <div>{message}</div>
    </div>
  )
}

export default function Leads() {
  const [activeTab, setActiveTab] = useState('schedule')
  const [leads, setLeads] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    setError('')
    try {
      const token = sessionStorage.getItem('jdh_admin_token')
      const headers = { 'Authorization': `Bearer ${token}` }
      const [leadsRes, suppliersRes] = await Promise.all([
        fetch('/api/admin/leads', { headers }),
        fetch('/api/admin/suppliers', { headers }),
      ])
      if (!leadsRes.ok) throw new Error('Erro ao carregar leads')
      const leadsData = await leadsRes.json()
      const suppliersData = suppliersRes.ok ? await suppliersRes.json() : []
      setLeads(Array.isArray(leadsData) ? leadsData : [])
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : [])
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const scheduleLeads = leads.filter(l => l.type === 'schedule')
  const jobsLeads = leads.filter(l => l.type === 'jobs')
  const generalLeads = leads.filter(l => l.type === 'general' || l.type === 'prices')
  const counts = { schedule: scheduleLeads.length, jobs: jobsLeads.length, suppliers: suppliers.length, general: generalLeads.length }

  return (
    <>
      <style>{`
        .leads-page { padding: 32px; }
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 22px; font-weight: 700; color: #1a1a18; letter-spacing: 0.01em; }
        .page-subtitle { font-size: 13px; color: #5a5a52; margin-top: 4px; }

        .leads-tabs {
          display: flex;
          align-items: center;
          border-bottom: 2px solid #e8e8e0;
          margin-bottom: 24px;
          gap: 0;
        }
        .leads-tab {
          padding: 10px 18px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #5a5a52;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          transition: color 0.12s;
        }
        .leads-tab:hover { color: #1a1a18; }
        .leads-tab--active { color: #555b37; border-bottom-color: #555b37; font-weight: 600; }
        .tab-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 9px;
          background: #e8e8e0;
          font-size: 10px;
          font-weight: 700;
          color: #5a5a52;
        }
        .leads-tab--active .tab-count { background: #555b37; color: white; }
        .refresh-btn {
          margin-left: auto;
          padding: 7px 14px;
          background: white;
          border: 1px solid #ddddd0;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 12px;
          color: #5a5a52;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          transition: border-color 0.12s;
        }
        .refresh-btn:hover { border-color: #555b37; color: #1a1a18; }

        .leads-list { display: flex; flex-direction: column; gap: 6px; }
        .lead-card {
          background: white;
          border: 1px solid #ddddd0;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.12s;
        }
        .lead-card:hover { border-color: #b8b8a8; }
        .lead-card--open { border-color: #555b37 !important; }
        .lead-card-header {
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          gap: 12px;
          user-select: none;
        }
        .lead-card-info {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex: 1;
          flex-wrap: wrap;
          min-width: 0;
        }
        .lead-date { font-size: 11px; color: #aaa; white-space: nowrap; }
        .lead-name { font-size: 14px; font-weight: 600; color: #1a1a18; }
        .lead-meta { font-size: 12px; color: #5a5a52; }
        .lead-card-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .lead-estimate {
          font-size: 12px;
          font-weight: 700;
          color: white;
          background: #555b37;
          padding: 3px 10px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .pdf-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 11px;
          background: #f8f7f4;
          border: 1px solid #ddddd0;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #555b37;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.12s, border-color 0.12s;
        }
        .pdf-btn:hover { background: #eeeee5; border-color: #555b37; }
        .toggle-btn {
          background: none;
          border: none;
          color: #aaa;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.12s;
        }
        .toggle-btn:hover { color: #555b37; }

        .lead-card-body {
          border-top: 1px solid #f0f0ea;
          padding: 20px 20px 16px;
          background: #fafaf8;
        }
        .detail-table { width: 100%; border-collapse: collapse; }
        .detail-section-title {
          padding: 14px 0 5px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #555b37;
        }
        .detail-section-title--estimate {
          padding-top: 20px;
          border-top: 2px solid #555b37;
          margin-top: 4px;
        }
        .detail-label {
          padding: 4px 16px 4px 0;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #999;
          width: 220px;
          vertical-align: top;
          border-bottom: 1px solid #f0f0ea;
        }
        .detail-label--total {
          font-weight: 700;
          color: #555b37;
          border-top: 1px solid #c8c8b8;
          border-bottom: none;
          padding-top: 8px;
        }
        .detail-value {
          padding: 4px 0;
          font-size: 13px;
          color: #1a1a18;
          vertical-align: top;
          border-bottom: 1px solid #f0f0ea;
          word-break: break-word;
        }
        .detail-value--right { text-align: right; font-variant-numeric: tabular-nums; }
        .detail-value--total {
          font-weight: 700;
          color: #555b37;
          font-size: 14px;
          border-top: 1px solid #c8c8b8;
          border-bottom: none;
          padding-top: 8px;
        }
        .detail-value--block {
          padding: 8px 0 12px;
          white-space: pre-wrap;
          line-height: 1.6;
          color: #5a5a52;
        }
        .detail-notes {
          font-size: 11px;
          color: #888;
          padding: 6px 0 2px;
          line-height: 1.8;
        }

        .empty-state {
          padding: 56px 24px;
          text-align: center;
          color: #5a5a52;
          font-size: 14px;
          background: white;
          border: 1px solid #ddddd0;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .loading-state {
          padding: 48px 24px;
          text-align: center;
          color: #5a5a52;
          font-size: 14px;
        }
        .error-state {
          padding: 14px 16px;
          background: #fff3f3;
          border: 1px solid #f5c6c6;
          border-radius: 6px;
          color: #b94040;
          font-size: 13px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .leads-page { padding: 16px; }
          .leads-tab { padding: 10px 10px; font-size: 12px; }
          .lead-meta { display: none; }
          .detail-label { width: 130px; }
        }
      `}</style>

      <div className="leads-page">
        <div className="page-header">
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">Pedidos e contactos recebidos pelo website</p>
        </div>

        {error && <div className="error-state">{error}</div>}

        <div className="leads-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`leads-tab${activeTab === tab.id ? ' leads-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">{counts[tab.id]}</span>
            </button>
          ))}
          <button className="refresh-btn" onClick={fetchAll}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="loading-state">A carregar…</div>
        ) : (
          <div className="leads-list">
            {activeTab === 'schedule' && (
              scheduleLeads.length === 0
                ? <EmptyState message="Nenhum pedido de visita registado." />
                : scheduleLeads.map((lead, i) => <ScheduleLeadCard key={lead._key || i} lead={lead} />)
            )}
            {activeTab === 'jobs' && (
              jobsLeads.length === 0
                ? <EmptyState message="Nenhuma candidatura registada." />
                : jobsLeads.map((lead, i) => <JobsLeadCard key={lead._key || i} lead={lead} />)
            )}
            {activeTab === 'suppliers' && (
              suppliers.length === 0
                ? <EmptyState message="Nenhum fornecedor registado." />
                : suppliers.map((s, i) => <SupplierCard key={s._key || i} supplier={s} />)
            )}
            {activeTab === 'general' && (
              generalLeads.length === 0
                ? <EmptyState message="Nenhuma questão geral registada." />
                : generalLeads.map((lead, i) => <GeneralLeadCard key={lead._key || i} lead={lead} />)
            )}
          </div>
        )}
      </div>
    </>
  )
}
