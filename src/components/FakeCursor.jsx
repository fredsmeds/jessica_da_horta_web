import { useRef, useEffect } from 'react'

export default function FakeCursor() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = e => {
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'
      el.style.opacity = '1'
    }
    const onLeave = () => { el.style.opacity = '0' }
    const onEnter = () => { el.style.opacity = '1' }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <img
      ref={ref}
      src="/bee.gif"
      alt=""
      aria-hidden="true"
      style={{ position: 'fixed', width: 44, height: 44, pointerEvents: 'none', zIndex: 9999, userSelect: 'none', opacity: 0 }}
    />
  )
}
