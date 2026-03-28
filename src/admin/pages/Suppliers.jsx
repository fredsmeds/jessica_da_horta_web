import { useState, useEffect } from 'react'

const CATEGORIES = [
  'Plantas', 'Substratos', 'Ferramentas', 'Revestimentos',
  'Pedra', 'Água', 'Iluminação', 'Outro',
]

const CATEGORY_COLORS = {
  'Plantas': { color: '#166534', bg: '#dcfce7' },
  'Substratos': { color: '#92400e', bg: '#fef3c7' },
  'Ferramentas': { color: '#1e3a8a', bg: '#dbeafe' },
  'Revestimentos': { color: '#4c1d95', bg: '#ede9fe' },
  'Pedra': { color: '#374151', bg: '#f3f4f6' },
  'Água': { color: '#0c4a6e', bg: '#e0f2fe' },
  'Iluminação': { color: '#713f12', bg: '#fef9c3' },
  'Outro': { color: '#374151', bg: '#f3f4f6' },
}

const EMPTY_FORM = {
  name: '', category: 'Plantas', contact: '', phone: '', email: '', website: '', notes: '',
}

function CategoryBadge({ category }) {
  const cfg = CATEGORY_COLORS[category] || CATEGORY_COLORS['Outro']
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
      letterSpacing: '0.04em',
    }}>
      {category}
    </span>
  )
}

