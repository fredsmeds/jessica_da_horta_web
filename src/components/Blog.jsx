import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/index.jsx'

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
}

function PostModal({ post, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  return (
    <>
      <style>{`
        .post-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          z-index: 1000; display: flex; align-items: flex-start; justify-content: center;
          padding: 2rem 1rem; overflow-y: auto;
        }
        .post-modal {
          background: #faf9f5; max-width: 720px; width: 100%;
          border-radius: 2px; padding: 2.5rem; position: relative;
          margin: auto;
        }
        .post-modal-close {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none; cursor: pointer; color: #888;
          font-size: 1.4rem; line-height: 1; padding: 4px 8px;
        }
        .post-modal-close:hover { color: #333; }
        .post-modal-cat {
          font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: #555b37; margin-bottom: 0.5rem;
        }
        .post-modal-title { font-size: 1.6rem; font-weight: 700; line-height: 1.3; color: #2d2d2d; margin-bottom: 0.75rem; }
        .post-modal-date { font-size: 0.78rem; color: #999; margin-bottom: 1.5rem; }
        .post-modal-cover { width: 100%; max-height: 320px; object-fit: cover; border-radius: 2px; margin-bottom: 1.75rem; }
        .post-modal-body { font-size: 0.93rem; line-height: 1.85; color: #3d3d3d; }
        .post-modal-body h2 { font-size: 1.2rem; font-weight: 700; margin: 1.5rem 0 0.5rem; }
        .post-modal-body h3 { font-size: 1.05rem; font-weight: 600; margin: 1.25rem 0 0.4rem; }
        .post-modal-body p { margin-bottom: 1rem; }
        .post-modal-body ul, .post-modal-body ol { padding-left: 1.4rem; margin-bottom: 1rem; }
        .post-modal-body li { margin-bottom: 0.25rem; }
        .post-modal-body blockquote { border-left: 3px solid #555b37; padding-left: 1rem; color: #666; margin: 1rem 0; font-style: italic; }
        .post-modal-body img { max-width: 100%; border-radius: 2px; margin: 0.75rem 0; }
        .post-modal-body a { color: #555b37; text-decoration: underline; }
      `}</style>
      <div className="post-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div className="post-modal">
          <button className="post-modal-close" onClick={onClose} aria-label="Fechar">×</button>
          {post.category_name && <div className="post-modal-cat">{post.category_name}</div>}
          <h2 className="post-modal-title">{post.title}</h2>
          <div className="post-modal-date">{formatDate(post.published_at)}</div>
          {post.cover_image && <img src={post.cover_image} alt={post.title} className="post-modal-cover" />}
          <div className="post-modal-body" dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
      </div>
    </>
  )
}

export default function Blog() {
  const { t, lang } = useLanguage()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openPost, setOpenPost] = useState(null)
  const [loadingPost, setLoadingPost] = useState(false)

  useEffect(() => {
    fetch('/api/blog/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ lang })
    if (activeCategory) params.set('category', activeCategory)
    fetch(`/api/blog/posts?${params}`)
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeCategory, lang])

  function openFullPost(slug) {
    setLoadingPost(true)
    fetch(`/api/blog/posts/${slug}?lang=${lang}`)
      .then(r => r.json())
      .then(post => { setOpenPost(post); setLoadingPost(false) })
      .catch(() => setLoadingPost(false))
  }

  return (
    <section id="blog" className="blog section" style={{ backgroundImage: 'url(/1.10.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="container">
        <div className="blog__header">
          <p className="section-label">{t.blog.sectionLabel}</p>
          <h2 className="section-title">{t.blog.title}</h2>
          <p className="blog__intro">{t.blog.intro}</p>
        </div>

        {categories.length > 0 && (
          <div className="blog__filters">
            <button
              className={`blog__filter-btn${activeCategory === null ? ' active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              {t.blog.all}
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                className={`blog__filter-btn${activeCategory === c.slug ? ' active' : ''}`}
                onClick={() => setActiveCategory(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="blog__loading">{t.blog.loading}</p>
        ) : posts.length === 0 ? (
          <p className="blog__empty">{t.blog.empty}</p>
        ) : (
          <div className="blog__list">
            {posts.map((post, i) => (
              <>
                <article key={post.id} className="blog__card" onClick={() => openFullPost(post.slug)}>
                  {post.cover_image
                    ? <div className="blog__card-img"><img src={post.cover_image} alt={post.title} /></div>
                    : <div className="blog__card-img blog__card-img--placeholder" />
                  }
                  <div className="blog__card-body">
                    {post.category_name && <span className="blog__card-cat">{post.category_name}</span>}
                    <h3 className="blog__card-title">{post.title}</h3>
                    {post.excerpt && <p className="blog__card-excerpt">{post.excerpt}</p>}
                    <span className="blog__card-date">{formatDate(post.published_at)}</span>
                  </div>
                </article>
                {i < posts.length - 1 && (
                  <div key={`sep-${i}`} className="blog__separator">
                    <img src={`/sep${(i % 3) + 1}.webp`} alt="" aria-hidden="true" />
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </div>

      {loadingPost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontFamily: 'inherit' }}>{t.blog.loading}</span>
        </div>
      )}
      {openPost && <PostModal post={openPost} onClose={() => setOpenPost(null)} />}

      <style>{`
        .blog__header {
          background: rgba(255,255,255,0.30);
          padding: 1.5rem;
          display: inline-block;
          margin-bottom: var(--spacing-md);
        }
        .blog__intro { max-width: 600px; font-size: 1rem; margin-top: 0.5rem; }
        .blog__filters {
          display: flex; flex-wrap: wrap; gap: 0.5rem;
          margin-bottom: var(--spacing-md);
        }
        .blog__filter-btn {
          padding: 0.35rem 0.9rem; border-radius: 20px;
          border: 1px solid var(--color-border-light);
          background: transparent; color: var(--color-text-secondary);
          font-size: 0.78rem; font-family: inherit; cursor: pointer;
          transition: all 0.15s;
        }
        .blog__filter-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .blog__filter-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
        .blog__list {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .blog__card {
          cursor: pointer; background: rgba(255,255,255,0.45);
          transition: background 0.15s;
          width: 100%; max-width: 576px;
        }
        .blog__card:hover { background: rgba(255,255,255,0.75); }
        .blog__card-img {
          aspect-ratio: 16/9; overflow: hidden;
          background: var(--color-border-light);
        }
        .blog__card-img--placeholder { background: #ddd8ce; }
        .blog__card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .blog__card:hover .blog__card-img img { transform: scale(1.04); }
        .blog__card-body { padding: 0.8rem 1rem; }
        .blog__card-cat {
          font-size: 0.62rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--color-primary); display: block; margin-bottom: 0.25rem;
        }
        .blog__card-title { font-size: 0.88rem; font-weight: 600; line-height: 1.4; color: var(--color-text); margin-bottom: 0.35rem; }
        .blog__card-excerpt { font-size: 0.76rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 0.4rem; }
        .blog__card-date { font-size: 0.66rem; color: #aaa; }
        .blog__separator {
          width: 100%; max-width: 576px;
          display: flex; justify-content: center;
          padding: 0.5rem 0;
        }
        .blog__separator img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        .blog__loading, .blog__empty { font-size: 0.9rem; color: var(--color-text-secondary); padding: 2rem 0; }
      `}</style>
    </section>
  )
}
