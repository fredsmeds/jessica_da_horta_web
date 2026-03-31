import { useState } from 'react'
import { useLanguage } from '../i18n/index.jsx'

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <button className="faq-item__question" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <svg
          className="faq-item__icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" className="faq-item__icon-v" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <div className="faq-item__answer-wrap">
        <div className="faq-item__answer">
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i)

  return (
    <section id="faq" className="faq section">
      <div className="container">
        <div className="faq__layout">
          <div className="faq__header-col">
            <div className="faq__header-text">
              <p className="section-label">{t.faq.sectionLabel}</p>
              <h2 className="section-title">{t.faq.title}</h2>
            </div>
            <div className="faq__deco">
              <img src="/plant_gif.webp" alt="" className="faq__deco-img" aria-hidden="true" loading="lazy" />
            </div>
          </div>

          <div className="faq__list-col">
            <div className="faq__list">
              {t.faq.items.map((item, i) => (
                <FAQItem
                  key={i}
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .faq {
          background: transparent;
        }
        .faq__layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: var(--spacing-lg);
          align-items: start;
        }
        .faq__header-col {
          position: sticky;
          top: calc(var(--nav-height) + 2rem);
        }
        .faq__header-text {
          background: rgba(255, 255, 255, 0.30);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .faq__deco {
          margin-top: 0;
          overflow: hidden;
          aspect-ratio: 3/4;
        }
        .faq__deco-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(20%);
          opacity: 0.8;
        }
        .faq__list-col {
          padding-top: 0.25rem;
          background: rgba(255, 255, 255, 0.30);
          padding: 1.5rem;
        }
        .faq__list {
          border-top: 1px solid var(--color-border);
        }
        .faq-item {
          border-bottom: 1px solid var(--color-border);
        }
        .faq-item__question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.4rem 0;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: 0.95rem;
          font-weight: var(--weight-medium);
          color: var(--color-text);
          text-align: left;
          transition: color var(--transition);
        }
        .faq-item__question:hover {
          color: var(--color-primary);
        }
        .faq-item--open .faq-item__question {
          color: var(--color-primary);
        }
        .faq-item__icon {
          flex-shrink: 0;
          margin-top: 2px;
          transition: transform 0.25s ease;
          color: var(--color-primary);
        }
        .faq-item__icon-v {
          transition: transform 0.25s ease;
          transform-origin: center;
        }
        .faq-item--open .faq-item__icon-v {
          transform: scaleY(0);
        }
        .faq-item__answer-wrap {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }
        .faq-item--open .faq-item__answer-wrap {
          grid-template-rows: 1fr;
        }
        .faq-item__answer {
          overflow: hidden;
        }
        .faq-item__answer p {
          padding-bottom: 1.4rem;
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--color-text-secondary);
          max-width: 620px;
        }

        @media (max-width: 900px) {
          .faq__layout {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }
          .faq__header-col {
            position: static;
          }
          .faq__deco {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
