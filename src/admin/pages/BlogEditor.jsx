import { useState, useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

const API = (path) => `/api/admin/blog${path}`
const authHeaders = () => ({
  'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}`,
  'Content-Type': 'application/json',
})

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        padding: '5px 8px',
        background: active ? '#555b37' : 'transparent',
        color: active ? '#fff' : '#333',
        border: '1px solid',
        borderColor: active ? '#555b37' : '#ddd',
        borderRadius: 3,
        cursor: 'pointer',
        fontSize: 13,
        lineHeight: 1,
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  )
}

const LANGS = [
  { id: 'pt', label: 'PT' },
  { id: 'en', label: 'EN' },
  { id: 'es', label: 'ES' },
]

export default function BlogEditor({ postId, onDone }) {
  const [categories, setCategories] = useState([])
  const [editorLang, setEditorLang] = useState('pt')
  const [titles,   setTitles]   = useState({ pt: '', en: '', es: '' })
  const [excerpts, setExcerpts] = useState({ pt: '', en: '', es: '' })
  const [bodies,   setBodies]   = useState({ pt: '', en: '', es: '' })
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('draft')
  const [coverImage, setCoverImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const coverInputRef = useRef()
  const imgInputRef = useRef()
  const switchingLang = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Escreve o conteúdo aqui...' }),
    ],
    content: '',
    onUpdate: ({ editor: e }) => {
      if (switchingLang.current) return
      setBodies(prev => ({ ...prev, [editorLang]: e.getHTML() }))
    },
  })

  useEffect(() => {
    fetch(API('/categories'), { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}` } })
      .then(r => r.json()).then(setCategories)
  }, [])

  useEffect(() => {
    if (!postId || !editor) return
    fetch(API(`/posts/${postId}`), { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jdh_admin_token')}` } })
      .then(r => r.json())
      .then(post => {
        setTitles({ pt: post.title || '', en: post.title_en || '', es: post.title_es || '' })
        setExcerpts({ pt: post.excerpt || '', en: post.excerpt_en || '', es: post.excerpt_es || '' })
        const b = { pt: post.body || '', en: post.body_en || '', es: post.body_es || '' }
        setBodies(b)
        setCategoryId(post.category_id ? String(post.category_id) : '')
        setStatus(post.status)
        setCoverImage(post.cover_image || '')
        switchingLang.current = true
        editor.commands.setContent(b.pt)
        setTimeout(() => { switchingLang.current = false }, 50)
      })
  }, [postId, editor])

  function switchLang(newLang) {
    if (newLang === editorLang || !editor) return
    switchingLang.current = true
    setBodies(prev => ({ ...prev, [editorLang]: editor.getHTML() }))
    setEditorLang(newLang)
    editor.commands.setContent(bodies[newLang] || '')
    setTimeout(() => { switchingLang.current = false }, 50)
  }

  function handleCoverUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCoverImage(reader.result)
    reader.readAsDataURL(file)
  }

  function handleInlineImage(e) {
    const file = e.target.files[0]
    if (!file || !editor) return
    const reader = new FileReader()
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run()
    }
    reader.readAsDataURL(file)
  }

  const handleLink = useCallback(() => {
    const url = window.prompt('URL do link:')
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  async function handleSave(saveStatus) {
    if (!titles.pt.trim()) { setError('O título em PT é obrigatório.'); return }
    if (!editor) return
    // Save current editor content before submitting
    const currentBodies = { ...bodies, [editorLang]: editor.getHTML() }
    setSaving(true)
    setError('')
    const payload = {
      title:      titles.pt.trim(),
      body:       currentBodies.pt,
      excerpt:    excerpts.pt.trim(),
      title_en:   titles.en.trim(),
      title_es:   titles.es.trim(),
      excerpt_en: excerpts.en.trim(),
      excerpt_es: excerpts.es.trim(),
      body_en:    currentBodies.en,
      body_es:    currentBodies.es,
      cover_image: coverImage,
      category_id: categoryId ? parseInt(categoryId) : null,
      status: saveStatus,
    }
    try {
      const method = postId ? 'PUT' : 'POST'
      const url = postId ? API(`/posts/${postId}`) : API('/posts')
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Erro ao guardar')
      onDone()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!editor) return null

  return (
    <>
      <style>{`
        .blog-editor { max-width: 820px; padding: 2rem; }
        .blog-editor h2 { font-size: 1.25rem; font-weight: 600; color: #2d2d2d; margin-bottom: 1.5rem; }
        .blog-editor-field { margin-bottom: 1.25rem; }
        .blog-editor-field label { display: block; font-size: 0.78rem; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
        .blog-editor-field input, .blog-editor-field textarea, .blog-editor-field select {
          width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #ddd; border-radius: 4px;
          font-family: inherit; font-size: 0.9rem; background: #fff; color: #2d2d2d;
        }
        .blog-editor-field textarea { min-height: 80px; resize: vertical; }
        .blog-editor-field input:focus, .blog-editor-field textarea:focus, .blog-editor-field select:focus {
          outline: none; border-color: #555b37;
        }
        .cover-preview { margin-top: 0.5rem; max-height: 160px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
        .tiptap-toolbar {
          display: flex; flex-wrap: wrap; gap: 4px;
          padding: 8px; background: #f5f4f1; border: 1px solid #ddd;
          border-bottom: none; border-radius: 4px 4px 0 0;
        }
        .tiptap-toolbar-sep { width: 1px; background: #ddd; margin: 0 2px; }
        .tiptap-wrap .ProseMirror {
          border: 1px solid #ddd; border-radius: 0 0 4px 4px;
          padding: 1rem; min-height: 320px; outline: none;
          font-size: 0.92rem; line-height: 1.75; color: #2d2d2d;
        }
        .tiptap-wrap .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); color: #aaa; pointer-events: none; float: left; height: 0;
        }
        .tiptap-wrap .ProseMirror h2 { font-size: 1.3rem; font-weight: 700; margin: 1.2rem 0 0.5rem; }
        .tiptap-wrap .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.4rem; }
        .tiptap-wrap .ProseMirror ul, .tiptap-wrap .ProseMirror ol { padding-left: 1.4rem; margin: 0.5rem 0; }
        .tiptap-wrap .ProseMirror img { max-width: 100%; border-radius: 4px; margin: 0.75rem 0; }
        .tiptap-wrap .ProseMirror blockquote { border-left: 3px solid #555b37; padding-left: 1rem; color: #666; margin: 1rem 0; }
        .tiptap-wrap .ProseMirror a { color: #555b37; text-decoration: underline; }
        .blog-editor-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap; align-items: center; }
        .btn-save { padding: 0.55rem 1.4rem; background: #fff; border: 1px solid #555b37; color: #555b37; border-radius: 4px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-save:hover { background: #f5f4f1; }
        .btn-publish { padding: 0.55rem 1.4rem; background: #555b37; border: none; color: #fff; border-radius: 4px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-publish:hover { background: #444e2b; }
        .btn-back { padding: 0.55rem 1rem; background: transparent; border: 1px solid #ddd; color: #666; border-radius: 4px; font-size: 0.85rem; cursor: pointer; font-family: inherit; }
        .btn-back:hover { background: #f0ede8; }
        .blog-editor-error { color: #c0392b; font-size: 0.83rem; margin-top: 0.5rem; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } }
        .lang-tabs { display: flex; gap: 4px; margin-bottom: 1.25rem; }
        .lang-tab { padding: 0.35rem 1rem; border: 1px solid #ddd; border-radius: 3px; background: transparent; font-family: inherit; font-size: 0.8rem; font-weight: 600; cursor: pointer; color: #888; letter-spacing: 0.06em; }
        .lang-tab:hover { background: #f0ede8; color: #555b37; }
        .lang-tab.active { background: #555b37; color: #fff; border-color: #555b37; }
        .lang-note { font-size: 0.72rem; color: #aaa; margin-bottom: 1rem; font-style: italic; }
      `}</style>

      <div className="blog-editor">
        <h2>{postId ? 'Editar Artigo' : 'Novo Artigo'}</h2>

        <div className="two-col" style={{ marginBottom: '1.25rem' }}>
          <div className="blog-editor-field" style={{ marginBottom: 0 }}>
            <label>Categoria</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">— sem categoria —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="blog-editor-field" style={{ marginBottom: 0 }}>
            <label>Estado</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        <div className="blog-editor-field">
          <label>Imagem de capa</label>
          <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverUpload} style={{ padding: '0.3rem 0' }} />
          {coverImage && <img src={coverImage} alt="capa" className="cover-preview" />}
        </div>

        <div className="lang-tabs">
          {LANGS.map(l => (
            <button key={l.id} className={`lang-tab${editorLang === l.id ? ' active' : ''}`} onClick={() => switchLang(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
        {editorLang !== 'pt' && <p className="lang-note">Se deixar em branco, será mostrado o texto em PT no website.</p>}

        <div className="blog-editor-field">
          <label>Título {editorLang === 'pt' ? '*' : `(${editorLang.toUpperCase()})`}</label>
          <input
            value={titles[editorLang]}
            onChange={e => setTitles(prev => ({ ...prev, [editorLang]: e.target.value }))}
            placeholder="Título do artigo"
          />
        </div>

        <div className="blog-editor-field">
          <label>Excerto ({editorLang.toUpperCase()})</label>
          <textarea
            value={excerpts[editorLang]}
            onChange={e => setExcerpts(prev => ({ ...prev, [editorLang]: e.target.value }))}
            placeholder="Breve descrição que aparece na lista de artigos..."
          />
        </div>

        <div className="blog-editor-field">
          <label>Conteúdo *</label>
          <div className="tiptap-toolbar">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">B</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico"><em>I</em></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Sublinhado"><u>U</u></ToolbarBtn>
            <div className="tiptap-toolbar-sep" />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título H2">H2</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Título H3">H3</ToolbarBtn>
            <div className="tiptap-toolbar-sep" />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">• Lista</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">1. Lista</ToolbarBtn>
            <div className="tiptap-toolbar-sep" />
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Alinhar à esquerda">⬅</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrar">↔</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Alinhar à direita">➡</ToolbarBtn>
            <div className="tiptap-toolbar-sep" />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citação">"</ToolbarBtn>
            <ToolbarBtn onClick={handleLink} active={editor.isActive('link')} title="Link">🔗</ToolbarBtn>
            <div className="tiptap-toolbar-sep" />
            <ToolbarBtn onClick={() => imgInputRef.current.click()} title="Inserir imagem">🖼</ToolbarBtn>
            <input type="file" accept="image/*" ref={imgInputRef} onChange={handleInlineImage} style={{ display: 'none' }} />
            <div className="tiptap-toolbar-sep" />
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Desfazer">↩</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Refazer">↪</ToolbarBtn>
          </div>
          <div className="tiptap-wrap">
            <EditorContent editor={editor} />
          </div>
        </div>

        {error && <p className="blog-editor-error">{error}</p>}

        <div className="blog-editor-actions">
          <button className="btn-back" onClick={onDone} disabled={saving}>← Voltar</button>
          <button className="btn-save" onClick={() => handleSave('draft')} disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar Rascunho'}
          </button>
          <button className="btn-publish" onClick={() => handleSave('published')} disabled={saving}>
            {saving ? 'A publicar...' : '✓ Publicar'}
          </button>
        </div>
      </div>
    </>
  )
}
