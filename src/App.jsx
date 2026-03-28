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

// Landing zones: x/y as fraction of viewport, near plant-heavy edges
const LEAF_ZONES = [
  // Left edge — plants1,2,3 visible on desktop
  { x: 0.04, y: 0.15 }, { x: 0.07, y: 0.30 }, { x: 0.03, y: 0.55 },
  { x: 0.08, y: 0.70 }, { x: 0.05, y: 0.85 },
  // Right edge
  { x: 0.93, y: 0.20 }, { x: 0.96, y: 0.40 }, { x: 0.91, y: 0.60 },
  { x: 0.94, y: 0.75 }, { x: 0.97, y: 0.90 },
  // Upper corners (hero plants)
  { x: 0.10, y: 0.08 }, { x: 0.88, y: 0.08 },
]

function pickZone(excludeIdx) {
  let idx
  do { idx = Math.floor(Math.random() * LEAF_ZONES.length) } while (idx === excludeIdx)
  return { idx, x: LEAF_ZONES[idx].x * window.innerWidth, y: LEAF_ZONES[idx].y * window.innerHeight }
}

function FlyingLadybugs() {
  const ref0 = useRef(null)
  const ref1 = useRef(null)

  useEffect(() => {
    const SIZE = 26
    const bugs = [ref0, ref1].map((ref, i) => {
      const zone = pickZone(-1)
      return {
        ref,
        x: zone.x, y: zone.y,
        vx: 0, vy: 0,
        angle: 0,
        zoneIdx: zone.idx,
        state: 'resting',
        restRemain: (i === 0 ? 2 : 5) + Math.random() * 3,
        wobblePhase: Math.random() * Math.PI * 2,
        speed: 55 + Math.random() * 45,
        target: null,
        wingTimer: 0,
        wingOpen: false,
      }
    })

    let last = null
    let raf

    function tick(ts) {
      if (!last) last = ts
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts

      bugs.forEach(b => {
        if (!b.ref.current) return

        if (b.state === 'resting') {
          b.wingOpen = false
          b.wingTimer = 0
          b.restRemain -= dt
          if (b.restRemain <= 0) {
            const dest = pickZone(b.zoneIdx)
            b.target = dest
            b.zoneIdx = dest.idx
            b.state = 'flying'
            b.wobblePhase = Math.random() * Math.PI * 2
            b.speed = 55 + Math.random() * 55
          }
        } else {
          const dx = b.target.x - b.x
          const dy = b.target.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 6) {
            b.x = b.target.x
            b.y = b.target.y
            b.vx = 0; b.vy = 0
            b.state = 'resting'
            b.restRemain = 3 + Math.random() * 6
          } else {
            b.wobblePhase += dt * 3.5
            const nx = dx / dist, ny = dy / dist
            const wobble = Math.sin(b.wobblePhase) * 0.35
            const tx = (nx - ny * wobble) * b.speed
            const ty = (ny + nx * wobble) * b.speed
            const steer = Math.min(dt * 4, 1)
            b.vx += (tx - b.vx) * steer
            b.vy += (ty - b.vy) * steer
            b.x += b.vx * dt
            b.y += b.vy * dt
            if (Math.hypot(b.vx, b.vy) > 2)
              b.angle = Math.atan2(b.vy, b.vx) * 180 / Math.PI + 90
            // Wing flap at ~12fps
            b.wingTimer += dt
            if (b.wingTimer > 0.08) {
              b.wingTimer = 0
              b.wingOpen = !b.wingOpen
            }
          }
        }

        const el = b.ref.current
        el.style.left = (b.x - SIZE / 2) + 'px'
        el.style.top = (b.y - SIZE / 2) + 'px'
        el.style.transform = `rotate(${b.angle}deg)`
        el.src = b.wingOpen ? '/bug2_open_wings.png' : '/bug2_closed_wings.png'
      })

      raf = requestAnimationFrame(tick)
    }

    // Set initial positions
    bugs.forEach(b => {
      if (b.ref.current) {
        b.ref.current.style.left = (b.x - SIZE / 2) + 'px'
        b.ref.current.style.top = (b.y - SIZE / 2) + 'px'
      }
    })

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const style = { position: 'fixed', width: 26, height: 26, pointerEvents: 'none', zIndex: 50, userSelect: 'none' }
  return (
    <>
      <img ref={ref0} src="/bug2_closed_wings.png" alt="" aria-hidden="true" style={style} />
      <img ref={ref1} src="/bug2_closed_wings.png" alt="" aria-hidden="true" style={style} />
    </>
  )
}

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

      <FlyingLadybugs />

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
