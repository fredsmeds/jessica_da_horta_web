import { useState } from 'react'
import Leads from '../pages/Leads.jsx'
import Prices from '../pages/Prices.jsx'
import Suppliers from '../pages/Suppliers.jsx'
import Blog from '../pages/Blog.jsx'
import Calendar from '../pages/Calendar.jsx'

const NAV_ITEMS = [
  {
    id: 'calendar',
    label: 'Calendário',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'prices',
    label: 'Preços',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 'suppliers',
    label: 'Fornecedores',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
]

export default function AdminLayout({ onLogout }) {
  const [activePage, setActivePage] = useState('calendar')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function renderPage() {
    switch (activePage) {
      case 'calendar': return <Calendar />
      case 'blog': return <Blog />
      case 'leads': return <Leads />
      case 'prices': return <Prices />
      case 'suppliers': return <Suppliers />
      default: return <Calendar />
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .admin-layout {
          display: flex;
          min-height: 100vh;
          font-family: 'Alexandria', sans-serif;
        }
        .admin-sidebar {
          width: 240px;
          min-height: 100vh;
          background: #555b37;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 100;
        }
        .admin-sidebar-header {
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-sidebar-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .admin-sidebar-title {
          font-size: 13px;
          font-weight: 600;
          color: white;
          line-height: 1.3;
          letter-spacing: 0.02em;
        }
        .admin-sidebar-nav {
          flex: 1;
          padding: 16px 0;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 20px;
          cursor: pointer;
          color: rgba(255,255,255,0.72);
          font-size: 14px;
          font-weight: 500;
          transition: background 0.12s, color 0.12s;
          border-left: 3px solid transparent;
          user-select: none;
        }
        .admin-nav-item:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }
        .admin-nav-item.active {
          background: rgba(255,255,255,0.13);
          color: white;
          border-left-color: rgba(255,255,255,0.6);
        }
        .admin-sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 4px;
          color: rgba(255,255,255,0.8);
          font-family: 'Alexandria', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.12s;
        }
        .admin-logout-btn:hover {
          background: rgba(255,255,255,0.14);
          color: white;
        }
        .admin-content {
          margin-left: 240px;
          flex: 1;
          background: #f8f7f4;
          min-height: 100vh;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
            transition: transform 0.2s;
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-content {
            margin-left: 0;
          }
          .admin-mobile-topbar {
            display: flex !important;
          }
        }
        .admin-mobile-topbar {
          display: none;
          align-items: center;
          gap: 12px;
          background: #555b37;
          padding: 12px 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .admin-hamburger {
          background: none;
          border: none;
          cursor: pointer;
          color: white;
          line-height: 0;
          padding: 4px;
        }
        .admin-mobile-title {
          font-size: 14px;
          font-weight: 600;
          color: white;
        }
        .admin-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 90;
        }
        .admin-overlay.show { display: block; }
      `}</style>

      <div className="admin-layout">
        {/* Mobile overlay */}
        <div
          className={`admin-overlay${sidebarOpen ? ' show' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-header">
            <img src="/isotipo_white.webp" alt="" className="admin-sidebar-logo" />
            <span className="admin-sidebar-title">Jessica da Horta</span>
          </div>

          <nav className="admin-sidebar-nav">
            {NAV_ITEMS.map(item => (
              <div
                key={item.id}
                className={`admin-nav-item${activePage === item.id ? ' active' : ''}`}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button className="admin-logout-btn" onClick={onLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Terminar sessão
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-content">
          {/* Mobile top bar */}
          <div className="admin-mobile-topbar">
            <button className="admin-hamburger" onClick={() => setSidebarOpen(v => !v)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="admin-mobile-title">
              {NAV_ITEMS.find(i => i.id === activePage)?.label || 'Admin'}
            </span>
          </div>

          {renderPage()}
        </main>
      </div>
    </>
  )
}
