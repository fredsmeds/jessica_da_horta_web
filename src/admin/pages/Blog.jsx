import { useState, useEffect } from 'react'
import BlogEditor from './BlogEditor.jsx'

const API = (path) => `/api/admin/blog${path}`
const authHeader = () => ({ 'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}` })

const STATUS_LABEL = { draft: 'Rascunho', published: 'Publicado' }
const STATUS_COLOR = { draft: '#b0870a', published: '#2e7d32' }

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Blog() {
  const [view, setView] = useState('list') // 'list' | 'new' | 'edit'
  const [editId, setEditId] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  function loadPosts() {
    setLoading(true)
    fetch(API('/posts'), { headers: authHeader() })
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadPosts() }, [])

  function handleDelete(id, title) {
    if (!window.confirm(`Apagar "${title}"?`)) return
    fetch(API(`/posts/${id}`), { method: 'DELETE', headers: authHeader() })
      .then(() => loadPosts())
  }

  function handleDone() {
    setView('list')
    setEditId(null)
    loadPosts()
  }

  if (view === 'new') return <BlogEditor postId={null} onDone={handleDone} />
  if (view === 'edit') return <BlogEditor postId={editId} onDone={handleDone} />

  return (
    <>
      <style>{`
        .blog-list { padding: 2rem; max-width: 900px; }
        .blog-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
        .blog-list-header h2 { font-size: 1.25rem; font-weight: 600; color: #2d2d2d; }
        .btn-new-post { padding: 0.55rem 1.2rem; background: #555b37; border: none; color: #fff; border-radius: 4px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-new-post:hover { background: #444e2b; }
        .blog-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .blog-table th { background: #f5f4f1; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #777; padding: 0.7rem 1rem; text-align: left; border-bottom: 1px solid #e8e5df; }
        .blog-table td { padding: 0.85rem 1rem; font-size: 0.86rem; color: #2d2d2d; border-bottom: 1px solid #f0ede8; vertical-align: middle; }
        .blog-table tr:last-child td { border-bottom: none; }
        .blog-table tr:hover td { background: #faf9f6; }
        .post-title { font-weight: 500; }
        .post-cat { font-size: 0.75rem; color: #777; margin-top: 2px; }
        .status-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
        .post-actions { display: flex; gap: 0.5rem; }
        .btn-edit, .btn-del { padding: 4px 10px; border-radius: 3px; font-size: 0.78rem; font-weight: 500; cursor: pointer; font-family: inherit; border: 1px solid; }
        .btn-edit { background: transparent; border-color: #555b37; color: #555b37; }
        .btn-edit:hover { background: #555b37; color: #fff; }
        .btn-del { background: transparent; border-color: #ccc; color: #999; }
        .btn-del:hover { background: #c0392b; border-color: #c0392b; color: #fff; }
        .blog-empty { text-align: center; padding: 3rem; color: #999; font-size: 0.9rem; }
      `}</style>

      <div className="blog-list">
        <div className="blog-list-header">
          <h2>Blog</h2>
          <button className="btn-new-post" onClick={() => setView('new')}>+ Novo Artigo</button>
        </div>

        {loading ? (
          <p style={{ color: '#999', fontSize: '0.9rem' }}>A carregar...</p>
        ) : posts.length === 0 ? (
          <div className="blog-empty">Ainda não há artigos. Cria o primeiro!</div>
        ) : (
          <table className="blog-table">
            <thead>
              <tr>
                <th>Artigo</th>
                <th>Estado</th>
                <th>Publicado</th>
                <th>Atualizado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="post-title">{p.title}</div>
                    {p.category_name && <div className="post-cat">{p.category_name}</div>}
                  </td>
                  <td>
                    <span className="status-badge" style={{ background: STATUS_COLOR[p.status] + '18', color: STATUS_COLOR[p.status] }}>
                      {STATUS_LABEL[p.status] || p.status}
                    </span>
                  </td>
                  <td>{formatDate(p.published_at)}</td>
                  <td>{formatDate(p.updated_at)}</td>
                  <td>
                    <div className="post-actions">
                      <button className="btn-edit" onClick={() => { setEditId(p.id); setView('edit') }}>Editar</button>
                      <button className="btn-del" onClick={() => handleDelete(p.id, p.title)}>Apagar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
