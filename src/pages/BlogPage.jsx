import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Blog from '../components/Blog.jsx'
import Footer from '../components/Footer.jsx'

export default function BlogPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleNavClick(id) {
    navigate('/', { state: { scrollTo: id } })
  }

  return (
    <>
      <Navbar activeSection="blog" onNavClick={handleNavClick} />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <Blog />
      </main>
      <Footer onNavClick={handleNavClick} onPrivacyClick={() => {}} />
    </>
  )
}
