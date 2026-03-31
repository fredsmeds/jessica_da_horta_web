import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../i18n/index.jsx'

const placeholderProjects = [
  { id: 1, img: '/gif1.webp', category: 'Consultoria + Design', location: 'Lisboa', year: '2026' },
  { id: 2, img: '/sketch2.webp', category: 'Design · Plano Geral · Jardim de Sequeiro', location: 'Caxias', year: '2019' },
  { id: 3, img: '/gif3.webp', category: 'Design · Jardim de Sequeiro', location: 'Loulé', year: '2023' },
  { id: 4, img: '/sketch4.webp', category: 'Instalação · Jardim de Sequeiro', location: 'Loulé', year: '2024' },
  { id: 5, img: '/gif5.webp', category: 'Acompanhamento · Jardim de Sequeiro', location: 'Arruda dos Vinhos', year: '2025' },
  { id: 6, img: '/sketch6.webp', category: 'Formação · Jardinagem de Sequeiro em Clima Mediterrânico', location: 'APEJECEM-MGAP', year: '' },
]

const ALBUM_3 = [
  { src: '/3.1.webp',  tagKey: 'planning' },
  { src: '/3.2.webp',  tagKey: 'planning' },
  { src: '/3.3.webp',  tagKey: 'planning' },
  { src: '/3.4.webp',  tagKey: 'before' },
  { src: '/3.5.webp',  tagKey: 'before' },
  { src: '/3.6.webp',  tagKey: 'before' },
  { src: '/3.7.webp',  tagKey: 'before' },
  { src: '/3.8.webp',  tagKey: 'after' },
  { src: '/3.9.webp',  tagKey: 'after' },
  { src: '/3.10.webp', tagKey: 'after' },
  { src: '/3.11.webp', tagKey: 'after' },
  { src: '/3.12.webp', tagKey: 'after' },
  { src: '/3.13.webp', tagKey: 'after' },
]

const ALBUM_5 = [
  { src: '/5.1.webp',  tagKey: 'planning' },
  { src: '/5.2.webp',  tagKey: 'planning' },
  { src: '/5.3.webp',  tagKey: 'before' },
  { src: '/5.4.webp',  tagKey: 'before' },
  { src: '/5.5.webp',  tagKey: 'after' },
  { src: '/5.6.webp',  tagKey: 'after' },
  { src: '/5.7.webp',  tagKey: 'after' },
  { src: '/5.8.webp',  tagKey: 'after' },
  { src: '/5.9.webp',  tagKey: 'after' },
  { src: '/5.10.webp', tagKey: 'after' },
  { src: '/5.11.webp', tagKey: 'after' },
]

const TAG_COLORS = {
  planning: { bg: 'rgba(85,91,55,0.82)',   text: '#fff' },
  before:   { bg: 'rgba(160,120,60,0.82)',  text: '#fff' },
  after:    { bg: 'rgba(45,106,64,0.82)',   text: '#fff' },
}

