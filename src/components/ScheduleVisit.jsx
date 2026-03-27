import { useState } from 'react'
import { useLanguage } from '../i18n/index.jsx'

const TOTAL_STEPS = 9

function StepIndicator({ current, total, steps }) {
  return (
    <div className="sv-steps">
      {steps.map((label, i) => (
        <div
          key={i}
          className={`sv-step${i + 1 === current ? ' sv-step--active' : ''}${i + 1 < current ? ' sv-step--done' : ''}`}
        >
          <div className="sv-step__dot">
            {i + 1 < current ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <span className="sv-step__label">{label}</span>
        </div>
      ))}
    </div>
  )
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="form-radio-group">
      {options.map(opt => (
        <div key={opt.value} className="form-radio-option">
          <input
            type="radio"
            id={`${name}-${opt.value}`}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <label htmlFor={`${name}-${opt.value}`}>{opt.label}</label>
        </div>
      ))}
    </div>
  )
}

function CheckGroup({ options, values, onChange }) {
  const toggle = (key) => {
    const next = values.includes(key) ? values.filter(v => v !== key) : [...values, key]
    onChange(next)
  }
  return (
    <div className="check-group">
      {options.map(opt => (
        <div key={opt.value} className="check-option">
          <input
            type="checkbox"
            id={`check-${opt.value}`}
            checked={values.includes(opt.value)}
            onChange={() => toggle(opt.value)}
          />
          <label htmlFor={`check-${opt.value}`}>{opt.label}</label>
        </div>
      ))}
    </div>
  )
}

// ===== STEP COMPONENTS =====

