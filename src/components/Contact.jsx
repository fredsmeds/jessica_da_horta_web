import { useState } from 'react'
import { useLanguage } from '../i18n/index.jsx'

function PrivacyModal({ t, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{t.privacy.title}</h3>
          <button className="modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p className="modal__body">{t.privacy.content}</p>
        <button className="btn btn-outline" onClick={onClose}>{t.privacy.close}</button>
      </div>
    </div>
  )
}

function GeneralForm({ t, onPrivacyClick }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', zip: '', message: '', privacy: false })
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.privacy) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: 'general' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="alert alert-success">
        <strong>{t.contact.successTitle}.</strong> {t.contact.successText}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status === 'error' && <div className="alert alert-error">{t.contact.errorText}</div>}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t.contact.nameLabel} <span className="required">*</span></label>
          <input className="form-input" type="text" required value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.contact.emailLabel} <span className="required">*</span></label>
          <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t.contact.phoneLabel}</label>
          <input className="form-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.contact.zipLabel}</label>
          <input className="form-input" type="text" value={form.zip} onChange={e => set('zip', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">{t.contact.messageLabel} <span className="required">*</span></label>
        <textarea
          className="form-textarea"
          required
          value={form.message}
          onChange={e => set('message', e.target.value)}
          placeholder={t.contact.messagePlaceholder}
        />
      </div>
      <div className="form-checkbox-group">
        <input
          type="checkbox"
          id="privacy-general"
          checked={form.privacy}
          onChange={e => set('privacy', e.target.checked)}
          required
        />
        <label htmlFor="privacy-general">
          {t.contact.privacyText}{' '}
          <button type="button" className="link-btn" onClick={onPrivacyClick}>{t.contact.privacyLink}</button>
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!form.privacy || status === 'loading'}
      >
        {status === 'loading' ? t.contact.sending : t.contact.sendBtn}
      </button>
    </form>
  )
}

function PricesForm({ t, onPrivacyClick }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', zip: '', message: '', privacy: false })
  const [status, setStatus] = useState(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.privacy) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: 'prices' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <div className="alert alert-success"><strong>{t.contact.successTitle}.</strong> {t.contact.successText}</div>
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status === 'error' && <div className="alert alert-error">{t.contact.errorText}</div>}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t.contact.nameLabel} <span className="required">*</span></label>
          <input className="form-input" type="text" required value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.contact.emailLabel} <span className="required">*</span></label>
          <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t.contact.phoneLabel}</label>
          <input className="form-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.contact.zipLabel}</label>
          <input className="form-input" type="text" value={form.zip} onChange={e => set('zip', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">{t.contact.messageLabel} <span className="required">*</span></label>
        <textarea className="form-textarea" required value={form.message} onChange={e => set('message', e.target.value)} placeholder={t.contact.messagePlaceholder} />
      </div>
      <div className="form-checkbox-group">
        <input type="checkbox" id="privacy-prices" checked={form.privacy} onChange={e => set('privacy', e.target.checked)} required />
        <label htmlFor="privacy-prices">
          {t.contact.privacyText}{' '}
          <button type="button" className="link-btn" onClick={onPrivacyClick}>{t.contact.privacyLink}</button>
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={!form.privacy || status === 'loading'}>
        {status === 'loading' ? t.contact.sending : t.contact.sendBtn}
      </button>
    </form>
  )
}

function JobsForm({ t, onPrivacyClick }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', experience: '', privacy: false })
  const [status, setStatus] = useState(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.privacy) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: 'jobs' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <div className="alert alert-success"><strong>{t.contact.successTitle}.</strong> {t.contact.successText}</div>
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status === 'error' && <div className="alert alert-error">{t.contact.errorText}</div>}
      <p className="jobs-intro">{t.contact.jobsIntro}</p>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t.contact.jobsNameLabel} <span className="required">*</span></label>
          <input className="form-input" type="text" required value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.contact.jobsEmailLabel} <span className="required">*</span></label>
          <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">{t.contact.jobsPhoneLabel} <span className="required">*</span></label>
        <input className="form-input" type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{t.contact.jobsExperienceLabel}</label>
        <textarea className="form-textarea" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder={t.contact.jobsExperiencePlaceholder} />
      </div>
      <div className="form-checkbox-group">
        <input type="checkbox" id="privacy-jobs" checked={form.privacy} onChange={e => set('privacy', e.target.checked)} required />
        <label htmlFor="privacy-jobs">
          {t.contact.privacyText}{' '}
          <button type="button" className="link-btn" onClick={onPrivacyClick}>{t.contact.privacyLink}</button>
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={!form.privacy || status === 'loading'}>
        {status === 'loading' ? t.contact.sending : t.contact.sendBtn}
      </button>
    </form>
  )
}

