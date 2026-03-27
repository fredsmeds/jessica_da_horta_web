import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/index.jsx'

export default function Navbar({ activeSection, onNavClick }) {
  const { lang, setLang, t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'faq', label: t.nav.faq },
    { id: 'contact', label: t.nav.contact },
  ]

  const handleClick = (id) => {
    onNavClick(id)
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--open' : ''}`}>
      <div className="navbar__inner">
        <button
          className="navbar__logo"
          onClick={() => handleClick('home')}
          aria-label="Início"
        >
          <img src={scrolled ? "/isotipo.webp" : "/isotipo_white.webp"} alt="Jessica da Horta Garden Design" height="36" />
        </button>

        <ul className="navbar__links">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`navbar__link${activeSection === item.id ? ' navbar__link--active' : ''}`}
                onClick={() => handleClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar__right">
          <div className="navbar__lang">
            {['pt', 'en', 'es'].map(l => (
              <button
                key={l}
                className={`navbar__lang-btn${lang === l ? ' navbar__lang-btn--active' : ''}`}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            className="navbar__cta"
            onClick={() => handleClick('schedule')}
          >
            {t.nav.schedule}
          </button>

          <button
            className={`navbar__burger${menuOpen ? ' navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}>
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`navbar__mobile-link${activeSection === item.id ? ' active' : ''}`}
                onClick={() => handleClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              className="navbar__mobile-link navbar__mobile-cta"
              onClick={() => handleClick('schedule')}
            >
              {t.nav.schedule}
            </button>
          </li>
        </ul>
        <div className="navbar__mobile-lang">
          {['pt', 'en', 'es'].map(l => (
            <button
              key={l}
              className={`navbar__lang-btn${lang === l ? ' navbar__lang-btn--active' : ''}`}
              onClick={() => { setLang(l); setMenuOpen(false) }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .navbar--scrolled {
          background: rgba(255,255,255,0.97);
          box-shadow: 0 1px 0 var(--color-border);
          backdrop-filter: blur(8px);
        }
        .navbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
          padding: 0 var(--spacing-md);
          max-width: 1400px;
          margin: 0 auto;
        }
        .navbar__logo {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .navbar__logo img {
          height: 36px;
          width: auto;
          object-fit: contain;
        }
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 2rem;
          align-items: center;
        }
        .navbar__link {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 0.82rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-white);
          padding: 0.25rem 0;
          position: relative;
          transition: color var(--transition);
        }
        .navbar--scrolled .navbar__link {
          color: var(--color-text);
        }
        .navbar__link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--color-primary);
          transition: width var(--transition);
        }
        .navbar__link:hover::after,
        .navbar__link--active::after {
          width: 100%;
        }
        .navbar__link--active {
          color: var(--color-primary);
        }
        .navbar--scrolled .navbar__link--active {
          color: var(--color-primary);
        }
        .navbar__right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .navbar__lang {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .navbar__lang-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 0.75rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.6);
          transition: color var(--transition);
          padding: 0.1rem 0.2rem;
        }
        .navbar--scrolled .navbar__lang-btn {
          color: var(--color-text-secondary);
        }
        .navbar__lang-btn--active,
        .navbar__lang-btn:hover {
          color: var(--color-white) !important;
        }
        .navbar--scrolled .navbar__lang-btn--active,
        .navbar--scrolled .navbar__lang-btn:hover {
          color: var(--color-primary) !important;
        }
        .navbar__cta {
          font-family: var(--font-family);
          font-size: 0.78rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          background: var(--color-primary);
          color: var(--color-white);
          border: none;
          cursor: pointer;
          transition: background var(--transition);
          white-space: nowrap;
        }
        .navbar__cta:hover {
          background: var(--color-primary-dark);
        }
        .navbar__burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .navbar__burger span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: var(--color-white);
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .navbar--scrolled .navbar__burger span {
          background: var(--color-text);
        }
        .navbar__burger--open span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .navbar__burger--open span:nth-child(2) {
          opacity: 0;
        }
        .navbar__burger--open span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }
        .navbar__mobile {
          display: none;
          background: var(--color-white);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, padding 0.35s ease;
          padding: 0 var(--spacing-md);
        }
        .navbar__mobile--open {
          max-height: 500px;
          border-top: 1px solid var(--color-border);
          padding: 1.5rem var(--spacing-md);
        }
        .navbar__mobile ul {
          list-style: none;
          margin-bottom: 1.5rem;
        }
        .navbar__mobile-link {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 0.9rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-text);
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border-light);
          transition: color var(--transition);
        }
        .navbar__mobile-link.active,
        .navbar__mobile-link:hover {
          color: var(--color-primary);
        }
        .navbar__mobile-cta {
          color: var(--color-primary) !important;
          font-weight: var(--weight-semibold);
        }
        .navbar__mobile-lang {
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 1024px) {
          .navbar__links,
          .navbar__cta {
            display: none;
          }
          .navbar__burger {
            display: flex;
          }
          .navbar__mobile {
            display: block;
          }
        }

        @media (max-width: 640px) {
          .navbar__inner {
            padding: 0 1.25rem;
          }
        }
      `}</style>
    </nav>
  )
}
