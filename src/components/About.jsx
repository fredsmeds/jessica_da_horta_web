import { useState } from 'react'
import { useLanguage } from '../i18n/index.jsx'

function PlaceholderBlock({ icon, text }) {
  return (
    <div className="placeholder-block">
      <div className="placeholder-block__icon">{icon}</div>
      <p className="placeholder-block__text">{text}</p>
    </div>
  )
}

export default function About() {
  const { t } = useLanguage()
  const [bioTab, setBioTab] = useState('early')
  const [extrasTab, setExtrasTab] = useState('cert')

  const tabs = [
    { id: 'early', label: t.about.earlyLifeTitle },
    { id: 'career', label: t.about.careerTitle },
    { id: 'philosophy', label: t.about.philosophyTitle },
  ]

  return (
    <section id="about" className="about section">
      <div className="about__fondo" />
      <div className="container">

        {/* Header */}
        <p className="section-label">{t.about.sectionLabel}</p>

        {/* Biography + Portrait */}
        <div className="about__bio-wrap">

          {/* Portrait */}
          <div className="about__portrait-col">
            <div className="about__portrait-frame">
              <img
                src="/portrait.webp"
                alt={t.about.portraitAlt}
                className="about__portrait"
              />
            </div>
            {/* Mission card below portrait */}
            <div className="about__mission-box">
              <p className="about__mission-label">{t.about.missionTitle}</p>
              <p className="about__mission-text">{t.about.missionStatement}</p>
            </div>
          </div>

          {/* Bio text */}
          <div className="about__bio-col">
            {/* Tab navigation */}
            <div className="about__tabs" role="tablist">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={bioTab === tab.id}
                  className={`about__tab${bioTab === tab.id ? ' about__tab--active' : ''}`}
                  onClick={() => setBioTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="about__tab-content">
              {bioTab === 'early' && (
                <div>
                  {t.about.earlyLifeText.map((para, i) => (
                    <p key={i} className="about__para">{para}</p>
                  ))}
                  {t.about.educationItems && (
                    <div className="about__edu">
                      <p className="about__edu-label">{t.about.educationLabel}</p>
                      {t.about.educationItems.map((edu, i) => (
                        <div key={i} className="about__edu-item">
                          <div className="about__edu-degree">{edu.degree}</div>
                          <div className="about__edu-school">{edu.school} · {edu.period}</div>
                          {edu.note && <div className="about__edu-note">{edu.note}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {bioTab === 'career' && (
                <div className="about__timeline">
                  {t.about.careerItems.map((item, i) => (
                    <div key={i} className="about__tl-item">
                      <div className="about__tl-period">{item.period}</div>
                      <div className="about__tl-content">
                        <div className="about__tl-role">{item.role}</div>
                        <div className="about__tl-org">{item.org} · {item.location}</div>
                        {item.desc && <p className="about__tl-desc">{item.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {bioTab === 'philosophy' && (
                <div>
                  {t.about.philosophyText.map((para, i) => (
                    <p key={i} className="about__para">{para}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Extras mini-tab */}
        <div className="about__extras">
          <div className="about__extras-nav">
            <button
              className={`about__extras-tab${extrasTab === 'press' ? ' about__extras-tab--active' : ''}`}
              onClick={() => setExtrasTab('press')}
            >
              {t.about.pressTitle}
            </button>
            <button
              className={`about__extras-tab${extrasTab === 'cert' ? ' about__extras-tab--active' : ''}`}
              onClick={() => setExtrasTab('cert')}
            >
              {t.about.certTitle}
            </button>
            <button
              className={`about__extras-tab${extrasTab === 'volunteer' ? ' about__extras-tab--active' : ''}`}
              onClick={() => setExtrasTab('volunteer')}
            >
              {t.about.volunteerTitle}
            </button>
          </div>

          <div className="about__extras-content">
            {extrasTab === 'press' && (
              <p className="about__placeholder">{t.about.pressPlaceholder}</p>
            )}
            {extrasTab === 'cert' && (
              <ul className="about__cert-list">
                {t.about.certItems.map((cert, i) => (
                  <li key={i} className="about__cert-item">
                    <span className="about__cert-title">{cert.title}</span>
                    <span className="about__cert-sep"> — </span>
                    <span className="about__cert-meta">{cert.issuer} · {cert.year}</span>
                  </li>
                ))}
              </ul>
            )}
            {extrasTab === 'volunteer' && (
              <ul className="about__volunteer-list">
                {t.about.volunteerItems.map((v, i) => (
                  <li key={i} className="about__volunteer-item">
                    <span className="about__volunteer-role">{v.role}</span>
                    <span className="about__volunteer-meta">{v.org} · {v.period}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .about {
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        .about .container {
          position: relative;
          z-index: 1;
        }
        .about__fondo {
          position: absolute;
          inset: 0;
          background-image: url('/fondo2.webp');
          background-size: 100% auto;
          background-position: top center;
          background-repeat: no-repeat;
          pointer-events: none;
        }
        @media (max-width: 1024px) {
          .about__fondo {
            background-image: url('/fondo3.webp');
          }
        }
        .about__bio-wrap {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: var(--spacing-lg);
          align-items: start;
          margin-top: var(--spacing-md);
        }
        .about__portrait-col {
          position: sticky;
          top: calc(var(--nav-height) + 2rem);
        }
        .about__portrait-frame {
          overflow: hidden;
          aspect-ratio: 3/4;
          margin-bottom: 1.5rem;
        }
        .about__portrait {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.6s ease;
        }
        .about__portrait-frame:hover .about__portrait {
          transform: scale(1.03);
        }
        .about__mission-box {
          border-left: 3px solid var(--color-primary);
          padding-left: 1.25rem;
        }
        .about__mission-label {
          font-size: 0.72rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 0.6rem;
        }
        .about__mission-text {
          font-size: 0.9rem;
          font-style: italic;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }
        .about__bio-col {
          min-width: 0;
        }
        .about__tabs {
          display: flex;
          gap: 0;
          margin-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
        }
        .about__tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 0.78rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          padding: 0.75rem 1.5rem 0.75rem 0;
          transition: color var(--transition), border-color var(--transition);
        }
        .about__tab + .about__tab {
          padding-left: 1.5rem;
        }
        .about__tab:hover {
          color: var(--color-primary);
        }
        .about__tab--active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }
        .about__tab-content {
          min-height: 300px;
        }
        .about__para {
          margin-bottom: 1.25rem;
          font-size: 0.88rem;
          line-height: 1.85;
          color: var(--color-text-secondary);
        }
        .about__para:last-child {
          margin-bottom: 0;
        }
        .about__extras {
          margin-top: var(--spacing-md);
        }
        .about__extras-nav {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 1.5rem;
        }
        .about__extras-tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 0.72rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          padding: 0.6rem 1.25rem 0.6rem 0;
          transition: color var(--transition), border-color var(--transition);
        }
        .about__extras-tab + .about__extras-tab {
          padding-left: 1.25rem;
        }
        .about__extras-tab:hover { color: var(--color-primary); }
        .about__extras-tab--active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }
        .about__extras-content {
          min-height: 120px;
        }
        .about__extra-title {
          font-size: 0.85rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-text);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
        }
        .about__placeholder {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          font-style: italic;
        }

        /* Education section */
        .about__edu {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border);
        }
        .about__edu-label {
          font-size: 0.72rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }
        .about__edu-item {
          margin-bottom: 1rem;
        }
        .about__edu-item:last-child { margin-bottom: 0; }
        .about__edu-degree {
          font-size: 0.9rem;
          font-weight: var(--weight-medium);
          color: var(--color-text);
        }
        .about__edu-school {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          margin-top: 0.15rem;
        }
        .about__edu-note {
          font-size: 0.78rem;
          color: var(--color-primary);
          font-style: italic;
          margin-top: 0.15rem;
        }

        /* Career timeline */
        .about__timeline {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .about__tl-item {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 1rem;
          align-items: start;
        }
        .about__tl-period {
          font-size: 0.7rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-primary);
          padding-top: 0.2rem;
          text-align: right;
          line-height: 1.4;
        }
        .about__tl-content {
          border-left: 2px solid var(--color-border);
          padding-left: 1rem;
        }
        .about__tl-role {
          font-size: 0.95rem;
          font-weight: var(--weight-medium);
          color: var(--color-text);
          margin-bottom: 0.15rem;
        }
        .about__tl-org {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.35rem;
        }
        .about__tl-desc {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* Certifications & Volunteering lists */
        .about__cert-list,
        .about__volunteer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .about__cert-item {
          display: block;
          line-height: 1.5;
        }
        .about__volunteer-item {
          display: flex;
          flex-direction: column;
        }
        .about__cert-title,
        .about__volunteer-role {
          font-size: 0.85rem;
          font-weight: var(--weight-medium);
          color: var(--color-text);
          line-height: 1.4;
        }
        .about__cert-sep {
          font-size: 0.76rem;
          color: var(--color-border);
        }
        .about__cert-meta,
        .about__volunteer-meta {
          font-size: 0.76rem;
          color: var(--color-text-secondary);
          margin-top: 0.1rem;
        }

        @media (max-width: 1024px) {
          .about__bio-wrap {
            grid-template-columns: 280px 1fr;
            gap: var(--spacing-md);
          }
        }

        @media (max-width: 768px) {
          .about__tl-item {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }
          .about__tl-period {
            text-align: left;
          }
          .about__bio-wrap {
            grid-template-columns: 1fr;
          }
          .about__portrait-col {
            position: static;
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 1.5rem;
            align-items: start;
          }
          .about__portrait-frame {
            margin-bottom: 0;
          }

          .about__tab {
            font-size: 0.72rem;
            padding-right: 1rem;
          }
          .about__tab + .about__tab {
            padding-left: 1rem;
          }
        }

        @media (max-width: 480px) {
          .about__portrait-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
