import { useLanguage } from '../i18n/index.jsx'

const placeholderProjects = [
  { id: 1, category: 'Design', location: 'Lisboa', year: '2024' },
  { id: 2, category: 'Consultoria', location: 'Cascais', year: '2024' },
  { id: 3, category: 'Instalação', location: 'Setúbal', year: '2023' },
  { id: 4, category: 'Design', location: 'Alentejo', year: '2023' },
  { id: 5, category: 'Gestão', location: 'Sintra', year: '2024' },
  { id: 6, category: 'Design', location: 'Algarve', year: '2025' },
]

export default function Projects() {
  const { t } = useLanguage()

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <div className="projects__header">
          <p className="section-label">{t.projects.sectionLabel}</p>
          <h2 className="section-title">{t.projects.title}</h2>
          <p className="projects__intro">{t.projects.intro}</p>
        </div>

        <img src="/plant3.webp" alt="" aria-hidden="true" className="projects__plant" />

        <div className="projects__grid">
          {placeholderProjects.map(project => (
            <div key={project.id} className="projects__item">
              <div className="projects__item-img">
                <img src="/leaves_eyes2.webp" alt={`${t.projects.comingSoon} ${project.id}`} />
                <div className="projects__item-overlay">
                  <span>{t.projects.comingSoon}</span>
                </div>
              </div>
              <div className="projects__item-meta">
                <span className="projects__item-cat">{project.category}</span>
                <span className="projects__item-loc">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'0.3rem', verticalAlign:'middle'}}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {project.location} · {project.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-primary);
        }
        .projects__item-loc {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
        }

        .projects__plant { display: none; pointer-events: none; opacity: 0.88; }

        @media (max-width: 900px) {
          .projects__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .projects__plant {
            display: block;
            width: 100%;
            max-height: 120px;
            object-fit: cover;
            object-position: center;
            margin: 1.5rem 0;
          }
        }

        @media (max-width: 580px) {
          .projects__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
