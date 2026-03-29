import { useLanguage } from '../i18n/index.jsx'

export default function Footer({ onNavClick, onPrivacyClick }) {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <img src="/imagotipo_white.webp" alt="Jessica da Horta Garden Design" className="footer__logo" />
            <p className="footer__tagline">{t.footer.tagline}</p>
          </div>

          <div className="footer__nav">
            <p className="footer__nav-title">{t.footer.links}</p>
            <ul>
              {[
                { id: 'home', label: t.nav.home },
                { id: 'about', label: t.nav.about },
                { id: 'projects', label: t.nav.projects },
                { id: 'faq', label: t.nav.faq },
                { id: 'contact', label: t.nav.contact },
                { id: 'schedule', label: t.nav.schedule },
              ].map(item => (
                <li key={item.id}>
                  <button className="footer__link" onClick={() => onNavClick(item.id)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__contact">
            <p className="footer__nav-title">Contacto</p>
            <div className="footer__contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>contact@jessicadahorta.com</span>
            </div>
            <div className="footer__contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Portugal</span>
            </div>
            <a
              href="https://www.linkedin.com/in/jessicadhg/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__contact-item footer__linkedin"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.instagram.com/wild_mediterranean_gardens_pt/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__contact-item footer__linkedin"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {year} Jessica da Horta Garden Design. {t.footer.rights}
          </p>
          <button className="footer__privacy" onClick={onPrivacyClick}>
            {t.footer.privacy}
          </button>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--color-primary-dark);
          color: rgba(255,255,255,0.8);
          padding: var(--spacing-lg) 0 var(--spacing-md);
        }
        .footer__top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .footer__logo {
          height: 32px;
          width: auto;
          filter: brightness(0) invert(1);
          opacity: 0.85;
          margin-bottom: 1rem;
        }
        .footer__tagline {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.55);
          max-width: 280px;
          line-height: 1.6;
        }
        .footer__nav-title {
          font-size: 0.72rem;
          font-weight: var(--weight-medium);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 1rem;
        }
        .footer__nav ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer__link {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          transition: color var(--transition);
          padding: 0;
          text-align: left;
        }
        .footer__link:hover {
          color: var(--color-white);
        }
        .footer__contact-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.83rem;
          color: rgba(255,255,255,0.65);
          margin-bottom: 0.6rem;
        }
        .footer__contact-item svg {
          flex-shrink: 0;
          opacity: 0.7;
        }
        .footer__linkedin {
          text-decoration: none;
          transition: opacity var(--transition);
        }
        .footer__linkedin:hover {
          opacity: 0.9;
        }
        .footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .footer__copy {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.4);
        }
        .footer__privacy {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 0.78rem;
          color: rgba(255,255,255,0.4);
          transition: color var(--transition);
          padding: 0;
        }
        .footer__privacy:hover {
          color: rgba(255,255,255,0.8);
        }

        @media (max-width: 768px) {
          .footer__top {
            grid-template-columns: 1fr 1fr;
          }
          .footer__brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 480px) {
          .footer__top {
            grid-template-columns: 1fr;
          }
          .footer__bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  )
}