function SupplierModal({ supplier, onClose, onSave }) {
  const [form, setForm] = useState(supplier ? { ...supplier } : { ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('O nome é obrigatório.'); return }
    setSaving(true)
    setError('')
    try {
      const method = supplier ? 'PUT' : 'POST'
      const body = supplier ? { ...form, id: supplier.id } : form
      const res = await fetch('/api/admin/suppliers', {
        method,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Erro ao guardar fornecedor')
      onSave()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{`
        .sup-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .sup-modal-box {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .sup-modal-header {
          background: #555b37;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sup-modal-title {
          color: white;
          font-size: 15px;
          font-weight: 600;
        }
        .sup-modal-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          padding: 4px;
          line-height: 0;
          border-radius: 4px;
        }
        .sup-modal-close:hover { background: rgba(255,255,255,0.1); color: white; }
        .sup-modal-body {
          padding: 24px;
          max-height: 75vh;
          overflow-y: auto;
        }
        .sup-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .sup-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .sup-field.full { grid-column: 1 / -1; }
        .sup-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #5a5a52;
        }
        .sup-label .req { color: #b94040; }
        .sup-input, .sup-select, .sup-textarea {
          padding: 9px 12px;
          border: 1px solid #ddddd0;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          color: #1a1a18;
          background: white;
          outline: none;
          transition: border-color 0.12s;
        }
        .sup-input:focus, .sup-select:focus, .sup-textarea:focus { border-color: #555b37; }
        .sup-textarea { resize: vertical; min-height: 72px; }
        .sup-error {
          grid-column: 1 / -1;
          padding: 10px 14px;
          background: #fff3f3;
          border: 1px solid #f5c6c6;
          border-radius: 4px;
          color: #b94040;
          font-size: 13px;
        }
        .sup-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #ddddd0;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .sup-btn-cancel {
          padding: 9px 18px;
          background: white;
          border: 1px solid #ddddd0;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          color: #5a5a52;
          cursor: pointer;
        }
        .sup-btn-cancel:hover { border-color: #555b37; color: #1a1a18; }
        .sup-btn-save {
          padding: 9px 20px;
          background: #555b37;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .sup-btn-save:hover:not(:disabled) { background: #454d2e; }
        .sup-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="sup-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="sup-modal-box">
          <div className="sup-modal-header">
            <span className="sup-modal-title">{supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}</span>
            <button className="sup-modal-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="sup-modal-body">
              <div className="sup-form-grid">
                {error && <div className="sup-error">{error}</div>}

                <div className="sup-field full">
                  <label className="sup-label">Nome <span className="req">*</span></label>
                  <input
                    className="sup-input"
                    type="text"
                    value={form.name}
                    onChange={e => setField('name', e.target.value)}
                    required
                  />
                </div>

                <div className="sup-field">
                  <label className="sup-label">Categoria</label>
                  <select
                    className="sup-select"
                    value={form.category}
                    onChange={e => setField('category', e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="sup-field">
                  <label className="sup-label">Pessoa de contacto</label>
                  <input
                    className="sup-input"
                    type="text"
                    value={form.contact}
                    onChange={e => setField('contact', e.target.value)}
                  />
                </div>

                <div className="sup-field">
                  <label className="sup-label">Telefone</label>
                  <input
                    className="sup-input"
                    type="tel"
                    value={form.phone}
                    onChange={e => setField('phone', e.target.value)}
                  />
                </div>

                <div className="sup-field">
                  <label className="sup-label">Email</label>
                  <input
                    className="sup-input"
                    type="email"
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                  />
                </div>

                <div className="sup-field full">
                  <label className="sup-label">Website</label>
                  <input
                    className="sup-input"
                    type="url"
                    placeholder="https://"
                    value={form.website}
                    onChange={e => setField('website', e.target.value)}
                  />
                </div>

                <div className="sup-field full">
                  <label className="sup-label">Notas</label>
                  <textarea
                    className="sup-textarea"
                    value={form.notes}
                    onChange={e => setField('notes', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sup-modal-footer">
              <button type="button" className="sup-btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="sup-btn-save" disabled={saving}>
                {saving ? 'A guardar…' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

function ConfirmDeleteModal({ supplier, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        background: 'white', borderRadius: '8px', width: '100%', maxWidth: '380px',
        padding: '28px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        fontFamily: "'Alexandria', sans-serif",
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a18', margin: '0 0 10px' }}>
          Eliminar Fornecedor
        </h3>
        <p style={{ fontSize: '14px', color: '#5a5a52', margin: '0 0 24px', lineHeight: 1.6 }}>
          Tem a certeza que pretende eliminar <strong>{supplier.name}</strong>? Esta ação não pode ser revertida.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 18px', background: 'white', border: '1px solid #ddddd0',
              borderRadius: '4px', fontFamily: "'Alexandria', sans-serif", fontSize: '13px',
              color: '#5a5a52', cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '9px 18px', background: '#b94040', color: 'white', border: 'none',
              borderRadius: '4px', fontFamily: "'Alexandria', sans-serif", fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', opacity: deleting ? 0.6 : 1,
            }}
          >
            {deleting ? 'A eliminar…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [deletingSupplier, setDeletingSupplier] = useState(null)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  async function fetchSuppliers() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/suppliers', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}` },
      })
      if (!res.ok) throw new Error('Erro ao carregar fornecedores')
      const data = await res.json()
      setSuppliers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(supplier) {
    try {
      const res = await fetch('/api/admin/suppliers', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: supplier.id }),
      })
      if (!res.ok) throw new Error('Erro ao eliminar')
      setDeletingSupplier(null)
      fetchSuppliers()
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = suppliers.filter(s => {
    const catMatch = filterCat === 'all' || s.category === filterCat
    const term = search.toLowerCase()
    const textMatch = !term || [s.name, s.category, s.contact, s.email, s.phone, s.notes]
      .some(v => v && v.toLowerCase().includes(term))
    return catMatch && textMatch
  })

  return (
    <>
      <style>{`
        .sup-page { padding: 32px; }
        .sup-header {
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
        .add-btn {
          padding: 10px 18px;
          background: #555b37;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: background 0.12s;
          white-space: nowrap;
        }
        .add-btn:hover { background: #454d2e; }
        .sup-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }
        .sup-search {
          flex: 1;
          min-width: 200px;
          position: relative;
        }
        .sup-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #5a5a52;
          pointer-events: none;
        }
        .sup-search input {
          width: 100%;
          padding: 9px 12px 9px 36px;
          border: 1px solid #ddddd0;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          color: #1a1a18;
          background: white;
          outline: none;
        }
        .sup-search input:focus { border-color: #555b37; }
        .sup-filter {
          padding: 9px 12px;
          border: 1px solid #ddddd0;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          color: #1a1a18;
          background: white;
          outline: none;
          cursor: pointer;
        }
        .sup-filter:focus { border-color: #555b37; }
        .sup-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .sup-card {
          background: white;
          border: 1px solid #ddddd0;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: box-shadow 0.15s;
        }
        .sup-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .sup-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .sup-name {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a18;
          line-height: 1.3;
        }
        .sup-card-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .sup-action-btn {
          padding: 5px 10px;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.12s;
          border: 1px solid;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .sup-edit-btn {
          background: white;
          border-color: #ddddd0;
          color: #5a5a52;
        }
        .sup-edit-btn:hover { border-color: #555b37; color: #1a1a18; }
        .sup-del-btn {
          background: white;
          border-color: #f5c6c6;
          color: #b94040;
        }
        .sup-del-btn:hover { background: #fff3f3; }
        .sup-card-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sup-info-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #5a5a52;
        }
        .sup-info-icon {
          flex-shrink: 0;
          margin-top: 1px;
          color: #555b37;
          opacity: 0.6;
        }
        .sup-info-link {
          color: #555b37;
          text-decoration: none;
          font-size: 12px;
          word-break: break-all;
        }
        .sup-info-link:hover { text-decoration: underline; }
        .sup-notes {
          font-size: 12px;
          color: #5a5a52;
          background: #f8f7f4;
          border-radius: 4px;
          padding: 8px 10px;
          line-height: 1.5;
          border-left: 3px solid #ddddd0;
        }
        .error-state {
          padding: 14px 16px;
          background: #fff3f3;
          border: 1px solid #f5c6c6;
          border-radius: 6px;
          color: #b94040;
          font-size: 13px;
          margin-bottom: 20px;
        }
        .empty-state {
          grid-column: 1 / -1;
          padding: 64px 24px;
          text-align: center;
          color: #5a5a52;
          font-size: 14px;
          background: white;
          border: 1px solid #ddddd0;
          border-radius: 8px;
        }
        .loading-state {
          grid-column: 1 / -1;
          padding: 48px 24px;
          text-align: center;
          color: #5a5a52;
          font-size: 14px;
          background: white;
          border: 1px solid #ddddd0;
          border-radius: 8px;
        }
        @media (max-width: 600px) {
          .sup-page { padding: 16px; }
          .sup-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sup-page">
        <div className="sup-header">
          <div>
            <h1 className="page-title">Fornecedores</h1>
            <p className="page-subtitle">Base de dados de fornecedores e parceiros</p>
          </div>
          <button className="add-btn" onClick={() => { setEditingSupplier(null); setShowModal(true) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Adicionar Fornecedor
          </button>
        </div>

        {error && <div className="error-state">{error}</div>}

        <div className="sup-toolbar">
          <div className="sup-search">
            <span className="sup-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Pesquisar fornecedores…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="sup-filter"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="all">Todas as categorias</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="sup-grid">
          {loading ? (
            <div className="loading-state">A carregar fornecedores…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ marginBottom: '10px', opacity: 0.3 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              {suppliers.length === 0
                ? 'Nenhum fornecedor adicionado. Clique em "+ Adicionar Fornecedor" para começar.'
                : 'Nenhum registo encontrado.'}
            </div>
          ) : (
            filtered.map(s => (
              <div className="sup-card" key={s.id}>
                <div className="sup-card-header">
                  <div>
                    <div className="sup-name">{s.name}</div>
                    <div style={{ marginTop: '6px' }}>
                      <CategoryBadge category={s.category} />
                    </div>
                  </div>
                  <div className="sup-card-actions">
                    <button
                      className="sup-action-btn sup-edit-btn"
                      onClick={() => { setEditingSupplier(s); setShowModal(true) }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      className="sup-action-btn sup-del-btn"
                      onClick={() => setDeletingSupplier(s)}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="sup-card-info">
                  {s.contact && (
                    <div className="sup-info-row">
                      <span className="sup-info-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      {s.contact}
                    </div>
                  )}
                  {s.phone && (
                    <div className="sup-info-row">
                      <span className="sup-info-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </span>
                      {s.phone}
                    </div>
                  )}
                  {s.email && (
                    <div className="sup-info-row">
                      <span className="sup-info-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <a href={`mailto:${s.email}`} className="sup-info-link">{s.email}</a>
                    </div>
                  )}
                  {s.website && (
                    <div className="sup-info-row">
                      <span className="sup-info-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </span>
                      <a href={s.website} target="_blank" rel="noopener noreferrer" className="sup-info-link">
                        {s.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

                {s.notes && <div className="sup-notes">{s.notes}</div>}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={() => { setShowModal(false); setEditingSupplier(null) }}
          onSave={() => { setShowModal(false); setEditingSupplier(null); fetchSuppliers() }}
        />
      )}

      {deletingSupplier && (
        <ConfirmDeleteModal
          supplier={deletingSupplier}
          onClose={() => setDeletingSupplier(null)}
          onConfirm={() => handleDelete(deletingSupplier)}
        />
      )}
    </>
  )
}
