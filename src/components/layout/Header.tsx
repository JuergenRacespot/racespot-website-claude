'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/broadcasts', label: 'Broadcasts' },
  { href: '/events',     label: 'Events' },
  { href: '/services',   label: 'Services' },
  { href: '/calendar',   label: 'Calendar' },
  { href: '/live',       label: 'Live', badge: true },
  { href: '/news',       label: 'News' },
]

export function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-rs-black/95 backdrop-blur-sm border-b border-rs-border' : 'bg-transparent'
      }`}
    >
      <div className="container-rs flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-rs-yellow font-bold text-xl tracking-tight">RACESPOT</span>
          <span className="text-rs-muted text-xs font-mono mt-0.5">.tv</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 text-sm text-rs-muted hover:text-rs-white transition-colors duration-150"
            >
              {badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              )}
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/de" className="text-xs text-rs-muted hover:text-rs-yellow transition-colors">
            DE
          </Link>
          <Link href="/contact" className="btn-primary text-xs px-4 py-2">
            Get in touch
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-rs-white transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-rs-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-rs-white transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-rs-dark border-t border-rs-border">
          <nav className="container-rs py-6 flex flex-col gap-4">
            {NAV_LINKS.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-rs-white text-base font-medium"
              >
                {badge && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                {label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary mt-2 self-start">
              Get in touch
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
