import { useState, useEffect, useRef } from 'react'

const DEFAULT_PRICES = [
  { id: 'visit', service: 'Visita Técnica', price: 90, unit: 'base + €0.50/km (>50km)', notes: 'Deduzida do projeto' },
  { id: '1_part', service: '1 — Consultoria Inicial · Particulares', price: 1250, unit: 'projeto', notes: 'Fase 1 completa' },
  { id: '1_emp', service: '1 — Consultoria Inicial · Empresas', price: 1750, unit: 'projeto', notes: 'Fase 1 completa' },
  { id: '1_ong', service: '1 — Consultoria Inicial · ONGs', price: 875, unit: 'projeto', notes: '-30% · Fase 1 completa' },
  { id: '1b_diag', service: '1B — Diagnóstico Inicial Terreno', price: 650, unit: 'análise', notes: '≤2.500m²' },
  { id: '1b_conf', service: '1B — Consultoria Conformidade Completa', price: 1100, unit: 'projeto', notes: '' },
  { id: '1b_acomp', service: '1B — Acompanhamento Anual', price: 1800, unit: 'ano', notes: '' },
  { id: '2A', service: '2A — Design Simples de Jardim', price: 1200, unit: 'projeto', notes: '' },
  { id: '2B', service: '2B — Projeto Completo com Partes Técnicas', price: 1200, unit: 'projeto', notes: '' },
  { id: '2C', service: '2C — Licenciamento Municipal', price: 600, unit: 'projeto', notes: '' },
  { id: '3', service: '3 — Instalação e Monitorização', price: 800, unit: 'projeto', notes: '' },
  { id: '4', service: '4 — Gestão e Manutenção', price: 200, unit: 'mês', notes: '' },
  { id: 'soil', service: 'Análise de Solo', price: 250, unit: 'análise', notes: '' },
  { id: 'water', service: 'Análise de Água', price: 150, unit: 'análise', notes: '' },
  { id: 'maint', service: 'Manutenção Básica', price: 80, unit: 'mês', notes: '' },
  { id: 'plant_med', service: 'Plantas Mediterrânicas (adj.)', price: 10, unit: '% materiais', notes: '' },
  { id: 'plant_orn', service: 'Plantas Ornamentais (adj.)', price: 15, unit: '% materiais', notes: '' },
  { id: 'plant_edible', service: 'Plantas Comestíveis (adj.)', price: 20, unit: '% materiais', notes: '' },
]

