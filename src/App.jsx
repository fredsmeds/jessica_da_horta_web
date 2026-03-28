import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import FAQ from './components/FAQ.jsx'
import Contact from './components/Contact.jsx'
import ScheduleVisit from './components/ScheduleVisit.jsx'
import Footer from './components/Footer.jsx'
import { useLanguage } from './i18n/index.jsx'

function PrivacyModal({ onClose }) {
  const { t } = useLanguage()
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

const SECTIONS = ['home', 'about', 'projects', 'faq', 'contact', 'schedule']

export default function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const isScrollingTo = useRef(false)

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingTo.current) return
        let best = null
        let bestRatio = 0
        entries.forEach(entry => {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            best = entry.target.id
          }
        })
        if (best) setActiveSection(best)
      },
      {
        threshold: [0.2, 0.5],
        rootMargin: '-72px 0px 0px 0px',
      }
    )

    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    isScrollingTo.current = true
    setActiveSection(id)
    const top = el.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top, behavior: 'smooth' })
    setTimeout(() => { isScrollingTo.current = false }, 800)
  }

  return (
    <>
      <Navbar
        activeSection={activeSection}
        onNavClick={scrollToSection}
      />

      <main>
        <Hero onScheduleClick={() => scrollToSection('schedule')} />
        <About />
        <div className="fondo4-band">
          <div className="fondo4-band__bg" />
          <img src="/plant5.webp" alt="" aria-hidden="true" className="fondo4-bg-plant" />
          <Projects />
          <FAQ />
        </div>
        <Contact onScheduleClick={() => scrollToSection('schedule')} />
        <ScheduleVisit />
      </main>

      <Footer
        onNavClick={scrollToSection}
        onPrivacyClick={() => setShowPrivacy(true)}
      />

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      <style>{`
        .fondo4-band {
          position: relative;
          overflow: hidden;
        }
        .fondo4-band__bg {
          position: absolute;
          inset: 0;
          background-image: url('/fondo4.webp');
          background-size: 100% auto;
          background-position: top center;
          background-repeat: no-repeat;
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }
        .fondo4-band .container {
          position: relative;
          z-index: 1;
        }
        .projects { background: transparent !important; }
        .faq { background: transparent !important; }
        .fondo4-bg-plant { display: none; }
        @media (max-width: 1024px) {
          .fondo4-band__bg { display: none; }
          .fondo4-bg-plant {
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
            top: 0;
            left: 0;
            opacity: 0.18;
            pointer-events: none;
            z-index: 0;
          }
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
      `}</style>
    </>
  )
}
