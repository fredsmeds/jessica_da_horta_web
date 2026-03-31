import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import FAQ from './components/FAQ.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import FakeCursor from './components/FakeCursor.jsx'
import BlogPage from './pages/BlogPage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import { useLanguage } from './i18n/index.jsx'

// Leaf landing spots per section, as fractions of each section's bounding rect.
// Positioned near edges where fondo botanical art is concentrated.
const SECTION_LEAF_SPOTS = {
  about:    [{ xF: 0.06, yF: 0.30 }, { xF: 0.92, yF: 0.45 }, { xF: 0.05, yF: 0.68 }],
  projects: [{ xF: 0.09, yF: 0.35 }, { xF: 0.90, yF: 0.55 }, { xF: 0.07, yF: 0.80 }],
  faq:      [{ xF: 0.08, yF: 0.28 }, { xF: 0.91, yF: 0.52 }, { xF: 0.06, yF: 0.78 }],
  schedule: [{ xF: 0.07, yF: 0.22 }, { xF: 0.93, yF: 0.44 }, { xF: 0.04, yF: 0.66 }],
}
const BUG_HOME = ['about', 'projects', 'faq', 'schedule']

function getSpotVP(sectionId, xF, yF) {
  const el = document.getElementById(sectionId)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width * xF, y: r.top + r.height * yF }
}

