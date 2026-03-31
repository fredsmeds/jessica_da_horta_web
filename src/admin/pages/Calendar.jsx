import { useState, useEffect, useCallback } from 'react'

const AUTH = () => ({ 'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}` })
const JSON_AUTH = () => ({ ...AUTH(), 'Content-Type': 'application/json' })

const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

// Colors
const COLOR_LEAD   = { bg: '#e8f0e0', border: '#555b37', text: '#3a4026', dot: '#555b37' }  // olive – web request
const COLOR_MANUAL = { bg: '#fef3e2', border: '#c0831a', text: '#7a4f00', dot: '#c0831a' }  // amber – manual

function toYMD(date) {
  return date.toISOString().split('T')[0]
}

function formatTime(t) {
  if (!t) return ''
  return t.slice(0, 5)
}

function formatDisplayDate(ymd) {
  if (!ymd) return ''
  const [y, m, d] = ymd.split('-')
  return `${d}/${m}/${y}`
}

// Build calendar grid (6 weeks × 7 days)
function buildGrid(year, month) {
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const startDow = first.getDay() // 0=Sun
  const cells = []
  // Previous month padding
  for (let i = 0; i < startDow; i++) {
    const d = new Date(year, month, 1 - (startDow - i))
    cells.push({ date: toYMD(d), current: false })
  }
  // Current month
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push({ date: toYMD(new Date(year, month, d)), current: true })
  }
  // Next month padding
  while (cells.length < 42) {
    const d = new Date(year, month + 1, cells.length - last.getDate() - startDow + 1)
    cells.push({ date: toYMD(d), current: false })
  }
  return cells
}

// ── Appointment Modal ────────────────────────────────────────────────────────
function AppointmentModal({ initial, onSave, onDelete, onClose }) {
  const isEdit = !!initial?.id
  const [title, setTitle] = useState(initial?.title || '')
  const [date,  setDate]  = useState(initial?.date  || '')
  const [time,  setTime]  = useState(initial?.time  || '')
  const [notes, setNotes] = useState(initial?.notes || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!title.trim() || !date) return
    setSaving(true)
    await onSave({ id: initial?.id, title: title.trim(), date, time, notes })
    setSaving(false)
  }

  async function handleDelete() {
    if (!window.confirm(`Apagar "${title}"?`)) return
    await onDelete(initial.id)
  }

  return (
    <div className="cal-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cal-modal">
        <button className="cal-modal-close" onClick={onClose}>×</button>
        <h3 className="cal-modal-title">{isEdit ? 'Editar apontamento' : 'Novo apontamento'}</h3>

        <div className="cal-field">
          <label>Título *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Visita técnica – Lisboa" autoFocus />
        </div>
        <div className="cal-field-row">
          <div className="cal-field">
            <label>Data *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="cal-field">
            <label>Hora</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>
        <div className="cal-field">
          <label>Notas</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observações..." rows={3} />
        </div>

        <div className="cal-modal-actions">
          {isEdit && (
            <button className="cal-btn-del" onClick={handleDelete}>Apagar</button>
          )}
          <button className="cal-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="cal-btn-save" onClick={handleSave} disabled={saving || !title.trim() || !date}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Day Panel ────────────────────────────────────────────────────────────────
function DayPanel({ date, events, onAdd, onEditAppt, onClose }) {
  const leads   = events.filter(e => e._type === 'lead')
  const appts   = events.filter(e => e._type === 'manual')

  return (
    <div className="cal-day-panel">
      <div className="cal-day-panel-header">
        <span className="cal-day-panel-date">{formatDisplayDate(date)}</span>
        <button className="cal-day-panel-close" onClick={onClose}>×</button>
      </div>

      {events.length === 0 && (
        <p className="cal-day-empty">Sem eventos neste dia.</p>
      )}

      {leads.length > 0 && (
        <div className="cal-day-section">
          <div className="cal-day-section-label" style={{ color: COLOR_LEAD.dot }}>
            <span className="cal-dot" style={{ background: COLOR_LEAD.dot }} />
            Pedidos Web
          </div>
          {leads.map(l => (
            <div key={l._key} className="cal-event-card" style={{ borderColor: COLOR_LEAD.border, background: COLOR_LEAD.bg }}>
              <div className="cal-event-title" style={{ color: COLOR_LEAD.text }}>
                {l.preferredTime ? `${formatTime(l.preferredTime)} · ` : ''}{l.name || '—'}
              </div>
              <div className="cal-event-sub">{l.email} · {l.phone}</div>
              {l.location && <div className="cal-event-sub">📍 {l.location}</div>}
              {l.serviceType && <div className="cal-event-sub">Serviço: {l.serviceType}</div>}
            </div>
          ))}
        </div>
      )}

      {appts.length > 0 && (
        <div className="cal-day-section">
          <div className="cal-day-section-label" style={{ color: COLOR_MANUAL.dot }}>
            <span className="cal-dot" style={{ background: COLOR_MANUAL.dot }} />
            Apontamentos
          </div>
          {appts.map(a => (
            <div key={a.id} className="cal-event-card cal-event-card--click"
              style={{ borderColor: COLOR_MANUAL.border, background: COLOR_MANUAL.bg }}
              onClick={() => onEditAppt(a)}
            >
              <div className="cal-event-title" style={{ color: COLOR_MANUAL.text }}>
                {a.time ? `${formatTime(a.time)} · ` : ''}{a.title}
              </div>
              {a.notes && <div className="cal-event-sub">{a.notes}</div>}
            </div>
          ))}
        </div>
      )}

      <button className="cal-add-btn" onClick={() => onAdd(date)}>+ Adicionar apontamento</button>
    </div>
  )
}

// ── Main Calendar ────────────────────────────────────────────────────────────
export default function Calendar() {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [appointments, setAppointments] = useState([])
  const [leads, setLeads] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [modal, setModal] = useState(null) // null | { mode: 'new'|'edit', data }
  const [loading, setLoading] = useState(false)

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`

  const loadAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/admin/calendar/appointments?month=${monthKey}`, { headers: AUTH() })
      const data = await r.json()
      setAppointments(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [monthKey])

  // Load leads once (all of them — filter by date in render)
  useEffect(() => {
    fetch('/api/admin/leads', { headers: AUTH() })
      .then(r => r.json())
      .then(data => setLeads(Array.isArray(data) ? data.filter(l => l.preferredDate) : []))
      .catch(() => {})
  }, [])

  useEffect(() => { loadAppointments() }, [loadAppointments])

  // Build event map: { 'YYYY-MM-DD': [events] }
  const eventMap = {}
  appointments.forEach(a => {
    if (!eventMap[a.date]) eventMap[a.date] = []
    eventMap[a.date].push({ ...a, _type: 'manual' })
  })
  leads.forEach(l => {
    const d = l.preferredDate
    if (!d) return
    if (!eventMap[d]) eventMap[d] = []
    eventMap[d].push({ ...l, _type: 'lead' })
  })

  const grid = buildGrid(year, month)
  const todayYMD = toYMD(today)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  async function handleSave(data) {
    if (data.id) {
      await fetch(`/api/admin/calendar/appointments/${data.id}`, {
        method: 'PUT', headers: JSON_AUTH(), body: JSON.stringify(data)
      })
    } else {
      await fetch('/api/admin/calendar/appointments', {
        method: 'POST', headers: JSON_AUTH(), body: JSON.stringify(data)
      })
    }
    setModal(null)
    await loadAppointments()
  }

  async function handleDelete(id) {
    await fetch(`/api/admin/calendar/appointments/${id}`, { method: 'DELETE', headers: AUTH() })
    setModal(null)
    setSelectedDate(null)
    await loadAppointments()
  }

  const selectedEvents = selectedDate ? (eventMap[selectedDate] || []) : []

  return (
    <>
      <style>{`
        .cal-wrap { display: flex; gap: 0; height: calc(100vh - 0px); overflow: hidden; }
        .cal-main { flex: 1; padding: 2rem; overflow-y: auto; min-width: 0; }
        .cal-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .cal-header h2 { font-size: 1.25rem; font-weight: 600; color: #2d2d2d; }
        .cal-month-nav { display: flex; align-items: center; gap: 0.5rem; }
        .cal-nav-btn { background: none; border: 1px solid #ddd; border-radius: 3px; padding: 4px 10px; cursor: pointer; font-size: 1rem; color: #555; }
        .cal-nav-btn:hover { background: #f0ede8; }
        .cal-month-label { font-size: 1rem; font-weight: 600; color: #2d2d2d; min-width: 160px; text-align: center; }
        .cal-today-btn { margin-left: auto; padding: 0.4rem 0.9rem; border: 1px solid #555b37; background: transparent; color: #555b37; border-radius: 3px; font-size: 0.8rem; font-weight: 600; cursor: pointer; font-family: inherit; }
        .cal-today-btn:hover { background: #555b37; color: #fff; }
        .cal-legend { display: flex; gap: 1.25rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .cal-legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: #666; }
        .cal-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); border-left: 1px solid #e8e5df; border-top: 1px solid #e8e5df; }
        .cal-dow { padding: 0.4rem; text-align: center; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #999; background: #f8f7f4; border-right: 1px solid #e8e5df; border-bottom: 1px solid #e8e5df; }
        .cal-cell { min-height: 90px; padding: 0.3rem; border-right: 1px solid #e8e5df; border-bottom: 1px solid #e8e5df; cursor: pointer; transition: background 0.1s; position: relative; }
        .cal-cell:hover { background: #f8f7f4; }
        .cal-cell--other { background: #fbfaf8; }
        .cal-cell--today .cal-cell-num { background: #555b37; color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; }
        .cal-cell--selected { background: #f0ede8 !important; outline: 2px solid #555b37; outline-offset: -2px; }
        .cal-cell-num { font-size: 0.78rem; font-weight: 500; color: #2d2d2d; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; margin-bottom: 2px; }
        .cal-cell--other .cal-cell-num { color: #ccc; }
        .cal-event-pip { font-size: 0.67rem; border-radius: 2px; padding: 1px 4px; margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .cal-more { font-size: 0.65rem; color: #999; padding-left: 2px; }
        /* Day panel */
        .cal-day-panel { width: 300px; flex-shrink: 0; border-left: 1px solid #e8e5df; background: #faf9f5; padding: 1.25rem; overflow-y: auto; }
        .cal-day-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .cal-day-panel-date { font-size: 0.95rem; font-weight: 600; color: #2d2d2d; }
        .cal-day-panel-close { background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #999; line-height: 1; padding: 2px 6px; }
        .cal-day-panel-close:hover { color: #333; }
        .cal-day-empty { font-size: 0.82rem; color: #bbb; margin-bottom: 1rem; }
        .cal-day-section { margin-bottom: 1rem; }
        .cal-day-section-label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.5rem; }
        .cal-event-card { border-left: 3px solid; border-radius: 3px; padding: 0.5rem 0.6rem; margin-bottom: 0.4rem; }
        .cal-event-card--click { cursor: pointer; }
        .cal-event-card--click:hover { filter: brightness(0.97); }
        .cal-event-title { font-size: 0.82rem; font-weight: 600; margin-bottom: 2px; }
        .cal-event-sub { font-size: 0.75rem; color: #666; margin-top: 1px; }
        .cal-add-btn { margin-top: 0.75rem; width: 100%; padding: 0.5rem; background: transparent; border: 1px dashed #bbb; border-radius: 3px; font-family: inherit; font-size: 0.8rem; color: #888; cursor: pointer; }
        .cal-add-btn:hover { border-color: #555b37; color: #555b37; background: #f5f4f0; }
        /* Modal */
        .cal-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .cal-modal { background: #faf9f5; max-width: 460px; width: 100%; border-radius: 3px; padding: 1.75rem; position: relative; }
        .cal-modal-close { position: absolute; top: 0.75rem; right: 0.75rem; background: none; border: none; cursor: pointer; font-size: 1.3rem; color: #999; padding: 2px 8px; }
        .cal-modal-close:hover { color: #333; }
        .cal-modal-title { font-size: 1rem; font-weight: 600; color: #2d2d2d; margin-bottom: 1.25rem; }
        .cal-field { margin-bottom: 1rem; }
        .cal-field label { display: block; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #777; margin-bottom: 0.3rem; }
        .cal-field input, .cal-field textarea, .cal-field select { width: 100%; padding: 0.5rem 0.65rem; border: 1px solid #ddd; border-radius: 3px; font-family: inherit; font-size: 0.88rem; background: #fff; }
        .cal-field input:focus, .cal-field textarea:focus { outline: none; border-color: #555b37; }
        .cal-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .cal-modal-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.25rem; flex-wrap: wrap; }
        .cal-btn-save { padding: 0.5rem 1.2rem; background: #555b37; border: none; color: #fff; border-radius: 3px; font-size: 0.84rem; font-weight: 600; cursor: pointer; font-family: inherit; }
        .cal-btn-save:hover:not(:disabled) { background: #444e2b; }
        .cal-btn-save:disabled { opacity: 0.6; cursor: default; }
        .cal-btn-cancel { padding: 0.5rem 1rem; background: transparent; border: 1px solid #ddd; color: #666; border-radius: 3px; font-size: 0.84rem; cursor: pointer; font-family: inherit; }
        .cal-btn-del { padding: 0.5rem 1rem; background: transparent; border: 1px solid #ddd; color: #c0392b; border-radius: 3px; font-size: 0.84rem; cursor: pointer; font-family: inherit; margin-right: auto; }
        .cal-btn-del:hover { background: #c0392b; color: #fff; border-color: #c0392b; }
        @media (max-width: 768px) {
          .cal-wrap { flex-direction: column; }
          .cal-day-panel { width: 100%; border-left: none; border-top: 1px solid #e8e5df; }
        }
      `}</style>

      <div className="cal-wrap">
        <div className="cal-main">
          <div className="cal-header">
            <h2>Calendário</h2>
            <div className="cal-month-nav">
              <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
              <span className="cal-month-label">{MONTHS_PT[month]} {year}</span>
              <button className="cal-nav-btn" onClick={nextMonth}>›</button>
            </div>
            <button className="cal-today-btn" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDate(todayYMD) }}>
              Hoje
            </button>
          </div>

          <div className="cal-legend">
            <div className="cal-legend-item"><span className="cal-dot" style={{ background: COLOR_LEAD.dot }} />Pedidos Web</div>
            <div className="cal-legend-item"><span className="cal-dot" style={{ background: COLOR_MANUAL.dot }} />Apontamentos</div>
          </div>

          <div className="cal-grid">
            {DAYS_PT.map(d => <div key={d} className="cal-dow">{d}</div>)}
            {grid.map(cell => {
              const events = eventMap[cell.date] || []
              const isToday = cell.date === todayYMD
              const isSelected = cell.date === selectedDate
              const leads = events.filter(e => e._type === 'lead')
              const appts = events.filter(e => e._type === 'manual')
              const shown = [...leads.slice(0, 2), ...appts.slice(0, 2 - Math.min(leads.length, 2))].slice(0, 3)
              const more = events.length - shown.length

              return (
                <div
                  key={cell.date}
                  className={`cal-cell${!cell.current ? ' cal-cell--other' : ''}${isToday ? ' cal-cell--today' : ''}${isSelected ? ' cal-cell--selected' : ''}`}
                  onClick={() => setSelectedDate(cell.date)}
                >
                  <div className="cal-cell-num">{parseInt(cell.date.split('-')[2])}</div>
                  {shown.map((ev, i) => {
                    const c = ev._type === 'lead' ? COLOR_LEAD : COLOR_MANUAL
                    const label = ev._type === 'lead' ? (ev.name || 'Pedido') : ev.title
                    return (
                      <div key={i} className="cal-event-pip" style={{ background: c.bg, color: c.text, borderLeft: `2px solid ${c.border}` }}>
                        {ev._type === 'lead' ? '🌐 ' : ''}{label}
                      </div>
                    )
                  })}
                  {more > 0 && <div className="cal-more">+{more} mais</div>}
                </div>
              )
            })}
          </div>
        </div>

        {selectedDate && (
          <DayPanel
            date={selectedDate}
            events={selectedEvents}
            onAdd={(date) => setModal({ mode: 'new', data: { date } })}
            onEditAppt={(a) => setModal({ mode: 'edit', data: a })}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </div>

      {modal && (
        <AppointmentModal
          initial={modal.data}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