function EditableCell({ value, type = 'text', onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  function startEdit() {
    setDraft(value)
    setEditing(true)
  }

  function commit() {
    setEditing(false)
    const parsed = type === 'number' ? parseFloat(draft) || 0 : draft
    if (parsed !== value) onSave(parsed)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') { setEditing(false); setDraft(value) }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          padding: '4px 8px',
          border: '1px solid #555b37',
          borderRadius: '3px',
          fontFamily: "'Alexandria', sans-serif",
          fontSize: '13px',
          color: '#1a1a18',
          outline: 'none',
          background: 'white',
        }}
      />
    )
  }

  return (
    <span
      onClick={startEdit}
      title="Clique para editar"
      style={{
        cursor: 'pointer',
        display: 'block',
        padding: '4px 8px',
        borderRadius: '3px',
        minHeight: '28px',
        border: '1px solid transparent',
        transition: 'border-color 0.12s, background 0.12s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#ddddd0'; e.currentTarget.style.background = '#f8f7f4' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent' }}
    >
      {type === 'number' ? `€${Number(value).toLocaleString('pt-PT')}` : (value || <span style={{ color: '#bbb' }}>—</span>)}
    </span>
  )
}

export default function Prices() {
  const [prices, setPrices] = useState(DEFAULT_PRICES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchPrices()
  }, [])

  async function fetchPrices() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/prices', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}` },
      })
      if (!res.ok) throw new Error('Erro ao carregar preços')
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setPrices(data)
      } else {
        setPrices(DEFAULT_PRICES)
      }
    } catch {
      setPrices(DEFAULT_PRICES)
    } finally {
      setLoading(false)
    }
  }

  function updatePrice(id, field, value) {
    setPrices(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    setSaved(false)
  }

  async function savePrices() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/prices', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prices),
      })
      if (!res.ok) throw new Error('Erro ao guardar preços')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{`
        .prices-page { padding: 32px; }
        .prices-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .page-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a18;
          letter-spacing: 0.01em;
        }
        .page-subtitle {
          font-size: 13px;
          color: #5a5a52;
          margin-top: 4px;
        }
        .save-btn {
          padding: 10px 22px;
          background: #555b37;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.12s;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .save-btn:hover:not(:disabled) { background: #454d2e; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .save-btn.saved { background: #15803d; }
        .error-state {
          padding: 14px 16px;
          background: #fff3f3;
          border: 1px solid #f5c6c6;
          border-radius: 6px;
          color: #b94040;
          font-size: 13px;
          margin-bottom: 20px;
        }
        .prices-hint {
          font-size: 12px;
          color: #5a5a52;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .prices-table-wrap {
          background: white;
          border: 1px solid #ddddd0;
          border-radius: 8px;
          overflow: hidden;
        }
        .prices-table {
          width: 100%;
          border-collapse: collapse;
        }
        .prices-table th {
          padding: 12px 16px;
          background: #f8f7f4;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #5a5a52;
          border-bottom: 1px solid #ddddd0;
          white-space: nowrap;
        }
        .prices-table td {
          padding: 6px 8px;
          border-bottom: 1px solid #f0f0ea;
          font-size: 13px;
          color: #1a1a18;
          vertical-align: middle;
        }
        .prices-table tr:last-child td { border-bottom: none; }
        .prices-table tr:hover td { background: #fafafa; }
        .service-name {
          font-weight: 500;
          font-size: 13px;
        }
        .unit-text {
          font-size: 12px;
          color: #5a5a52;
        }
        .loading-state {
          padding: 48px 24px;
          text-align: center;
          color: #5a5a52;
          font-size: 14px;
        }
        @media (max-width: 700px) {
          .prices-page { padding: 16px; }
          .col-unit, .col-notes { display: none; }
        }
      `}</style>

      <div className="prices-page">
        <div className="prices-header">
          <div>
            <h1 className="page-title">Preços</h1>
            <p className="page-subtitle">Tabela de preços dos serviços Jessica da Horta</p>
          </div>
          <button
            className={`save-btn${saved ? ' saved' : ''}`}
            onClick={savePrices}
            disabled={saving}
          >
            {saved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Guardado
              </>
            ) : saving ? (
              'A guardar…'
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Guardar alterações
              </>
            )}
          </button>
        </div>

        {error && <div className="error-state">{error}</div>}

        <p className="prices-hint">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Clique numa célula de preço ou notas para editar. Prima Enter ou clique fora para confirmar.
        </p>

        <div className="prices-table-wrap">
          {loading ? (
            <div className="loading-state">A carregar preços…</div>
          ) : (
            <table className="prices-table">
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Preço</th>
                  <th className="col-unit">Unidade</th>
                  <th className="col-notes">Notas</th>
                </tr>
              </thead>
              <tbody>
                {prices.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="service-name">{item.service}</span>
                    </td>
                    <td style={{ width: '140px' }}>
                      <EditableCell
                        value={item.price}
                        type="number"
                        onSave={val => updatePrice(item.id, 'price', val)}
                      />
                    </td>
                    <td className="col-unit" style={{ width: '140px' }}>
                      <span className="unit-text">{item.unit}</span>
                    </td>
                    <td className="col-notes" style={{ minWidth: '160px' }}>
                      <EditableCell
                        value={item.notes}
                        type="text"
                        onSave={val => updatePrice(item.id, 'notes', val)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
