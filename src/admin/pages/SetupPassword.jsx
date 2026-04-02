import { useState } from 'react'

export default function SetupPassword({ token, user, onSuccess }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A palavra-passe deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As palavras-passe não coincidem.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, user }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        sessionStorage.setItem('jdh_admin_token', data.token)
        setDone(true)
        setTimeout(() => {
          window.history.replaceState({}, '', window.location.pathname)
          onSuccess()
        }, 1500)
      } else if (data.error === 'invalid_token') {
        setError('Este link já foi utilizado ou expirou. Solicite um novo.')
      } else if (data.error === 'password_too_short') {
        setError('A palavra-passe deve ter pelo menos 8 caracteres.')
      } else {
        setError('Erro ao definir a palavra-passe. Tente novamente.')
      }
    } catch {
      setError('Erro de ligação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .setup-page {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
        }
        .setup-bg {
          position: fixed;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .setup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1;
        }
        .setup-card {
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,0.92);
          border: 1px solid #ddddd0;
          border-radius: 8px;
          padding: 48px 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          backdrop-filter: blur(6px);
        }
        .setup-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 20px;
        }
        .setup-title {
          font-family: 'Alexandria', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #1a1a18;
          margin: 0 0 6px;
          letter-spacing: 0.02em;
        }
        .setup-subtitle {
          font-family: 'Alexandria', sans-serif;
          font-size: 12px;
          color: #5a5a52;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin: 0 0 36px;
        }
        .setup-form { text-align: left; }
        .setup-field { margin-bottom: 16px; }
        .setup-label {
          display: block;
          font-family: 'Alexandria', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5a5a52;
          margin-bottom: 6px;
        }
        .setup-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #ddddd0;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 14px;
          color: #1a1a18;
          background: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .setup-input:focus { border-color: #555b37; }
        .setup-password-wrap { position: relative; }
        .setup-password-wrap .setup-input { padding-right: 44px; }
        .setup-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #5a5a52;
          line-height: 0;
        }
        .setup-eye-btn:hover { color: #1a1a18; }
        .setup-error {
          background: #fff3f3;
          border: 1px solid #f5c6c6;
          color: #b94040;
          border-radius: 4px;
          padding: 10px 14px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .setup-success {
          background: #f0f7ee;
          border: 1px solid #a8d4a0;
          color: #2e6b26;
          border-radius: 4px;
          padding: 10px 14px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .setup-btn {
          width: 100%;
          padding: 12px;
          background: #555b37;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: 'Alexandria', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.15s;
        }
        .setup-btn:hover:not(:disabled) { background: #454d2e; }
        .setup-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .setup-hint {
          font-family: 'Alexandria', sans-serif;
          font-size: 11px;
          color: #9a9a8e;
          margin-top: 6px;
        }
      `}</style>
      <div className="setup-page">
        <video className="setup-bg" src="/admin.webm" autoPlay muted loop playsInline />
        <div className="setup-overlay" />
        <div className="setup-card">
          <img src="/isotipo.webp" alt="Jessica da Horta" className="setup-logo" />
          <h1 className="setup-title">Jessica da Horta</h1>
          <p className="setup-subtitle">Definir Palavra-passe</p>

          {done ? (
            <div className="setup-success">Palavra-passe definida. A entrar no painel…</div>
          ) : (
            <form className="setup-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="setup-field">
                <label className="setup-label" htmlFor="new-password">Nova Palavra-passe</label>
                <div className="setup-password-wrap">
                  <input
                    id="new-password"
                    className="setup-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="setup-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="setup-hint">Mínimo 8 caracteres.</p>
              </div>

              <div className="setup-field">
                <label className="setup-label" htmlFor="confirm-password">Confirmar Palavra-passe</label>
                <input
                  id="confirm-password"
                  className="setup-input"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && <div className="setup-error">{error}</div>}

              <button className="setup-btn" type="submit" disabled={loading}>
                {loading ? 'A guardar…' : 'Definir Palavra-passe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
