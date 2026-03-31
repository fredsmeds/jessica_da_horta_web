import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ScheduleVisit from '../components/ScheduleVisit.jsx'
import Footer from '../components/Footer.jsx'
import FakeCursor from '../components/FakeCursor.jsx'

export default function SchedulePage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  function handleNavClick(id) {
    navigate('/', { state: { scrollTo: id } })
  }

  return (
    <>
      <Navbar activeSection="schedule" onNavClick={handleNavClick} />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <ScheduleVisit />
      </main>
      <Footer onNavClick={handleNavClick} onPrivacyClick={() => {}} />
      <FakeCursor />
    </>
  )
}
