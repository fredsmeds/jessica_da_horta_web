import { useLanguage } from '../i18n/index.jsx'

export default function Hero({ onScheduleClick }) {
  const { t } = useLanguage()

  return (
    <section id="home" className="hero">
      {/* Background video */}
      <div className="hero__video-wrap">
        <video
          className="hero__video"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero2.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay" />
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__logo-wrap">
          <img
            src="/imagotipo_white.webp"
            alt="Jessica da Horta Garden Design"
            className="hero__logo"
          />
        </div>

        <p className="hero__tagline">{t.hero.tagline}</p>

        <button className="btn btn-ghost hero__cta" onClick={onScheduleClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {t.hero.cta}
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <span className="hero__scroll-line" />
      </div>

      <style>{`
        .hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .hero__video-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.45) 60%,
            rgba(0,0,0,0.65) 100%
          );
        }
        .hero__content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 1.5rem;
          margin-top: var(--nav-height);
        }
        .hero__logo-wrap {
          margin-bottom: 2.5rem;
        }
        .hero__logo {
          width: clamp(180px, 30vw, 320px);
          height: auto;
          filter: brightness(0) invert(1);
        }
        .hero__tagline {
          font-size: clamp(0.9rem, 1.8vw, 1.05rem);
          font-weight: var(--weight-light);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          margin-bottom: 2.5rem;
          max-width: 560px;
        }
        .hero__cta {
          font-size: 0.8rem;
          letter-spacing: 0.12em;
        }
        .hero__scroll {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero__scroll-line {
          display: block;
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }
      `}</style>
    </section>
  )
}