function FlyingLadybugs() {
  const ref0 = useRef(null)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)

  useEffect(() => {
    const SIZE = 26
    const refs = [ref0, ref1, ref2, ref3]

    const bugs = refs.map((ref, i) => ({
      ref,
      sectionId: BUG_HOME[i],
      spotIdx: 0,
      x: -100, y: -100,
      vx: 0, vy: 0,
      angle: 0,
      state: 'hidden',
      restRemain: 0,
      wobblePhase: Math.random() * Math.PI * 2,
      speed: 60 + Math.random() * 40,
      target: null,
      wingTimer: 0,
      wingOpen: false,
    }))

    function tryActivate(b) {
      const section = document.getElementById(b.sectionId)
      if (!section) return
      const r = section.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.top > vh || r.bottom < 0) return // section not visible at all
      const spots = SECTION_LEAF_SPOTS[b.sectionId]
      // Pick first spot that falls within the current viewport
      for (let i = 0; i < spots.length; i++) {
        const pos = getSpotVP(b.sectionId, spots[i].xF, spots[i].yF)
        if (pos && pos.y > 20 && pos.y < vh - 20) {
          b.x = pos.x; b.y = pos.y; b.spotIdx = i
          b.state = 'resting'; b.restRemain = 1 + Math.random() * 2
          return
        }
      }
      // Fallback: use first spot regardless
      const pos = getSpotVP(b.sectionId, spots[0].xF, spots[0].yF)
      if (pos) { b.x = pos.x; b.y = pos.y; b.spotIdx = 0; b.state = 'resting'; b.restRemain = 1 + Math.random() * 2 }
    }

    function pickNextSpot(bug) {
      const spots = SECTION_LEAF_SPOTS[bug.sectionId]
      let next
      do { next = Math.floor(Math.random() * spots.length) } while (next === bug.spotIdx)
      bug.spotIdx = next
      return getSpotVP(bug.sectionId, spots[next].xF, spots[next].yF)
    }

    function escapeBug(b) {
      const spots = SECTION_LEAF_SPOTS[b.sectionId]
      let bestIdx = -1, bestDist = -1
      for (let i = 0; i < spots.length; i++) {
        if (i === b.spotIdx) continue
        const pos = getSpotVP(b.sectionId, spots[i].xF, spots[i].yF)
        if (!pos) continue
        const d = Math.hypot(pos.x - mouse.x, pos.y - mouse.y)
        if (d > bestDist) { bestDist = d; bestIdx = i }
      }
      const idx = bestIdx !== -1 ? bestIdx : (b.spotIdx + 1) % spots.length
      b.spotIdx = idx
      b.target = getSpotVP(b.sectionId, spots[idx].xF, spots[idx].yF)
      b.state = 'flying'
      b.speed = 140 + Math.random() * 40
      b.wobblePhase = Math.random() * Math.PI * 2
    }

    const mouse = { x: -999, y: -999 }
    const onMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMouseMove)

    let last = null
    let raf

    function tick(ts) {
      if (!last) last = ts
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts

      bugs.forEach(b => {
        if (!b.ref.current) return
        if (b.state === 'hidden') { tryActivate(b); return }
        const el = b.ref.current

        if (b.state === 'resting') {
          // Track section as user scrolls
          const spots = SECTION_LEAF_SPOTS[b.sectionId]
          const pos = getSpotVP(b.sectionId, spots[b.spotIdx].xF, spots[b.spotIdx].yF)
          if (pos) { b.x = pos.x; b.y = pos.y }

          b.wingOpen = false
          b.wingTimer = 0
          el.style.opacity = '0.55'
          b.restRemain -= dt
          if (Math.hypot(b.x - mouse.x, b.y - mouse.y) < 55) { escapeBug(b); return }

          if (b.restRemain <= 0) {
            const dest = pickNextSpot(b)
            if (dest) {
              b.target = dest
              b.state = 'flying'
              b.wobblePhase = Math.random() * Math.PI * 2
              b.speed = 60 + Math.random() * 50
            }
          }
        } else {
          // Keep target position fresh as page scrolls
          const spots = SECTION_LEAF_SPOTS[b.sectionId]
          const fresh = getSpotVP(b.sectionId, spots[b.spotIdx].xF, spots[b.spotIdx].yF)
          if (fresh) b.target = fresh

          const dx = b.target.x - b.x
          const dy = b.target.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          el.style.opacity = '0.55'

          if (dist < 8) {
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
            b.wingTimer += dt
            if (b.wingTimer > 0.08) { b.wingTimer = 0; b.wingOpen = !b.wingOpen }
          }
        }

        el.style.left = (b.x - SIZE / 2) + 'px'
        el.style.top = (b.y - SIZE / 2) + 'px'
        el.style.transform = `rotate(${b.angle}deg)`
        el.src = b.wingOpen ? '/bug2_open_wings.png' : '/bug2_closed_wings.png'
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMouseMove) }
  }, [])

  const style = { position: 'fixed', width: 26, height: 26, pointerEvents: 'none', zIndex: 50, userSelect: 'none', opacity: 0 }
  return (
    <>
      <img ref={ref0} src="/bug2_closed_wings.png" alt="" aria-hidden="true" style={style} />
      <img ref={ref1} src="/bug2_closed_wings.png" alt="" aria-hidden="true" style={style} />
      <img ref={ref2} src="/bug2_closed_wings.png" alt="" aria-hidden="true" style={style} />
      <img ref={ref3} src="/bug2_closed_wings.png" alt="" aria-hidden="true" style={style} />
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

function MainPage() {
  const [activeSection, setActiveSection] = useState('home')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const isScrollingTo = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Scroll to section when arriving from a sub-page
  useEffect(() => {
    const id = location.state?.scrollTo
    if (id) {
      // clear state so back-navigation doesn't re-trigger
      window.history.replaceState({}, '')
      setTimeout(() => scrollToSection(id), 80)
    }
  }, [])

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
        <Hero onScheduleClick={() => navigate('/agendar')} />
        <About />
        <div className="fondo4-band">
          <div className="fondo4-band__bg" />
          <img src="/plant5.webp" alt="" aria-hidden="true" className="fondo4-bg-plant" />
          <Projects />
          <FAQ />
        </div>
        <Contact onScheduleClick={() => navigate('/agendar')} />
      </main>

      <Footer
        onNavClick={scrollToSection}
        onPrivacyClick={() => setShowPrivacy(true)}
      />

      <FlyingLadybugs />
      <FakeCursor />

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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/agendar" element={<SchedulePage />} />
    </Routes>
  )
}
