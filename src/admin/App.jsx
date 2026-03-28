import { useState, useEffect } from 'react'
import Login from './pages/Login.jsx'
import AdminLayout from './components/AdminLayout.jsx'

export default function AdminApp() {
  const [token, setToken] = useState(() => sessionStorage.getItem('jdh_admin_token'))

  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.fontFamily = "'Alexandria', sans-serif"
    document.body.style.backgroundColor = '#f8f7f4'
  }, [])

  function handleLogin() {
    setToken(sessionStorage.getItem('jdh_admin_token'))
  }

  function handleLogout() {
    sessionStorage.removeItem('jdh_admin_token')
    setToken(null)
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  return <AdminLayout onLogout={handleLogout} />
}
