import { useState, useEffect, useCallback } from 'react'

const AUTH = () => ({ 'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}` })
const JSON_AUTH = () => ({ ...AUTH(), 'Content-Type': 'application/json' })

const COLUMNS = [
  { id: 'todo',    label: 'A Fazer' },
  { id: 'ongoing', label: 'Em Curso' },
  { id: 'done',    label: 'Concluído' },
]

const PRIORITIES = [
  { id: 'urgent', label: 'Urgente', color: '#9b2020', bg: '#fdecea', border: '#e57373' },
  { id: 'medium', label: 'Médio',   color: '#8a5700', bg: '#fff8e1', border: '#ffc107' },
  { id: 'low',    label: 'Baixo',   color: '#2d6a40', bg: '#e8f5ee', border: '#66bb6a' },
]

function getPriority(id) {
  return PRIORITIES.find(p => p.id === id) || PRIORITIES[1]
}

// ── Task Modal ───────────────────────────────────────────────────────────────
function TaskModal({ initial, defaultStatus, onSave, onDelete, onClose }) {
  const isEdit = !!initial?.id
  const [title,    setTitle]    = useState(initial?.title    || '')
  const [notes,    setNotes]    = useState(initial?.notes    || '')
  const [status,   setStatus]   = useState(initial?.status   || defaultStatus || 'todo')
  const [priority, setPriority] = useState(initial?.priority || 'medium')
  const [saving,   setSaving]   = useState(false)

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    await onSave({ id: initial?.id, title: title.trim(), notes, status, priority })
    setSaving(false)
  }

  async function handleDelete() {
    if (!window.confirm(`Apagar "${title}"?`)) return
    await onDelete(initial.id)
  }

  return (
    <div className="prj-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="prj-modal">
        <button className="prj-modal-close" onClick={onClose}>×</button>
        <h3 className="prj-modal-title">{isEdit ? 'Editar tarefa' : 'Nova tarefa'}</h3>

        <div className="prj-field">
          <label>Título *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Descrição da tarefa" autoFocus />
        </div>

        <div className="prj-field-row">
          <div className="prj-field">
            <label>Estado</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="prj-field">
            <label>Prioridade</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div className="prj-field">
          <label>Notas</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observações..." rows={3} />
        </div>

        <div className="prj-modal-actions">
          {isEdit && <button className="prj-btn-del" onClick={handleDelete}>Apagar</button>}
          <button className="prj-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="prj-btn-save" onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Project Modal ────────────────────────────────────────────────────────────
function ProjectModal({ initial, onSave, onClose }) {
  const [title,       setTitle]       = useState(initial?.title       || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [saving,      setSaving]      = useState(false)

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    await onSave({ id: initial?.id, title: title.trim(), description })
    setSaving(false)
  }

  return (
    <div className="prj-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="prj-modal">
        <button className="prj-modal-close" onClick={onClose}>×</button>
        <h3 className="prj-modal-title">{initial?.id ? 'Editar projeto' : 'Novo projeto'}</h3>

        <div className="prj-field">
          <label>Nome do projeto *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Jardim Privado — Lisboa" autoFocus />
        </div>
        <div className="prj-field">
          <label>Descrição</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve descrição..." rows={3} />
        </div>

        <div className="prj-modal-actions">
          <button className="prj-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="prj-btn-save" onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Board View ───────────────────────────────────────────────────────────────
function Board({ project, onBack, onEditProject }) {
  const [tasks,     setTasks]     = useState([])
  const [taskModal, setTaskModal] = useState(null)
  const [dragId,    setDragId]    = useState(null)
  const [dragOver,  setDragOver]  = useState(null)

  const loadTasks = useCallback(async () => {
    const r = await fetch(`/api/admin/projects/${project.id}/tasks`, { headers: AUTH() })
    const data = await r.json()
    setTasks(Array.isArray(data) ? data : [])
  }, [project.id])

  useEffect(() => { loadTasks() }, [loadTasks])

  async function handleSaveTask(data) {
    if (data.id) {
      await fetch(`/api/admin/projects/${project.id}/tasks/${data.id}`, {
        method: 'PUT', headers: JSON_AUTH(), body: JSON.stringify(data)
      })
    } else {
      await fetch(`/api/admin/projects/${project.id}/tasks`, {
        method: 'POST', headers: JSON_AUTH(), body: JSON.stringify(data)
      })
    }
    setTaskModal(null)
    await loadTasks()
  }

  async function handleDeleteTask(taskId) {
    await fetch(`/api/admin/projects/${project.id}/tasks/${taskId}`, {
      method: 'DELETE', headers: AUTH()
    })
    setTaskModal(null)
    await loadTasks()
  }

  async function handleMoveTask(task, direction) {
    const idx = COLUMNS.findIndex(c => c.id === task.status)
    const next = COLUMNS[idx + direction]
    if (!next) return
    await fetch(`/api/admin/projects/${project.id}/tasks/${task.id}`, {
      method: 'PUT', headers: JSON_AUTH(),
      body: JSON.stringify({ ...task, status: next.id })
    })
    await loadTasks()
  }

  async function handleDrop(e, newStatus) {
    e.preventDefault()
    setDragOver(null)
    if (!dragId) return
    const task = tasks.find(t => t.id === dragId)
    if (!task || task.status === newStatus) { setDragId(null); return }
    await fetch(`/api/admin/projects/${project.id}/tasks/${dragId}`, {
      method: 'PUT', headers: JSON_AUTH(),
      body: JSON.stringify({ ...task, status: newStatus })
    })
    setDragId(null)
    await loadTasks()
  }

  const todoCount    = tasks.filter(t => t.status === 'todo').length
  const ongoingCount = tasks.filter(t => t.status === 'ongoing').length
  const doneCount    = tasks.filter(t => t.status === 'done').length

  return (
    <div className="prj-board-wrap">
      <div className="prj-board-topbar">
        <button className="prj-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Projetos
        </button>
        <div className="prj-board-info">
          <h2 className="prj-board-title">{project.title}</h2>
          {project.description && <p className="prj-board-desc">{project.description}</p>}
        </div>
        <button className="prj-edit-project-btn" onClick={onEditProject}>Editar projeto</button>
      </div>

      <div className="prj-board-stats">
        <span className="prj-stat"><span className="prj-stat-num">{todoCount}</span> a fazer</span>
        <span className="prj-stat-sep">·</span>
        <span className="prj-stat"><span className="prj-stat-num">{ongoingCount}</span> em curso</span>
        <span className="prj-stat-sep">·</span>
        <span className="prj-stat prj-stat--done"><span className="prj-stat-num">{doneCount}</span> concluídas</span>
      </div>

      <div className="prj-columns">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id)
          const isOver   = dragOver === col.id

          return (
            <div
              key={col.id}
              className={`prj-column prj-column--${col.id}${isOver ? ' prj-column--dragover' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, col.id)}
            >
              <div className="prj-col-header">
                <span className="prj-col-dot prj-col-dot--${col.id}" />
                <span className="prj-col-title">{col.label}</span>
                <span className="prj-col-count">{colTasks.length}</span>
              </div>

              <div className="prj-col-cards">
                {colTasks.map(task => {
                  const pri     = getPriority(task.priority)
                  const colIdx  = COLUMNS.findIndex(c => c.id === col.id)
                  const canPrev = colIdx > 0
                  const canNext = colIdx < COLUMNS.length - 1
                  return (
                    <div
                      key={task.id}
                      className={`prj-card${dragId === task.id ? ' prj-card--dragging' : ''}`}
                      draggable
                      onDragStart={e => { setDragId(task.id); e.dataTransfer.effectAllowed = 'move' }}
                      onDragEnd={() => setDragId(null)}
                      onClick={() => setTaskModal({ data: task })}
                    >
                      <div className="prj-card-title">{task.title}</div>
                      {task.notes && <div className="prj-card-notes">{task.notes}</div>}
                      <div className="prj-card-footer">
                        <span
                          className="prj-badge"
                          style={{ background: pri.bg, color: pri.color, borderColor: pri.border }}
                        >
                          {pri.label}
                        </span>
                        <div className="prj-card-moves">
                          {canPrev && (
                            <button
                              className="prj-move-btn"
                              title={`Mover para ${COLUMNS[colIdx - 1].label}`}
                              onClick={e => { e.stopPropagation(); handleMoveTask(task, -1) }}
                            >‹</button>
                          )}
                          {canNext && (
                            <button
                              className="prj-move-btn prj-move-btn--next"
                              title={`Mover para ${COLUMNS[colIdx + 1].label}`}
                              onClick={e => { e.stopPropagation(); handleMoveTask(task, 1) }}
                            >›</button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                className="prj-add-card-btn"
                onClick={() => setTaskModal({ defaultStatus: col.id })}
              >
                + Adicionar
              </button>
            </div>
          )
        })}
      </div>

      {taskModal && (
        <TaskModal
          initial={taskModal.data}
          defaultStatus={taskModal.defaultStatus}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setTaskModal(null)}
        />
      )}
    </div>
  )
}

// ── CSS ──────────────────────────────────────────────────────────────────────
const STYLES = `
  .prj-wrap { padding: 2rem; max-width: 1100px; }
  .prj-list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; }
  .prj-list-title { font-size: 1.25rem; font-weight: 600; color: #2d2d2d; }
  .prj-new-btn { padding: 0.5rem 1.1rem; background: #555b37; border: none; color: #fff; border-radius: 3px; font-size: 0.84rem; font-weight: 600; cursor: pointer; font-family: inherit; }
  .prj-new-btn:hover { background: #444e2b; }

  /* Project grid */
  .prj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
  .prj-project-card { background: #fff; border: 1px solid #e8e5df; border-radius: 6px; overflow: hidden; transition: box-shadow 0.15s; }
  .prj-project-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
  .prj-project-card-body { padding: 1.25rem 1.25rem 0.75rem; cursor: pointer; }
  .prj-project-name { font-size: 0.95rem; font-weight: 600; color: #2d2d2d; margin-bottom: 0.35rem; }
  .prj-project-desc { font-size: 0.8rem; color: #888; line-height: 1.45; margin-bottom: 0.5rem; }
  .prj-project-meta { font-size: 0.72rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; }
  .prj-project-actions { display: flex; gap: 0.5rem; padding: 0.75rem 1.25rem; border-top: 1px solid #f0ede8; }
  .prj-project-actions button { padding: 0.3rem 0.75rem; border: 1px solid #ddd; border-radius: 3px; background: transparent; font-family: inherit; font-size: 0.78rem; cursor: pointer; color: #666; }
  .prj-project-actions button:hover { background: #f8f7f4; }
  .prj-project-actions button.danger { color: #c0392b; border-color: #e0b0b0; }
  .prj-project-actions button.danger:hover { background: #fdecea; }

  /* Empty state */
  .prj-empty { text-align: center; padding: 4rem 2rem; color: #bbb; }
  .prj-empty p { margin-bottom: 1rem; font-size: 0.9rem; }
  .prj-loading { color: #aaa; font-size: 0.88rem; padding: 2rem 0; }

  /* Board */
  .prj-board-wrap { display: flex; flex-direction: column; height: calc(100vh - 0px); overflow: hidden; }
  .prj-board-topbar { display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.75rem; border-bottom: 1px solid #e8e5df; background: #fff; flex-shrink: 0; }
  .prj-back-btn { display: flex; align-items: center; gap: 0.3rem; background: none; border: none; cursor: pointer; color: #888; font-size: 0.82rem; font-family: inherit; font-weight: 500; padding: 4px 8px; border-radius: 3px; flex-shrink: 0; }
  .prj-back-btn:hover { background: #f0ede8; color: #555b37; }
  .prj-board-info { flex: 1; min-width: 0; }
  .prj-board-title { font-size: 1.05rem; font-weight: 600; color: #2d2d2d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .prj-board-desc { font-size: 0.78rem; color: #999; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .prj-edit-project-btn { padding: 0.35rem 0.9rem; border: 1px solid #ddd; border-radius: 3px; background: transparent; font-family: inherit; font-size: 0.78rem; cursor: pointer; color: #666; white-space: nowrap; flex-shrink: 0; }
  .prj-edit-project-btn:hover { background: #f8f7f4; }

  .prj-board-stats { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.75rem; background: #faf9f5; border-bottom: 1px solid #e8e5df; font-size: 0.78rem; color: #aaa; flex-shrink: 0; }
  .prj-stat { display: flex; align-items: center; gap: 0.3rem; }
  .prj-stat-num { font-weight: 600; color: #666; }
  .prj-stat--done .prj-stat-num { color: #2d6a40; }
  .prj-stat-sep { color: #ddd; }

  /* Columns */
  .prj-columns { display: flex; gap: 0; flex: 1; overflow: hidden; }
  .prj-column { flex: 1; display: flex; flex-direction: column; border-right: 1px solid #e8e5df; min-width: 0; }
  .prj-column:last-child { border-right: none; }
  .prj-column--dragover { background: #f5f9f1; }

  .prj-col-header { display: flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1rem 0.7rem; border-bottom: 1px solid #e8e5df; flex-shrink: 0; }
  .prj-col-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #888; flex: 1; }
  .prj-column--todo .prj-col-title { color: #6b7280; }
  .prj-column--ongoing .prj-col-title { color: #8a5700; }
  .prj-column--done .prj-col-title { color: #2d6a40; }
  .prj-col-count { font-size: 0.72rem; background: #f0ede8; color: #999; border-radius: 10px; padding: 1px 7px; font-weight: 600; }

  .prj-col-cards { flex: 1; overflow-y: auto; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }

  /* Task card */
  .prj-card { background: #fff; border: 1px solid #e8e5df; border-radius: 5px; padding: 0.7rem 0.8rem; cursor: pointer; transition: box-shadow 0.12s; user-select: none; }
  .prj-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-color: #d0cdc8; }
  .prj-card--dragging { opacity: 0.45; }
  .prj-card-title { font-size: 0.84rem; font-weight: 500; color: #2d2d2d; margin-bottom: 4px; line-height: 1.4; }
  .prj-card-notes { font-size: 0.75rem; color: #aaa; margin-bottom: 6px; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .prj-badge { display: inline-block; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 2px 7px; border-radius: 10px; border: 1px solid; }

  .prj-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
  .prj-card-moves { display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; }
  .prj-card:hover .prj-card-moves { opacity: 1; }
  .prj-move-btn { background: #f0ede8; border: 1px solid #ddd; border-radius: 3px; width: 24px; height: 24px; cursor: pointer; font-size: 1rem; line-height: 1; color: #888; display: flex; align-items: center; justify-content: center; padding: 0; }
  .prj-move-btn:hover { background: #555b37; color: #fff; border-color: #555b37; }
  .prj-move-btn--next { font-weight: 700; }
  @media (max-width: 900px) { .prj-card-moves { opacity: 1; } }
  .prj-add-card-btn { margin: 0.5rem 0.75rem 0.75rem; padding: 0.45rem; background: transparent; border: 1px dashed #ddd; border-radius: 4px; font-family: inherit; font-size: 0.78rem; color: #bbb; cursor: pointer; }
  .prj-add-card-btn:hover { border-color: #555b37; color: #555b37; background: #f5f4f0; }

  /* Modal */
  .prj-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .prj-modal { background: #faf9f5; max-width: 460px; width: 100%; border-radius: 4px; padding: 1.75rem; position: relative; }
  .prj-modal-close { position: absolute; top: 0.75rem; right: 0.75rem; background: none; border: none; cursor: pointer; font-size: 1.3rem; color: #999; padding: 2px 8px; }
  .prj-modal-close:hover { color: #333; }
  .prj-modal-title { font-size: 1rem; font-weight: 600; color: #2d2d2d; margin-bottom: 1.25rem; }
  .prj-field { margin-bottom: 1rem; }
  .prj-field label { display: block; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #777; margin-bottom: 0.3rem; }
  .prj-field input, .prj-field textarea, .prj-field select { width: 100%; padding: 0.5rem 0.65rem; border: 1px solid #ddd; border-radius: 3px; font-family: inherit; font-size: 0.88rem; background: #fff; box-sizing: border-box; }
  .prj-field input:focus, .prj-field textarea:focus, .prj-field select:focus { outline: none; border-color: #555b37; }
  .prj-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .prj-modal-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.25rem; flex-wrap: wrap; }
  .prj-btn-save { padding: 0.5rem 1.2rem; background: #555b37; border: none; color: #fff; border-radius: 3px; font-size: 0.84rem; font-weight: 600; cursor: pointer; font-family: inherit; }
  .prj-btn-save:hover:not(:disabled) { background: #444e2b; }
  .prj-btn-save:disabled { opacity: 0.6; cursor: default; }
  .prj-btn-cancel { padding: 0.5rem 1rem; background: transparent; border: 1px solid #ddd; color: #666; border-radius: 3px; font-size: 0.84rem; cursor: pointer; font-family: inherit; }
  .prj-btn-del { padding: 0.5rem 1rem; background: transparent; border: 1px solid #ddd; color: #c0392b; border-radius: 3px; font-size: 0.84rem; cursor: pointer; font-family: inherit; margin-right: auto; }
  .prj-btn-del:hover { background: #c0392b; color: #fff; border-color: #c0392b; }

  @media (max-width: 768px) {
    .prj-columns { flex-direction: column; overflow-y: auto; }
    .prj-column { border-right: none; border-bottom: 1px solid #e8e5df; min-height: 200px; }
    .prj-col-cards { max-height: 300px; }
  }
`

// ── Main Component ───────────────────────────────────────────────────────────
export default function Projects() {
  const [projects,      setProjects]      = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [projectModal,  setProjectModal]  = useState(null)
  const [loading,       setLoading]       = useState(true)

  const loadProjects = useCallback(async () => {
    const r = await fetch('/api/admin/projects', { headers: AUTH() })
    const data = await r.json()
    setProjects(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { loadProjects() }, [loadProjects])

  async function handleSaveProject(data) {
    if (data.id) {
      await fetch(`/api/admin/projects/${data.id}`, {
        method: 'PUT', headers: JSON_AUTH(), body: JSON.stringify(data)
      })
      // Update activeProject title/desc if we're currently viewing it
      if (activeProject?.id === data.id) {
        setActiveProject(prev => ({ ...prev, ...data }))
      }
    } else {
      await fetch('/api/admin/projects', {
        method: 'POST', headers: JSON_AUTH(), body: JSON.stringify(data)
      })
    }
    setProjectModal(null)
    await loadProjects()
  }

  async function handleDeleteProject(id) {
    if (!window.confirm('Apagar este projeto e todas as suas tarefas?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE', headers: AUTH() })
    await loadProjects()
  }

  if (activeProject) {
    return (
      <>
        <style>{STYLES}</style>
        <Board
          project={activeProject}
          onBack={() => setActiveProject(null)}
          onEditProject={() => setProjectModal({ data: activeProject })}
        />
        {projectModal && (
          <ProjectModal
            initial={projectModal.data}
            onSave={handleSaveProject}
            onClose={() => setProjectModal(null)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="prj-wrap">
        <div className="prj-list-header">
          <h2 className="prj-list-title">Projetos</h2>
          <button className="prj-new-btn" onClick={() => setProjectModal({ mode: 'new' })}>+ Novo Projeto</button>
        </div>

        {loading && <p className="prj-loading">A carregar...</p>}

        {!loading && projects.length === 0 && (
          <div className="prj-empty">
            <p>Nenhum projeto ainda.</p>
            <button className="prj-new-btn" onClick={() => setProjectModal({ mode: 'new' })}>Criar primeiro projeto</button>
          </div>
        )}

        <div className="prj-grid">
          {projects.map(p => (
            <div key={p.id} className="prj-project-card">
              <div className="prj-project-card-body" onClick={() => setActiveProject(p)}>
                <h3 className="prj-project-name">{p.title}</h3>
                {p.description && <p className="prj-project-desc">{p.description}</p>}
                <div className="prj-project-meta">{p.task_count || 0} {p.task_count === 1 ? 'tarefa' : 'tarefas'}</div>
              </div>
              <div className="prj-project-actions">
                <button onClick={() => setProjectModal({ data: p })}>Editar</button>
                <button className="danger" onClick={() => handleDeleteProject(p.id)}>Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {projectModal && (
        <ProjectModal
          initial={projectModal.data}
          onSave={handleSaveProject}
          onClose={() => setProjectModal(null)}
        />
      )}
    </>
  )
}
