import { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        sessionStorage.setItem('jdh_admin_token', data.token)
        onLogin()
      } else {
        setError('Credenciais inválidas')
      }
    } catch {
      setError('Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .login-page {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
        }
        .login-bg {
          position: fixed;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .login-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1;
        }
        .login-card {
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
        .login-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 20px;
        }
        .login-title {
          font-family: 'Alexandria', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #1a1a18;
          margin: 0 0 6px;
          letter-spacing: 0.02em;
        }
        .login-subtitle {
          font-family: 'Alexandria', sans-serif;
          font-size: 12px;
          color: #5a5a52;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin: 0 0 36px;
        }
        .login-form {
          text-align: left;
        }
        .login-field {
          margin-bottom: 16px;
        }
        .login-label {
          display: block;
          font-family: 'Alexandria', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5a5a52;
          margin-bottom: 6px;
        }
        .login-input {
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
        .login-input:focus {
          border-color: #555b37;
        }
        .login-password-wrap {
          position: relative;
        }
        .login-password-wrap .login-input {
          padding-right: 44px;
        }
        .login-eye-btn {
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
        .login-eye-btn:hover { color: #1a1a18; }
        .login-error {
          background: #fff3f3;
          border: 1px solid #f5c6c6;
          color: #b94040;
          border-radius: 4px;
          padding: 10px 14px;
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .login-btn {
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
        .login-btn:hover:not(:disabled) { background: #454d2e; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
      <div className="login-page">
        <video className="login-bg" src="/admin.webm" autoPlay muted loop playsInline />
        <div className="login-overlay" />
        <div className="login-card">
          <img src="/isotipo.webp" alt="Jessica da Horta" className="login-logo" />
          <h1 className="login-title">Jessica da Horta</h1>
          <p className="login-subtitle">Painel de Administração</p>

          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="login-field">
              <label className="login-label" htmlFor="username">Utilizador</label>
              <input
                id="username"
                className="login-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="password">Palavra-passe</label>
              <div className="login-password-wrap">
                <input
                  id="password"
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
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
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'A entrar…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