export default function Contact({ onScheduleClick }) {
  const { t } = useLanguage()
  const [subject, setSubject] = useState('')
  const [showPrivacy, setShowPrivacy] = useState(false)

  const subjects = [
    { value: '', label: `— ${t.contact.subjectLabel} —` },
    { value: 'general', label: t.contact.subjects.general },
    { value: 'schedule', label: t.contact.subjects.schedule },
    { value: 'prices', label: t.contact.subjects.prices },
    { value: 'jobs', label: t.contact.subjects.jobs },
  ]

  const handleSubjectChange = (e) => {
    const val = e.target.value
    if (val === 'schedule') {
      onScheduleClick()
    } else {
      setSubject(val)
    }
  }

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="contact__layout">
          <div className="contact__header-col">
            <p className="section-label">{t.contact.sectionLabel}</p>
            <h2 className="section-title">{t.contact.title}</h2>
            <p className="contact__intro">{t.contact.intro}</p>

            <hr className="divider" />

            <div className="contact__info">
              <div className="contact__info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>contact@jessicadahorta.com</span>
              </div>
              <div className="contact__info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Portugal</span>
              </div>
            </div>
          </div>

          <div className="contact__form-col">
            <div className="form-group">
              <label className="form-label">{t.contact.subjectLabel} <span className="required">*</span></label>
              <div className="form-select-wrapper">
                <select className="form-select" value={subject} onChange={handleSubjectChange}>
                  {subjects.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {subject === 'general' && <GeneralForm t={t} onPrivacyClick={() => setShowPrivacy(true)} />}
            {subject === 'prices' && <PricesForm t={t} onPrivacyClick={() => setShowPrivacy(true)} />}
            {subject === 'jobs' && <JobsForm t={t} onPrivacyClick={() => setShowPrivacy(true)} />}
            {subject === '' && (
              <div className="contact__placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--color-border)'}}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>{t.contact.intro}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPrivacy && <PrivacyModal t={t} onClose={() => setShowPrivacy(false)} />}

      <style>{`
        .contact {
          background: var(--color-off-white);
        }
        .contact__layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: var(--spacing-lg);
          align-items: start;
        }
        .contact__header-col {
          position: sticky;
          top: calc(var(--nav-height) + 2rem);
        }
        .contact__intro {
          margin-top: 0.75rem;
          font-size: 0.95rem;
        }
        .contact__info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: var(--spacing-sm);
        }
        .contact__info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: var(--color-text-secondary);
        }
        .contact__info-item svg {
          flex-shrink: 0;
          color: var(--color-primary);
        }
        .contact__form-col {
          background: var(--color-white);
          padding: var(--spacing-md);
        }
        .contact__placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem 0;
          text-align: center;
        }
        .contact__placeholder p {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          max-width: 280px;
        }
        .jobs-intro {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }
        .link-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: inherit;
          color: var(--color-primary);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal {
          background: var(--color-white);
          max-width: 560px;
          width: 100%;
          padding: var(--spacing-md);
          max-height: 80vh;
          overflow-y: auto;
        }
        .modal__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
        }
        .modal__header h3 {
          font-size: 1.1rem;
          font-weight: var(--weight-medium);
        }
        .modal__close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          padding: 0;
          transition: color var(--transition);
        }
        .modal__close:hover {
          color: var(--color-text);
        }
        .modal__body {
          font-size: 0.9rem;
          line-height: 1.8;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-md);
        }

        @media (max-width: 900px) {
          .contact__layout {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }
          .contact__header-col {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .contact__form-col {
            padding: 1.25rem;
          }
        }
      `}</style>
    </section>
  )
}
