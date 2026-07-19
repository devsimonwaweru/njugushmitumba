/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import {  useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/#hero' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Catalogue', href: '/#catalogue' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 50) }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  function handleNavClick(e, href) {
    if (location.pathname === '/') {
      e.preventDefault()
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-navy-500/97 backdrop-blur-md shadow-[0_1px_0_rgba(212,160,23,0.3)]' : 'bg-transparent'}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <a href="/#hero" onClick={(e) => handleNavClick(e, '/#hero')}>
              <div className="flex items-center gap-3">
                <img src="/njugushmitumba.png" alt="Njugush Mitumba Bales" className="w-10 h-10 rounded-lg object-cover" />
                <div className="hidden sm:block">
                  <div className="text-white font-display font-bold text-lg leading-tight">Njugush Mitumba</div>
                  <div className="text-gold-400 text-[10px] uppercase tracking-[3px] font-medium">Bales</div>
                </div>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-white/80 hover:text-gold-400 text-sm font-medium transition-colors">{link.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="/#catalogue" onClick={(e) => handleNavClick(e, '/#catalogue')} className="hidden sm:inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">Browse Catalogue</a>
              <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white p-2" aria-label="Open menu"><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-[150]" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <div className={`fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-navy-500 z-[160] overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-label="Mobile menu">
        <div className="flex items-center justify-between p-5 border-b border-navy-400">
          <div className="flex items-center gap-3">
            <img src="/njugushmitumba.png" alt="Njugush Mitumba Bales" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-white font-display font-bold">Menu</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white p-1" aria-label="Close menu"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex flex-col p-5 gap-1">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-white/80 hover:text-gold-400 hover:bg-navy-400 px-4 py-3 rounded-lg text-sm font-medium transition-colors">{link.label}</a>
          ))}
          <div className="pt-4 mt-2 border-t border-navy-400">
            <a href="/#catalogue" onClick={(e) => handleNavClick(e, '/#catalogue')} className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold text-sm px-5 py-3 rounded-lg transition-colors">Browse Catalogue</a>
          </div>
        </div>
      </div>
    </>
  )
}