function Step1({ data, set, t }) {
  const s = t.schedule
  return (
    <>
      <p className="sv-step-desc">{s.s1desc}</p>
      <div className="form-group">
        <label className="form-label">{s.fullNameLabel} <span className="required">*</span></label>
        <input className="form-input" type="text" required value={data.fullName} onChange={e => set('fullName', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{s.phoneLabel} <span className="required">*</span></label>
          <input className="form-input" type="tel" required value={data.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{s.emailLabel} <span className="required">*</span></label>
          <input className="form-input" type="email" required value={data.email} onChange={e => set('email', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">{s.addressLabel} <span className="required">*</span></label>
        <input className="form-input" type="text" required value={data.address} onChange={e => set('address', e.target.value)} />
      </div>
    </>
  )
}

function Step2({ data, set, t }) {
  const s = t.schedule
  const yesNo = [{ value: 'yes', label: s.yes }, { value: 'no', label: s.no }]
  const formats = [{ value: 'pdf', label: s.pdf }, { value: 'dwg', label: s.dwg }, { value: 'other', label: s.other }]
  return (
    <>
      <p className="sv-step-desc">{s.s2desc}</p>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{s.totalAreaLabel} <span className="required">*</span></label>
          <input className="form-input" type="number" min="0" required value={data.totalArea} onChange={e => set('totalArea', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{s.interventionAreaLabel} <span className="required">*</span></label>
          <input className="form-input" type="number" min="0" required value={data.interventionArea} onChange={e => set('interventionArea', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">{s.limitsLabel} <span className="required">*</span></label>
        <p className="form-hint" style={{marginBottom:'0.5rem'}}>{s.limitsDesc}</p>
        <textarea className="form-textarea" required value={data.limits} onChange={e => set('limits', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.topoLabel} <span className="required">*</span></label>
        <RadioGroup name="topo" options={yesNo} value={data.topo} onChange={v => set('topo', v)} />
      </div>
      {data.topo === 'yes' && (
        <div className="form-group">
          <label className="form-label">{s.topoFormatLabel}</label>
          <RadioGroup name="topoFormat" options={formats} value={data.topoFormat} onChange={v => set('topoFormat', v)} />
        </div>
      )}
      <div className="form-group">
        <label className="form-label">{s.constructionsLabel} <span className="required">*</span></label>
        <RadioGroup name="constructions" options={yesNo} value={data.constructions} onChange={v => set('constructions', v)} />
      </div>
      {data.constructions === 'yes' && (
        <div className="form-group">
          <label className="form-label">{s.constructionsDescLabel}</label>
          <textarea className="form-textarea" value={data.constructionsDesc} onChange={e => set('constructionsDesc', e.target.value)} />
        </div>
      )}
    </>
  )
}

function Step3({ data, set, t }) {
  const s = t.schedule
  const yesNo = [{ value: 'yes', label: s.yes }, { value: 'no', label: s.no }]
  const waterSourceOptions = Object.entries(s.waterSources).map(([k, v]) => ({ value: k, label: v }))
  return (
    <>
      <p className="sv-step-desc">{s.s3desc}</p>
      <div className="form-group">
        <label className="form-label">{s.soilAnalysisLabel} <span className="required">*</span></label>
        <RadioGroup name="soilAnalysis" options={yesNo} value={data.soilAnalysis} onChange={v => set('soilAnalysis', v)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.waterAnalysisLabel} <span className="required">*</span></label>
        <RadioGroup name="waterAnalysis" options={yesNo} value={data.waterAnalysis} onChange={v => set('waterAnalysis', v)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.waterSourcesLabel} <span className="required">*</span></label>
        <CheckGroup options={waterSourceOptions} values={data.waterSources} onChange={v => set('waterSources', v)} />
      </div>
      {(data.waterSources.includes('rainwater') || data.waterSources.includes('tank')) && (
        <div className="form-group">
          <label className="form-label">{s.waterStorageLabel}</label>
          <input className="form-input" type="text" value={data.waterStorage} onChange={e => set('waterStorage', e.target.value)} />
        </div>
      )}
    </>
  )
}

function Step4({ data, set, t }) {
  const s = t.schedule
  const yesNo = [{ value: 'yes', label: s.yes }, { value: 'no', label: s.no }]
  return (
    <>
      <p className="sv-step-desc">{s.s4desc}</p>
      <div className="form-group">
        <label className="form-label">{s.hasPetsLabel} <span className="required">*</span></label>
        <RadioGroup name="hasPets" options={yesNo} value={data.hasPets} onChange={v => set('hasPets', v)} />
      </div>
      {data.hasPets === 'yes' && (
        <>
          <div className="form-group">
            <label className="form-label">{s.petsDescLabel}</label>
            <textarea className="form-textarea" value={data.petsDesc} onChange={e => set('petsDesc', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{s.petsAccessLabel}</label>
            <RadioGroup name="petsAccess" options={yesNo} value={data.petsAccess} onChange={v => set('petsAccess', v)} />
          </div>
        </>
      )}
    </>
  )
}

function Step5({ data, set, t }) {
  const s = t.schedule
  const styleOptions = Object.entries(s.plantingStyles).map(([k, v]) => ({ value: k, label: v }))
  const plantTypeOptions = Object.entries(s.plantTypes).map(([k, v]) => ({ value: k, label: v }))
  const desiredOptions = Object.entries(s.desiredElements).map(([k, v]) => ({ value: k, label: v }))
  return (
    <>
      <p className="sv-step-desc">{s.s5desc}</p>
      <div className="form-group">
        <label className="form-label">{s.plantingStyleLabel} <span className="required">*</span></label>
        <p className="form-hint" style={{marginBottom:'0.5rem'}}>{s.plantingStyleDesc}</p>
        <RadioGroup name="plantingStyle" options={styleOptions} value={data.plantingStyle} onChange={v => set('plantingStyle', v)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.pathStyleLabel} <span className="required">*</span></label>
        <p className="form-hint" style={{marginBottom:'0.5rem'}}>{s.pathStyleDesc}</p>
        <RadioGroup name="pathStyle" options={styleOptions} value={data.pathStyle} onChange={v => set('pathStyle', v)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.plantTypesLabel} <span className="required">*</span></label>
        <CheckGroup options={plantTypeOptions} values={data.plantTypes} onChange={v => set('plantTypes', v)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.colorsLabel} <span className="required">*</span></label>
        <input className="form-input" type="text" value={data.colors} onChange={e => set('colors', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.desiredElementsLabel} <span className="required">*</span></label>
        <CheckGroup options={desiredOptions} values={data.desiredElements} onChange={v => set('desiredElements', v)} />
      </div>
    </>
  )
}

function Step6({ data, set, t }) {
  const s = t.schedule
  const serviceOptions = Object.entries(s.services).map(([k, v]) => ({ value: k, label: v }))
  return (
    <>
      <p className="sv-step-desc">{s.s6desc}</p>
      <div className="form-group">
        <label className="form-label">{s.serviceTypeLabel} <span className="required">*</span></label>
        <RadioGroup name="serviceType" options={serviceOptions} value={data.serviceType} onChange={v => set('serviceType', v)} />
      </div>
    </>
  )
}

function Step7({ data, set, t }) {
  const s = t.schedule
  const seasonOptions = Object.entries(s.seasons).map(([k, v]) => ({ value: k, label: v }))
  return (
    <>
      <p className="sv-step-desc">{s.s7desc}</p>
      <div className="form-group">
        <label className="form-label">{s.installationLabel} <span className="required">*</span></label>
        <RadioGroup name="installation" options={seasonOptions} value={data.installation} onChange={v => set('installation', v)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.prioritiesLabel} <span className="required">*</span></label>
        <input className="form-input" type="text" value={data.priorities} onChange={e => set('priorities', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{s.additionalDescLabel}</label>
        <textarea className="form-textarea" value={data.additionalDesc} onChange={e => set('additionalDesc', e.target.value)} />
      </div>
    </>
  )
}

function Step8({ data, set, t }) {
  const s = t.schedule
  const yesNo = [{ value: 'yes', label: s.yes }, { value: 'no', label: s.no }]
  return (
    <>
      <div className="form-group">
        <label className="form-label">{s.maintenanceTeamLabel} <span className="required">*</span></label>
        <RadioGroup name="maintenanceTeam" options={yesNo} value={data.maintenanceTeam} onChange={v => set('maintenanceTeam', v)} />
      </div>
      {data.maintenanceTeam === 'yes' && (
        <div className="form-group">
          <label className="form-label">{s.maintenanceDetailsLabel}</label>
          <textarea className="form-textarea" value={data.maintenanceDetails} onChange={e => set('maintenanceDetails', e.target.value)} />
        </div>
      )}
    </>
  )
}

function Step9({ data, set, t, onPrivacyClick }) {
  const s = t.schedule
  return (
    <>
      <p className="sv-step-desc">{s.s9desc}</p>
      <div className="form-group">
        <label className="form-label">{s.observationsLabel}</label>
        <textarea className="form-textarea" style={{minHeight:'160px'}} value={data.observations} onChange={e => set('observations', e.target.value)} />
      </div>
      <div className="form-checkbox-group">
        <input
          type="checkbox"
          id="sv-privacy"
          checked={data.privacy}
          onChange={e => set('privacy', e.target.checked)}
          required
        />
        <label htmlFor="sv-privacy">
          {s.privacyText}{' '}
          <button type="button" className="link-btn" onClick={onPrivacyClick}>{s.privacyLink}</button>
        </label>
      </div>
    </>
  )
}

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

const initialData = {
  // Step 1
  fullName: '', phone: '', email: '', address: '',
  // Step 2
  totalArea: '', interventionArea: '', limits: '',
  topo: '', topoFormat: '', constructions: '', constructionsDesc: '',
  // Step 3
  soilAnalysis: '', waterAnalysis: '', waterSources: [], waterStorage: '',
  // Step 4
  hasPets: '', petsDesc: '', petsAccess: '',
  // Step 5
  plantingStyle: '', pathStyle: '', plantTypes: [], colors: '', desiredElements: [],
  // Step 6
  serviceType: '',
  // Step 7
  installation: '', priorities: '', additionalDesc: '',
  // Step 8
  maintenanceTeam: '', maintenanceDetails: '',
  // Step 9
  observations: '', privacy: false,
}

export default function ScheduleVisit() {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [showPrivacy, setShowPrivacy] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  const stepLabel = t.schedule.stepOf
    .replace('{current}', step)
    .replace('{total}', TOTAL_STEPS)

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(s => s - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.privacy) return
    setStatus('loading')
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const s = t.schedule

  if (status === 'success') {
    return (
      <section id="schedule" className="sv section">
        <div className="container">
          <div className="sv__success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--color-primary)'}}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2>{s.successTitle}</h2>
            <p>{s.successText}</p>
          </div>
        </div>
        <style>{svStyles}</style>
      </section>
    )
  }

  const stepTitles = [s.s1title, s.s2title, s.s3title, s.s4title, s.s5title, s.s6title, s.s7title, s.s8title, s.s9title]
  const currentTitle = stepTitles[step - 1]

  return (
    <section id="schedule" className="sv section">
      <div className="container">
        <p className="section-label">{s.sectionLabel}</p>
        <h2 className="section-title">{s.title}</h2>
        <p className="sv__intro">{s.intro}</p>
        <div className="sv__note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {s.note}
        </div>

        <div className="sv__layout">
          {/* Sidebar steps */}
          <div className="sv__sidebar">
            <StepIndicator current={step} total={TOTAL_STEPS} steps={s.steps} />
          </div>

          {/* Form */}
          <div className="sv__form-area">
            <div className="sv__form-header">
              <span className="sv__step-counter">{stepLabel}</span>
              <h3 className="sv__step-title">{currentTitle}</h3>
            </div>

            {status === 'error' && (
              <div className="alert alert-error">{s.errorText}</div>
            )}

            <form onSubmit={step === TOTAL_STEPS ? handleSubmit : e => { e.preventDefault(); handleNext() }}>
              {step === 1 && <Step1 data={data} set={set} t={t} />}
              {step === 2 && <Step2 data={data} set={set} t={t} />}
              {step === 3 && <Step3 data={data} set={set} t={t} />}
              {step === 4 && <Step4 data={data} set={set} t={t} />}
              {step === 5 && <Step5 data={data} set={set} t={t} />}
              {step === 6 && <Step6 data={data} set={set} t={t} />}
              {step === 7 && <Step7 data={data} set={set} t={t} />}
              {step === 8 && <Step8 data={data} set={set} t={t} />}
              {step === 9 && <Step9 data={data} set={set} t={t} onPrivacyClick={() => setShowPrivacy(true)} />}

              <div className="sv__nav">
                {step > 1 && (
                  <button type="button" className="btn btn-outline" onClick={handlePrev}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    {s.prevBtn}
                  </button>
                )}
                <div style={{flex:1}} />
                {step < TOTAL_STEPS ? (
                  <button type="submit" className="btn btn-primary">
                    {s.nextBtn}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!data.privacy || status === 'loading'}
                  >
                    {status === 'loading' ? s.submitting : s.submitBtn}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {showPrivacy && <PrivacyModal t={t} onClose={() => setShowPrivacy(false)} />}

      <style>{svStyles}</style>
    </section>
  )
}

const svStyles = `
  .sv {
    background: var(--color-white);
  }
  .sv__intro {
    max-width: 680px;
    margin-top: 0.5rem;
    font-size: 0.95rem;
  }
  .sv__note {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    margin-top: 1rem;
    padding: 0.85rem 1.1rem;
    background: var(--color-off-white);
    border-left: 3px solid var(--color-primary);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    max-width: 680px;
  }
  .sv__note svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--color-primary);
  }
  .sv__layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-md);
    align-items: start;
  }
  .sv__sidebar {
    position: sticky;
    top: calc(var(--nav-height) + 2rem);
  }
  .sv-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .sv-step {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.6rem 0;
    position: relative;
  }
  .sv-step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 10px;
    top: 32px;
    bottom: -4px;
    width: 1px;
    background: var(--color-border);
  }
  .sv-step--done:not(:last-child)::after,
  .sv-step--active:not(:last-child)::after {
    background: var(--color-primary);
  }
  .sv-step__dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--color-white);
    position: relative;
    z-index: 1;
  }
  .sv-step--active .sv-step__dot {
    border-color: var(--color-primary);
    background: var(--color-primary);
  }
  .sv-step--done .sv-step__dot {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: white;
  }
  .sv-step__dot span {
    font-size: 0.65rem;
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }
  .sv-step--active .sv-step__dot span {
    color: white;
  }
  .sv-step__label {
    font-size: 0.75rem;
    font-weight: var(--weight-regular);
    color: var(--color-text-secondary);
    line-height: 1.4;
    padding-top: 2px;
    transition: color var(--transition);
  }
  .sv-step--active .sv-step__label {
    color: var(--color-primary);
    font-weight: var(--weight-medium);
  }
  .sv-step--done .sv-step__label {
    color: var(--color-primary);
  }
  .sv__form-area {
    background: var(--color-off-white);
    padding: var(--spacing-md);
  }
  .sv__form-header {
    margin-bottom: var(--spacing-md);
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }
  .sv__step-counter {
    font-size: 0.72rem;
    font-weight: var(--weight-medium);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-primary);
    display: block;
    margin-bottom: 0.4rem;
  }
  .sv__step-title {
    font-size: 1.3rem;
    font-weight: var(--weight-light);
  }
  .sv-step-desc {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.7;
  }
  .sv__nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: var(--spacing-md);
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
  }
  .sv__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
    padding: var(--spacing-xl) 0;
    max-width: 480px;
    margin: 0 auto;
  }
  .sv__success h2 {
    font-size: 1.8rem;
  }
  .sv__success p {
    font-size: 1rem;
    color: var(--color-text-secondary);
  }
  .check-group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .check-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .check-option input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--color-primary);
    cursor: pointer;
    flex-shrink: 0;
  }
  .check-option label {
    font-size: 0.95rem;
    color: var(--color-text);
    cursor: pointer;
    line-height: 1.5;
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
  .modal__close:hover { color: var(--color-text); }
  .modal__body {
    font-size: 0.9rem;
    line-height: 1.8;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
  }

  @media (max-width: 900px) {
    .sv__layout {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }
    .sv__sidebar {
      position: static;
    }
    .sv-steps {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .sv-step {
      flex-direction: column;
      align-items: center;
      padding: 0.4rem;
    }
    .sv-step:not(:last-child)::after {
      display: none;
    }
    .sv-step__label {
      display: none;
    }
    .sv-step__dot {
      width: 28px;
      height: 28px;
    }
  }

  @media (max-width: 640px) {
    .sv__form-area {
      padding: 1.25rem;
    }
  }
`
