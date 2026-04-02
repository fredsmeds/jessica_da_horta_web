import { useState } from 'react'
import { useLanguage } from '../i18n/index.jsx'

const STORAGE_KEY = 'jdh_cookies_accepted'

export default function CookieConsent({ onTermsClick }) {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  if (!visible) return null

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const c = t.cookies

  return (
    <>
      <div className="cookie-banner" role="dialog" aria-label={c.title}>
        <div className="cookie-banner__inner">
          <p className="cookie-banner__text">
            <strong>{c.title}</strong> {c.text}
          </p>
          <div className="cookie-banner__actions">
            <button type="button" className="link-btn cookie-banner__link" onClick={onTermsClick}>
              {c.termsLink}
            </button>
            <button type="button" className="btn btn-primary cookie-banner__accept" onClick={accept}>
              {c.accept}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 150;
          background: var(--color-primary-dark);
          color: var(--color-white);
          padding: var(--spacing-sm) var(--spacing-md);
          box-shadow: 0 -2px 12px rgba(0,0,0,0.15);
        }
        .cookie-banner__inner {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }
        .cookie-banner__text {
          flex: 1;
          font-size: 0.85rem;
          line-height: 1.6;
          min-width: 240px;
        }
        .cookie-banner__text strong {
          display: inline;
          margin-right: 0.3em;
        }
        .cookie-banner__actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-shrink: 0;
        }
        .cookie-banner__link {
          color: var(--color-off-white) !important;
          text-decoration: underline;
          font-size: 0.82rem;
          white-space: nowrap;
        }
        .cookie-banner__accept {
          white-space: nowrap;
          font-size: 0.85rem;
          padding: 0.5rem 1.2rem;
        }
        @media (max-width: 600px) {
          .cookie-banner__inner { flex-direction: column; text-align: center; }
          .cookie-banner__actions { justify-content: center; }
        }
      `}</style>
    </>
  )
}