function Album({ project, images, tags, onClose }) {
  const [index, setIndex] = useState(0)

  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const current = images[index]
  const tagStyle = TAG_COLORS[current.tagKey] || { bg: 'rgba(0,0,0,0.6)', text: '#fff' }

  return (
    <div className="album-overlay" onClick={onClose}>
      <div className="album-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="album-header">
          <div className="album-header-info">
            <span className="album-category">{project.category}</span>
            <span className="album-loc">
              {project.location}{project.year ? ` · ${project.year}` : ''}
            </span>
          </div>
          <button className="album-close" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        {/* Main image */}
        <div className="album-stage">
          <button className="album-nav album-nav--prev" onClick={prev} aria-label="Anterior">‹</button>

          <div className="album-img-wrap">
            <img key={index} src={current.src} alt={`${project.category} ${index + 1}`} className="album-img" />
            <span className="album-tag" style={{ background: tagStyle.bg, color: tagStyle.text }}>
              {tags[current.tagKey]}
            </span>
          </div>

          <button className="album-nav album-nav--next" onClick={next} aria-label="Seguinte">›</button>
        </div>

        {/* Counter */}
        <div className="album-counter">{index + 1} / {images.length}</div>

        {/* Thumbnails */}
        <div className="album-thumbs">
          {images.map((img, i) => {
            const thumbStyle = TAG_COLORS[img.tagKey] || { bg: 'rgba(0,0,0,0.6)', text: '#fff' }
            return (
              <button
                key={i}
                className={`album-thumb${i === index ? ' album-thumb--active' : ''}`}
                onClick={() => setIndex(i)}
              >
                <img src={img.src} alt="" />
                <span className="album-thumb-tag" style={{ background: thumbStyle.bg }}>
                  {tags[img.tagKey]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { t } = useLanguage()
  const [openAlbum, setOpenAlbum] = useState(null)
  const ALBUMS = { 3: ALBUM_3, 5: ALBUM_5 }

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <div className="projects__header">
          <p className="section-label">{t.projects.sectionLabel}</p>
          <h2 className="section-title">{t.projects.title}</h2>
          <p className="projects__intro">{t.projects.intro}</p>
        </div>

        <div className="projects__grid">
          {placeholderProjects.map(project => (
            <div
              key={project.id}
              className={`projects__item${ALBUMS[project.id] ? ' projects__item--clickable' : ''}`}
              onClick={ALBUMS[project.id] ? () => setOpenAlbum(project) : undefined}
            >
              <div className="projects__item-img">
                <img src={project.img} alt={`${t.projects.comingSoon} ${project.id}`} />
                <div className="projects__item-overlay">
                  <span>{ALBUMS[project.id] ? 'Ver Álbum' : t.projects.comingSoon}</span>
                </div>
              </div>
              <div className="projects__item-meta">
                <span className="projects__item-cat">{project.category}</span>
                <span className="projects__item-loc">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'0.3rem', verticalAlign:'middle'}}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {project.location}{project.year ? ` · ${project.year}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openAlbum && (
        <Album
          project={openAlbum}
          images={ALBUMS[openAlbum.id]}
          tags={t.albumTags}
          onClose={() => setOpenAlbum(null)}
        />
      )}

      <style>{`
        .projects__header {
          background: rgba(255, 255, 255, 0.30);
          padding: 1.5rem;
          display: inline-block;
        }
        .projects__intro {
          max-width: 600px;
          font-size: 1rem;
          margin-top: 0.5rem;
        }
        .projects__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5px;
          margin-top: var(--spacing-md);
        }
        .projects__item {
          position: relative;
        }
        .projects__item--clickable {
          cursor: pointer;
        }
        .projects__item-img {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: var(--color-border-light);
        }
        .projects__item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          filter: grayscale(30%);
        }
        .projects__item:hover .projects__item-img img {
          transform: scale(1.06);
        }
        .projects__item-overlay {
          position: absolute;
          inset: 0;
          background: rgba(85, 91, 55, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .projects__item:hover .projects__item-overlay {
          opacity: 1;
        }
        .projects__item-overlay span {
          font-size: 0.75rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-white);
        }
        .projects__item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border-light);
        }
        .projects__item-cat {
          font-size: 0.75rem;
          font-weight: var(--weight-medium);
          color: var(--color-primary);
        }
        .projects__item-loc {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
        }

        /* Album overlay */
        .album-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.88);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .album-modal {
          background: #0e0e0c;
          width: 100%;
          max-width: 900px;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          border-radius: 3px;
          overflow: hidden;
        }
        .album-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .album-header-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .album-category {
          font-size: 0.75rem;
          font-weight: 600;
          color: #c8d4a0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .album-loc {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.4);
        }
        .album-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 1.6rem;
          cursor: pointer;
          line-height: 1;
          padding: 2px 8px;
        }
        .album-close:hover { color: #fff; }

        /* Stage */
        .album-stage {
          flex: 1;
          display: flex;
          align-items: center;
          min-height: 0;
          position: relative;
        }
        .album-img-wrap {
          flex: 1;
          min-height: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 0;
        }
        .album-img {
          max-height: 52vh;
          max-width: 100%;
          object-fit: contain;
          display: block;
          border-radius: 2px;
        }
        .album-tag {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 3px 12px;
          border-radius: 20px;
          white-space: nowrap;
        }
        .album-nav {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 2.5rem;
          cursor: pointer;
          padding: 0 1rem;
          line-height: 1;
          flex-shrink: 0;
          transition: color 0.15s;
          align-self: stretch;
          display: flex;
          align-items: center;
        }
        .album-nav:hover { color: #fff; }

        /* Counter */
        .album-counter {
          text-align: center;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.35);
          padding: 0.25rem 0;
          flex-shrink: 0;
        }

        /* Thumbnails */
        .album-thumbs {
          display: flex;
          gap: 4px;
          padding: 0.75rem 1rem;
          overflow-x: auto;
          flex-shrink: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.15) transparent;
        }
        .album-thumb {
          flex-shrink: 0;
          width: 64px;
          height: 48px;
          border: 2px solid transparent;
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          background: none;
          position: relative;
        }
        .album-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .album-thumb:hover img { opacity: 0.8; }
        .album-thumb--active {
          border-color: #c8d4a0;
        }
        .album-thumb--active img { opacity: 1; }
        .album-thumb-tag {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          font-size: 0.5rem;
          font-weight: 700;
          text-transform: uppercase;
          text-align: center;
          padding: 1px 0;
          color: #fff;
          letter-spacing: 0.04em;
        }

        @media (max-width: 900px) {
          .projects__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 580px) {
          .projects__grid {
            grid-template-columns: 1fr;
          }
          .album-img { max-height: 40vh; }
          .album-nav { padding: 0 0.5rem; font-size: 2rem; }
        }
      `}</style>
    </section>
  )
}
