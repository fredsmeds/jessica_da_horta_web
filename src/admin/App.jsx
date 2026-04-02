import { useState, useEffect } from 'react'
import Login from './pages/Login.jsx'
import SetupPassword from './pages/SetupPassword.jsx'
import AdminLayout from './components/AdminLayout.jsx'

export default function AdminApp() {
  const [token, setToken] = useState(() => sessionStorage.getItem('jdh_admin_token'))
  const [setupParams, setSetupParams] = useState(null)

  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.fontFamily = "'Alexandria', sans-serif"
    document.body.style.backgroundColor = '#f8f7f4'

    const params = new URLSearchParams(window.location.search)
    const setupToken = params.get('setup')
    const setupUser = params.get('user')
    if (setupToken && setupUser) {
      setSetupParams({ token: setupToken, user: setupUser })
    }
  }, [])

  function handleLogin() {
    setToken(sessionStorage.getItem('jdh_admin_token'))
  }

  function handleLogout() {
    sessionStorage.removeItem('jdh_admin_token')
    setToken(null)
  }

  if (setupParams) {
    return <SetupPassword token={setupParams.token} user={setupParams.user} onSuccess={handleLogin} />
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  return <AdminLayout onLogout={handleLogout} />
}
