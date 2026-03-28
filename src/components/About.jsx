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
                </div>
              )}
              {bioTab === 'career' && (
                <div>
                  {t.about.careerText.map((para, i) => (
                    <p key={i} className="about__para">{para}</p>
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

        {/* Three columns: Press, Certifications, Workshops */}
        <div className="about__extras">
          <div className="about__extra-col">
            <h4 className="about__extra-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'0.5rem', verticalAlign:'middle'}}>
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
              </svg>
              {t.about.pressTitle}
            </h4>
            <p className="about__placeholder">{t.about.pressPlaceholder}</p>
          </div>

          <div className="about__extra-col">
            <h4 className="about__extra-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'0.5rem', verticalAlign:'middle'}}>
                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
              {t.about.certTitle}
            </h4>
            <p className="about__placeholder">{t.about.certPlaceholder}</p>
          </div>

          <div className="about__extra-col">
            <h4 className="about__extra-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'0.5rem', verticalAlign:'middle'}}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {t.about.workshopsTitle}
            </h4>
            <p className="about__placeholder">{t.about.workshopsPlaceholder}</p>
          </div>
        </div>

      </div>

      <style>{`
        .about {
          background: var(--color-off-white);
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
          background-size: cover;
          background-position: center;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .about__fondo {
            background-image: url('/fondo3.webp');
            background-size: 100% 100%;
            background-position: top center;
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
          font-size: 1rem;
          line-height: 1.85;
          color: var(--color-text-secondary);
        }
        .about__para:last-child {
          margin-bottom: 0;
        }
        .about__extras {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
        }
        .about__extra-col {
          padding: var(--spacing-sm) 0;
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

        @media (max-width: 1024px) {
          .about__bio-wrap {
            grid-template-columns: 280px 1fr;
            gap: var(--spacing-md);
          }
        }

        @media (max-width: 768px) {
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
          .about__extras {
            grid-template-columns: 1fr;
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
